import { Router } from "express";
import { redirectToOriginal } from "../controllers/urlController.js";

const router = Router();

router.get("/:shortCode", redirectToOriginal);

export default router;
