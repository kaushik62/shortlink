import bcrypt from "bcryptjs";
import { AppError } from "../utils/AppError.js";
import { signToken } from "../utils/auth.js";
import pool from "../config/db.js";

const COOKIE_NAME = "access_token";

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  };
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [normalizedEmail]);
    if (existing.rowCount) throw new AppError("An account with this email already exists", 409);

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, normalizedEmail, passwordHash]
    );

    const user = result.rows[0];
    res.cookie(COOKIE_NAME, signToken(user), cookieOptions());
    res.status(201).json({ success: true, data: { user: publicUser(user) } });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await pool.query(
      "SELECT id, name, email, password_hash FROM users WHERE email = $1",
      [email.toLowerCase()]
    );

    if (!result.rowCount || !(await bcrypt.compare(password, result.rows[0].password_hash))) {
      throw new AppError("Invalid email or password", 401);
    }

    const user = result.rows[0];
    res.cookie(COOKIE_NAME, signToken(user), cookieOptions());
    res.json({ success: true, data: { user: publicUser(user) } });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res) {
  const result = await pool.query(
    "SELECT id, name, email, created_at FROM users WHERE id = $1",
    [req.user.id]
  );
  if (!result.rowCount) return res.status(401).json({ success: false, error: "User not found" });
  res.json({ success: true, data: { user: publicUser(result.rows[0]) } });
}

export function logout(_req, res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  res.json({ success: true, message: "Logged out successfully" });
}
