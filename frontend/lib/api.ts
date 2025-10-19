// api/index.ts
import type {
  LoginRequest,
  RegisterRequest,
  TransactionRequest,
  AuthResponse,
  Block,
  Transaction,
  UserWallet,
  MineResponse,
  PendingTransaction,
  SendTransactionResponse,
  BlockChainResponse
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const fetchAPI = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const errMessage = payload?.message || response.statusText || 'API Error';
    const err: any = new Error(errMessage);
    err.status = response.status;
    err.payload = payload;
    throw err;
  }

  return payload;
};

export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const result = await fetchAPI('/user/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!result.success) throw new Error(result.message || 'Login failed');
    return result as AuthResponse;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const result = await fetchAPI('/user/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!result.success) throw new Error(result.message || 'Register failed');
    return result as AuthResponse;
  },

  logout: async (): Promise<void> => {
    await fetchAPI('/user/logout', {
      method: 'POST',
    });
  },

  getDashboardData: async () => {
    return fetchAPI('/user/getDashboard', { method: 'GET' });
  },
};

export const walletAPI = {
  getWallet: async (): Promise<UserWallet> => {
    return fetchAPI('/user/getWallet', { method: 'GET' });
  },
};

export const transactionAPI = {
  createTransaction: async (data: TransactionRequest): Promise<SendTransactionResponse> => {
    return fetchAPI('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getPendingTransactions: async (): Promise<PendingTransaction> => {
    return fetchAPI('/transactions/pending', { method: 'GET' });
  },
};

export const blockchainAPI = {
  getChain: async (): Promise<BlockChainResponse> => {
    return fetchAPI('/block/chain', { method: 'GET' });
  },

  mineBlock: async (): Promise<MineResponse> => {
    return fetchAPI('/block/mine', { method: 'POST' });
  },
};
