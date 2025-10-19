import { Router } from "express";
import { verifyToken } from "../../middleware/verifyToken.middleware";
import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";

const router = Router();
const transactionController = new TransactionController(new TransactionService());

router.post("/", verifyToken, transactionController.postTransaction);
router.get("/pending", verifyToken, transactionController.getAllPendingTransaction);

export default router;
