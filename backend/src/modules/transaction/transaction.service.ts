import { AppDataSource } from "../../config/db.config";
import { BlockService } from "../block/block.service";
import { CreatePendingTransactionDto, PendingTransactionService } from "../pendingTransaction/pendingTransaction.service";
import { User } from "../user/user.entity";


export class TransactionService {
  private blockService = new BlockService();
  private pendingTransactionService = new PendingTransactionService();
  private userRepo = AppDataSource.getRepository(User)

  async postTransaction(sentKcoin: CreatePendingTransactionDto) {
    if (!sentKcoin.senderAddress || !sentKcoin.recipientAddress) {
      throw new Error("Sender and recipient addresses are required");
    }
    if (!sentKcoin.amount || Number(sentKcoin.amount) <= 0) {
      throw new Error("Amount must be greater than zero");
    }

    const { senderAddress, recipientAddress, amount } = sentKcoin;

    const receiver = await this.userRepo.findOne({ where: { walletAddress: recipientAddress } });
    if (!receiver) throw new Error("Invalid receiver address");

    const sender = await this.userRepo.findOne({ where: { walletAddress: senderAddress } });
    if (!sender) throw new Error("Invalid sender address");

    const senderBalance = await this.blockService.calculateAvailableBalance(senderAddress);
    if (Number(amount) > senderBalance) throw new Error("Insufficient Balance")

    const response = await this.pendingTransactionService.addPendingTransaction(sentKcoin)
    return response;
  }

  async getAllPendingTransaction() {
    const pendingTransaction = await this.pendingTransactionService.getAllPendingTransaction();
    if (!pendingTransaction) throw new Error("No pending transactions")

    return pendingTransaction;
  }
}