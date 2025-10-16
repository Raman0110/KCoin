import { Request, Response } from "express";
import { TransactionService } from "./transaction.service";


export class TransactionController {
  private transactionService = new TransactionService();

  postTransaction = async (req: Request, res: Response) => {
    try {
      const transactionPayload = req.body;
      const userAddress = (req as any).user.walletAddress;

      const newTransaction = await this.transactionService.postTransaction({ senderAddress: userAddress, ...transactionPayload });

      res.status(201).json({ success: true, message: "Transaction added to pending", newTransaction })
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  getAllPendingTransaction = async (req: Request, res: Response) => {
    try {
      const pendingTransactions = await this.transactionService.getAllPendingTransaction();
      res.status(200).json({ success: true, pendingTransactions })
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}