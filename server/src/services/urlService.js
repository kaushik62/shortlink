import pool from "../config/db.js";
import redis from "../config/redis.js";
import { encodeBase62WithLength } from "../utils/base62.js";

// Create short URL
export async function createShortUrl(originalUrl, userId) {
  const result = await pool.query(
    "SELECT nextval('urls_id_seq') AS id"
  );

  const id = result.rows[0].id;
  const shortCode = encodeBase62WithLength(id);

  const url = await pool.query(
    `INSERT INTO urls (id, user_id, original_url, short_code)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [id, userId, originalUrl, shortCode]
  );

  // Store in Redis for 24 hours
  try {
    await redis.set(shortCode, originalUrl, {
      EX: 60 * 60 * 24
    });
  } catch (err) {
    console.error("Redis set error:", err);
  }

  return url.rows[0];
}


// Get user's URLs
export async function listUrls(userId) {
  const result = await pool.query(
    "SELECT * FROM urls WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );

  return result.rows;
}


// Get one URL
export async function getUrlById(id, userId) {
  const result = await pool.query(
    "SELECT * FROM urls WHERE id = $1 AND user_id = $2",
    [id, userId]
  );

  return result.rows[0];
}


// Delete URL
export async function deleteUrl(id, userId) {
  const result = await pool.query(
    "DELETE FROM urls WHERE id = $1 AND user_id = $2 RETURNING short_code",
    [id, userId]
  );

  if (result.rows.length > 0) {
    const shortCode = result.rows[0].short_code;
    try {
      await redis.del(shortCode);
    } catch (err) {
      console.error("Redis del error:", err);
    }
  }
}


// Redirect URL
export async function resolveAndTrackClick(shortCode) {
  // Check Redis
  let originalUrl = null;
  try {
    originalUrl = await redis.get(shortCode);
  } catch (err) {
    console.error("Redis get error:", err);
  }

  // If not in Redis, check PostgreSQL
  if (!originalUrl) {
    const result = await pool.query(
      "SELECT original_url FROM urls WHERE short_code = $1",
      [shortCode]
    );

    if (!result.rows.length) {
      throw new Error("URL not found");
    }

    originalUrl = result.rows[0].original_url;

    // Store in Redis for another 24 hours
    try {
      await redis.set(shortCode, originalUrl, {
        EX: 60 * 60 * 24
      });
    } catch (err) {
      console.error("Redis set error:", err);
    }
  }

  // Increase clicks and update last_accessed_at
  await pool.query(
    "UPDATE urls SET clicks = clicks + 1, last_accessed_at = NOW() WHERE short_code = $1",
    [shortCode]
  );

  return originalUrl;
}