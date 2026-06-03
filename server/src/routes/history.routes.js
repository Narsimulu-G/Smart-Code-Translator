import { Router } from "express";
import {
  getHistory,
  deleteHistory,
  clearHistory,
} from "../controllers/history.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", getHistory);
router.delete("/:id", deleteHistory);
router.delete("/", clearHistory);

export default router;
