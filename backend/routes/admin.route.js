import { Router } from "express";
import { AdminController } from "../controllers/admin.controller.js";
import { authenticate } from "../middleware/auth.js";
import { isAdmin } from "../middleware/role.js";
const router = Router();

router.get("/users", authenticate, isAdmin, AdminController.getAllUsers);
router.patch("/users/:id/lock", authenticate, isAdmin, AdminController.lockUser);
router.patch("/users/:id/unlock", authenticate, isAdmin, AdminController.unlockUser);
router.get("/transactions", authenticate, isAdmin, AdminController.getAllTransactions);
router.get("/notifications", authenticate, isAdmin, AdminController.getAllNotifications);
router.get("/stats", authenticate, isAdmin, AdminController.getStats);

export default router;
