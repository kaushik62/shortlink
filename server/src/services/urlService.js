import pool from "../config/db.js";
import redisClient from "../config/redis.js";
import { encodeBase62WithLength } from "../utils/base62.js";
import { AppError } from "../utils/AppError.js";

const REDIS_TTL_SECONDS = 60 * 60 * 24;
const CACHE_PREFIX = "shorturl:";

function cacheKey(shortCode) {
  return `${CACHE_PREFIX}${shortCode}`;
}

export async function createShortUrl(originalUrl, userId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const idResult = await client.query(
      "SELECT nextval(pg_get_serial_sequence('urls', 'id')) AS id"
    );

    const id = idResult.rows[0].id;
    const shortCode = encodeBase62WithLength(id, 5, 7);

    const result = await client.query(
      `INSERT INTO urls
       (id, user_id, original_url, short_code)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, original_url, short_code, clicks,
                 created_at, updated_at, last_accessed_at`,
      [id, userId, originalUrl, shortCode]
    );

    await client.query("COMMIT");

    try {
      await redisClient.set(cacheKey(shortCode), originalUrl, {
        EX: REDIS_TTL_SECONDS,
      });
    } catch (err) {
      console.error("Failed to cache new URL:", err.message);
    }

    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function listUrls(userId) {
  const result = await pool.query(
    `SELECT id, user_id, original_url, short_code, clicks,
            created_at, updated_at, last_accessed_at
     FROM urls
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
}

export async function getUrlById(id, userId) {
  const result = await pool.query(
    `SELECT id, user_id, original_url, short_code, clicks,
            created_at, updated_at, last_accessed_at
     FROM urls
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );

  if (!result.rowCount) {
    throw new AppError("Short URL not found", 404);
  }

  return result.rows[0];
}

export async function deleteUrl(id, userId) {
  const result = await pool.query(
    `DELETE FROM urls
     WHERE id = $1 AND user_id = $2
     RETURNING short_code`,
    [id, userId]
  );

  if (!result.rowCount) {
    throw new AppError("Short URL not found", 404);
  }

  try {
    await redisClient.del(cacheKey(result.rows[0].short_code));
  } catch (err) {
    console.error("Failed to invalidate Redis cache:", err.message);
  }
}

export async function resolveAndTrackClick(shortCode) {
  let originalUrl = null;

  try {
    originalUrl = await redisClient.get(cacheKey(shortCode));
  } catch (err) {
    console.error("Redis read failed:", err.message);
  }

  if (!originalUrl) {
    const result = await pool.query(
      "SELECT original_url FROM urls WHERE short_code = $1",
      [shortCode]
    );

    if (!result.rowCount) {
      throw new AppError("Short URL not found", 404);
    }

    originalUrl = result.rows[0].original_url;

    try {
      await redisClient.set(cacheKey(shortCode), originalUrl, {
        EX: REDIS_TTL_SECONDS,
      });
    } catch (err) {
      console.error("Failed to populate Redis cache:", err.message);
    }
  }

  // Do not make click analytics block the redirect.
  pool
    .query(
      `UPDATE urls
       SET clicks = clicks + 1,
           last_accessed_at = NOW(),
           updated_at = NOW()
       WHERE short_code = $1`,
      [shortCode]
    )
    .catch((err) => console.error("Failed to update click stats:", err.message));

  return originalUrl;
}
