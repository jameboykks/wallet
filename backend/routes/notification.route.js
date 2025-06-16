import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller.js";
import { authenticate } from "../middleware/auth.js";
const router = Router();

router.get("/", authenticate, NotificationController.list);

export default router;
