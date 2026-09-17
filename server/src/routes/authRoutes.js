import { Router } from "express";
import {
  register,
  login,
  me,
  logout,
} from "../controllers/authController.js";
import { validateBody } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import { registerSchema, loginSchema } from "../utils/authSchemas.js";

const router = Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.get("/me", requireAuth, me);
router.post("/logout", logout);

export default router;
