import { Router } from "express";
import { AdminController } from "../controllers/admin.controller.js";
import { authenticate } from "../middleware/auth.js";
import { isAdmin } from "../middleware/role.js";
const router = Router();

router.get("/users", authenticate, isAdmin, AdminController.listUsers);
router.post("/lock", authenticate, isAdmin, AdminController.lockUser);
router.post("/unlock", authenticate, isAdmin, AdminController.unlockUser);
router.get("/transactions", authenticate, isAdmin, AdminController.listTransactions);
router.get("/dashboard", authenticate, isAdmin, AdminController.dashboard);
router.get("/notifications", authenticate, isAdmin, AdminController.notifications);

export default router;
