import { Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import { AppError } from "../../utils/app-error";
import { AuthenticatedRequest } from "../block/block.types";
import { CreateTransactionRequestDto } from "./transaction.types";


export class TransactionController {
  constructor(private transactionService: TransactionService) { }

  postTransaction = async (req: AuthenticatedRequest<CreateTransactionRequestDto>, res: Response) => {
    try {
      const { recipientAddress, amount } = req.body;
      const userAddress = req.user?.walletAddress;

      if (!userAddress) {
        throw new AppError('Authentication required', 401);
      }

      const newTransaction = await this.transactionService.postTransaction({ senderAddress: userAddress, recipientAddress, amount });

      res.status(201).json({ success: true, message: "Transaction added to pending", newTransaction })
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  getAllPendingTransaction = async (req: Request, res: Response) => {
    try {
      const pendingTransactions = await this.transactionService.getAllPendingTransaction();
      res.status(200).json({ success: true, pendingTransactions })
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}