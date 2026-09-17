import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/url_shortener",
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error:", err.message);
});

export default pool;
