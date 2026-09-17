import bcrypt from "bcryptjs";
import { signToken } from "../utils/auth.js";
import pool from "../config/db.js";

const COOKIE_NAME = "access_token";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: false, // true in production with HTTPS
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Register
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const result = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email.toLowerCase()]
    );

    if (result.rows.length) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name, email.toLowerCase(), passwordHash]
    );

    const token = signToken(user.rows[0]);

    res.cookie(COOKIE_NAME, token, cookieOptions);

    res.status(201).json({
      message: "Registration successful",
      user: user.rows[0],
    });
  } catch (error) {
    next(error);
  }
}


// Login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email.toLowerCase()]
    );

    if (!result.rows.length) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = signToken(user);

    res.cookie(COOKIE_NAME, token, cookieOptions);

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
}


// Current user
export async function me(req, res, next) {
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      user: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}


// Logout
export function logout(req, res, next) {
  try {
    res.clearCookie(COOKIE_NAME);

    res.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
}