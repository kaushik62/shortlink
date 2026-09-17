import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, "schema.sql");

async function migrate() {
  try {
    const schema = fs.readFileSync(schemaPath, "utf-8");
    await pool.query(schema);
    console.log("Database migrated successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

migrate();
