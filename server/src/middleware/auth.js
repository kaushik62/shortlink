import { verifyToken } from "../utils/auth.js";
import { AppError } from "../utils/AppError.js";

export function requireAuth(req, _res, next) {
  try {
    const token = req.cookies?.access_token;
    if (!token) throw new AppError("Authentication required", 401);

    const payload = verifyToken(token);
    req.user = { id: Number(payload.sub), email: payload.email, name: payload.name };
    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(new AppError("Invalid or expired session", 401));
  }
}
