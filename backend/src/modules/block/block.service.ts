import { AppDataSource } from "../../config/db.config";
import { AppError } from "../../utils/app-error";
import { calculateHash } from "../../utils/hash";
import { PendingTransactionService } from "../pendingTransaction/pendingTransaction.service";
import { Transaction } from "../transaction/transaction.entity";
import { Block } from "./block.entity";


export class BlockService {
  private blockRepo = AppDataSource.getRepository(Block);
  private transactionRepo = AppDataSource.getRepository(Transaction);
  private pendingTransactionService = new PendingTransactionService();

  getBlockchain = async () => {
    const chain = await this.blockRepo.find({
      relations: ["transactions"],
      order: { index: "ASC" }
    });

    return chain;
  }

  mineBlock = async (minerAddress: string) => {
    if (!minerAddress) throw new AppError("Miner address required");

    const pendingTransactions = await this.pendingTransactionService.getAllPendingTransaction();
    if (!pendingTransactions || pendingTransactions.length === 0) throw new AppError("No pending transactions to mine");

    const coinbaseTransaction = this.transactionRepo.create({
      senderAddress: "00",
      recipientAddress: minerAddress,
      amount: 10,
    })

    const transactionsForBlock = [...pendingTransactions, coinbaseTransaction];

    const chain = await this.getBlockchain();
    const lastBlock = chain[chain.length - 1];
    const previousHash = lastBlock ? lastBlock.hash : "0";

    const newBlock = this.blockRepo.create({
      index: chain.length,
      previousHash,
      nonce: 0,
      minerAddress,
      transactions: transactionsForBlock,
    });

    while (true) {
      const hash = calculateHash(newBlock);

      if (hash.startsWith("00")) {
        newBlock.hash = hash;
        break;
      }

      newBlock.nonce++;
    }
    await this.blockRepo.save(newBlock);

    await this.pendingTransactionService.emptyPendingTransaction();

    return newBlock;
  }

  calculateBalance = async (walletAddress: string) => {
    let balance = 0;
    const chain = await this.getBlockchain();

    for (const block of chain) {
      for (const transaction of block.transactions) {
        if (transaction.senderAddress === walletAddress) balance -= Number(transaction.amount)
        if (transaction.recipientAddress === walletAddress) balance += Number(transaction.amount)
      }
    }
    return balance;
  }

  calculateAvailableBalance = async (walletAddress: string) => {
    let balance = await this.calculateBalance(walletAddress);

    // Subtract pending transactions where user is the sender
    const pendingTransactions = await this.pendingTransactionService.getAllPendingTransaction();

    for (const transaction of pendingTransactions) {
      if (transaction.senderAddress === walletAddress) {
        balance -= Number(transaction.amount);
      }
    }

    return balance;
  }
}
