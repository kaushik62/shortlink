import { Router } from "express";
import {
  createUrl,
  getAllUrls,
  getUrl,
  removeUrl,
} from "../controllers/urlController.js";
import { validateBody } from "../middleware/validate.js";
import { createUrlSchema } from "../utils/schemas.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.post("/", validateBody(createUrlSchema), createUrl);
router.get("/", getAllUrls);
router.get("/:id", getUrl);
router.delete("/:id", removeUrl);

export default router;
