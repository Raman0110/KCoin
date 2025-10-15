import { Router } from "express";
import { verifyToken } from "../../middleware/verifyToken.middleware";
import { TransactionController } from "./transaction.controller";

const router = Router();
const transactionController = new TransactionController();

router.post("/", verifyToken, transactionController.postTransaction);
router.get("/pending", verifyToken, transactionController.getAllPendingTransaction);

export default router;
