import { AppDataSource } from "../../config/db.config";
import { AppError } from "../../utils/app-error";
import { PendingTransaction } from "./pendingTransaction.entity";
import { CreatePendingTransactionDto } from "./pendingTransaction.types";



export class PendingTransactionService {
  private readonly pendingTransactionRepo = AppDataSource.getRepository(PendingTransaction)

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
    const pendingTransaction = await this.pendingTransactionRepo.find({ where: { senderAddress: walletAddress } });
    const totalPendingAmount = pendingTransaction.reduce((sum, transaction) => sum + Number(transaction.amount), 0)
    if (!pendingTransaction) return 0;

    return totalPendingAmount;
  }

  getPendingTransactionCount = async () => {
    const count = await this.pendingTransactionRepo.count();
    return count;
  }
}