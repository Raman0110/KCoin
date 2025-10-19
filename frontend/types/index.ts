export interface TransactionRequest {
  recipientAddress: string;
  amount: number;
}

export interface MineResponse {
  success: boolean;
  block: Block;
  reward: number;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  message: string;
}

export interface Block {
  index: number;
  timestamp: string;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce?: number;
}

export interface BlockChainResponse {
  success: boolean,
  chain: Block[]
}

export interface UserWallet {
  walletAddress: string;
  balance: number;
}

export interface DashboardStat {
  totalPendingTransaction: number,
  totalBlocks: number
}

export interface User {
  id: string;
  email: string;
  username: string;
  walletAddress: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface Transaction {
  id: string;
  senderAddress: string;
  recipientAddress: string;
  amount: number;
  timestamp: string;
}

export interface PendingTransaction {
  success: boolean,
  pendingTransactions: Transaction[]
}

export interface SendTransactionResponse {
  success: boolean,
  message: string
  newTransaction: Transaction[]
}

export interface Block {
  index: number;
  timestamp: string;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce?: number;
}

export interface UserWallet {
  walletAddress: string;
  balance: number;
}

export interface User {
  id: string;
  email: string;
  username: string;
  walletAddress: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}
