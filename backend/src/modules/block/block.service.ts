import { AppDataSource } from "../../config/db.config";
import { PendingTransactionService } from "../pendingTransaction/pendingTransaction.service";
import { Transaction } from "../transaction/transaction.entity";
import { Block } from "./block.entity";
import crypto, { UUID } from "crypto";

type blockToHash = {
  index: number,
  timestamp: Date,
  transactions: Transaction[],
  previousHash: string,
  nonce: number
}


export class BlockService {
  private blockRepo = AppDataSource.getRepository(Block);
  private transactionRepo = AppDataSource.getRepository(Transaction);
  private static pendingTransactions: Transaction[] = [];

  private calculateHash(block: blockToHash) {
    const { index, previousHash, timestamp, transactions, nonce } = block;
    const data = index + previousHash + timestamp + JSON.stringify(transactions) + nonce;
    return crypto.createHash("sha256").update(data).digest("hex");
  }

  getBlockchain = async () => {
    const chain = await this.blockRepo.find({
      relations: ["transactions"],
      order: { index: "ASC" }
    });

    return chain;
  }

  mineBlock = async (minerAddress: string) => {
    if (!minerAddress) throw new Error("Miner address required");

    if (BlockService.pendingTransactions.length === 0) throw new Error("No pending transactions to mine");

    const mineReward = this.transactionRepo.create({
      senderAddress: "00",
      recipientAddress: minerAddress,
      amount: 10,
    })

    BlockService.pendingTransactions.push(mineReward);
    const chain = await this.getBlockchain();
    const lastBlock = chain[chain.length - 1];
    const previousHash = lastBlock ? lastBlock.hash : "0";

    const newBlock = this.blockRepo.create({
      index: chain.length,
      previousHash,
      nonce: 0,
      minerAddress,
      transactions: BlockService.pendingTransactions,
    });

    while (true) {
      const hash = this.calculateHash(newBlock);

      if (hash.startsWith("00")) {
        newBlock.hash = hash;
        break;
      }

      newBlock.nonce++;
    }

    await this.blockRepo.save(newBlock);

    BlockService.pendingTransactions = [];

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
    const pendingTransactionService = new PendingTransactionService();
    const pendingTransactions = await pendingTransactionService.getAllPendingTransaction();

    for (const transaction of pendingTransactions) {
      if (transaction.senderAddress === walletAddress) {
        balance -= Number(transaction.amount);
      }
    }

    return balance;
  }
}
