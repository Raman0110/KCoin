import { Transaction } from "../transaction/transaction.entity"

export type blockToHash = {
  index: number,
  timestamp: Date,
  transactions: Transaction[],
  previousHash: string,
  nonce: number
}