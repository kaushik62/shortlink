import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  console.error("Redis client error:", err.message);
});

let isConnected = false;

export async function connectRedis() {
  if (isConnected) return;

  await redisClient.connect();
  isConnected = true;
}

export default redisClient;
