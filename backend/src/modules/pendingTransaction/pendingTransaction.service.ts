import { AppDataSource } from "../../config/db.config";
import { AppError } from "../../utils/app-error";
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
    if (!newTransaction) throw new AppError("Unable to create transaction")

    const saved = await this.pendingTransactionRepo.save(newTransaction)
    return saved;
  }

  emptyPendingTransaction = async () => {
    await this.pendingTransactionRepo.clear();
    return { success: true, message: "All pending transactions deleted" };
  };

  pendingTransactionCurrentUser = async (walletAddress: string) => {
    const pendingTransaction = await this.pendingTransactionRepo.findOne({ where: { senderAddress: walletAddress } });
    if (!pendingTransaction) return 0;

    return Number(pendingTransaction.amount)
  }
}