import { Router } from "express";
import { TransactionController } from "../controllers/transaction.controller.js";

import { authenticate } from "../middleware/auth.js";
const router = Router();

router.post("/deposit", authenticate, TransactionController.deposit);
router.post("/transfer", authenticate, TransactionController.transfer);
router.get("/history", authenticate, TransactionController.history);
// router.get("/:id", authenticate, TransactionController.detail);

export default router;
