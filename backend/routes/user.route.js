import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
const router = Router();

router.get("/profile", authenticate, UserController.getProfile);
router.put("/profile", authenticate, UserController.updateProfile);
router.post("/change-password", authenticate, UserController.changePassword);
router.get("/balance", authenticate, UserController.getBalance);
router.get("/contacts", authenticate, UserController.getContacts);
router.post("/contacts", authenticate, UserController.addContact);
router.delete("/contacts", authenticate, UserController.removeContact);
router.post('/avatar', authenticate, upload.single('avatar'), (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });
    const url = `/uploads/${file.filename}`;
    res.json({ url });
});

export default router;
