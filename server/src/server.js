import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import urlRoutes from "./routes/urlRoutes.js";
import redirectRoutes from "./routes/redirectRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { connectRedis } from "./config/redis.js";
import pool from "./config/db.js";

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      success: true,
      service: "url-shortener-api",
      database: "ok",
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(503).json({
      success: false,
      service: "url-shortener-api",
      database: "error",
      timestamp: new Date().toISOString(),
    });
  }
});

// API routers
app.use("/api/auth", authRoutes);
app.use("/api/urls", urlRoutes);

// Public short-link redirect: GET /abc12
app.use("/", redirectRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  try {
    await pool.query("SELECT 1");
    console.log("Connected to PostgreSQL");

    await connectRedis();
    console.log("Connected to Redis");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
