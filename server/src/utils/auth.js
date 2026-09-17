import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "change-this-development-secret";

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export function signToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
