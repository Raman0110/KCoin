import { AppDataSource } from "../../config/db.config";
import { AppError } from "../../utils/app-error";
import { BlockService } from "../block/block.service";
import { PendingTransactionService } from "../pendingTransaction/pendingTransaction.service";
import { CreatePendingTransactionDto } from "../pendingTransaction/pendingTransaction.types";
import { User } from "../user/user.entity";


export class TransactionService {
  private readonly blockService = new BlockService();
  private readonly pendingTransactionService = new PendingTransactionService();
  private readonly userRepo = AppDataSource.getRepository(User)

  postTransaction = async (sentKcoin: CreatePendingTransactionDto) => {
    if (!sentKcoin.senderAddress || !sentKcoin.recipientAddress) {
      throw new AppError("Sender and recipient addresses are required");
    }
    if (!sentKcoin.amount || Number(sentKcoin.amount) <= 0) {
      throw new AppError("Amount must be greater than zero");
    }

    const { senderAddress, recipientAddress, amount } = sentKcoin;

    const receiver = await this.userRepo.findOne({ where: { walletAddress: recipientAddress } });
    if (!receiver) throw new AppError("Invalid receiver address");

    const sender = await this.userRepo.findOne({ where: { walletAddress: senderAddress } });
    if (!sender) throw new AppError("Invalid sender address");

    const senderBalance = await this.blockService.calculateAvailableBalance(senderAddress);
    if (Number(amount) > senderBalance) throw new AppError("Insufficient Balance")

    const response = await this.pendingTransactionService.addPendingTransaction(sentKcoin)
    return response;
  }

  getAllPendingTransaction = async () => {
    const pendingTransaction = await this.pendingTransactionService.getAllPendingTransaction();
    if (!pendingTransaction) throw new AppError("No pending transactions")

    return pendingTransaction;
  }
}