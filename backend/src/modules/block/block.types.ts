import { Request } from "express";
import { Transaction } from "../transaction/transaction.entity"

export type blockToHash = {
  index: number,
  timestamp: Date,
  transactions: Transaction[],
  previousHash: string,
  nonce: number
}

export interface AuthenticatedRequest<TBody = any> extends Request {
  user?: {
    walletAddress: string;
    userId?: string;
  };
  body: TBody;
}