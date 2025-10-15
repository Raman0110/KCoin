import { AppDataSource } from "../../config/db.config";
import { PendingTransaction } from "./pendingTransaction.entity";


export type CreatePendingTransactionDto = {
  senderAddress: string;
  recipientAddress: string;
  amount: number;
};

export class PendingTransactionService {
  private pendingTransactionRepo = AppDataSource.getRepository(PendingTransaction)

  getAllPendingTransaction = async () => {
    const pendingTransactions = await this.pendingTransactionRepo.find({
      order: { timestamp: 'ASC' },
    });
    return pendingTransactions
  };

  addPendingTransaction = async (transaction: CreatePendingTransactionDto) => {
    const newTransaction = this.pendingTransactionRepo.create(transaction);
    if (!newTransaction) throw new Error("Unable to create transaction")

    const saved = await this.pendingTransactionRepo.save(newTransaction)
    return saved;
  }

  emptyPendingTransaction = async () => {
    await this.pendingTransactionRepo.clear();
    return { success: true, message: "All pending transactions deleted" };
  };
}