import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.js";
const router = Router();

router.get("/profile", authenticate, UserController.getProfile);
router.put("/profile", authenticate, UserController.updateProfile);
router.post("/change-password", authenticate, UserController.changePassword);
router.get("/balance", authenticate, UserController.getBalance);
router.get("/contacts", authenticate, UserController.getContacts);
router.post("/contacts", authenticate, UserController.addContact);
router.delete("/contacts", authenticate, UserController.removeContact);

export default router;
