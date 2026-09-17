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
  await redis.set(shortCode, originalUrl, {
    EX: 60 * 60 * 24
  });

  return url.rows[0];
}


// Get user's URLs
export async function listUrls(userId) {
  const result = await pool.query(
    "SELECT * FROM urls WHERE user_id = $1",
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
  await pool.query(
    "DELETE FROM urls WHERE id = $1 AND user_id = $2",
    [id, userId]
  );
}


// Redirect URL
export async function resolveAndTrackClick(shortCode) {
  // Check Redis
  let originalUrl = await redis.get(shortCode);

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
    await redis.set(shortCode, originalUrl, {
      EX: 60 * 60 * 24
    });
  }

  // Increase clicks
  await pool.query(
    "UPDATE urls SET clicks = clicks + 1 WHERE short_code = $1",
    [shortCode]
  );

  return originalUrl;
}