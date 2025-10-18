// api/index.ts
import type {
  LoginRequest,
  RegisterRequest,
  TransactionRequest,
  AuthResponse,
  Block,
  Transaction,
  UserWallet,
  MineResponse
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
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
    const result = await fetchWithAuth('/user/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!result.success) throw new Error(result.message || 'Login failed');
    return result as AuthResponse;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const result = await fetchWithAuth('/user/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!result.success) throw new Error(result.message || 'Register failed');
    return result as AuthResponse;
  },

  logout: async (): Promise<void> => {
    await fetchWithAuth('/user/logout', {
      method: 'POST',
    });
  },
};

export const walletAPI = {
  getWallet: async (): Promise<UserWallet> => {
    return fetchWithAuth('/wallet', { method: 'GET' });
  },
};

export const transactionAPI = {
  createTransaction: async (data: TransactionRequest): Promise<Transaction> => {
    return fetchWithAuth('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getPendingTransactions: async (): Promise<Transaction[]> => {
    return fetchWithAuth('/transactions/pending', { method: 'GET' });
  },
};

export const blockchainAPI = {
  getChain: async (): Promise<Block[]> => {
    return fetchWithAuth('/chain', { method: 'GET' });
  },

  mineBlock: async (): Promise<MineResponse> => {
    return fetchWithAuth('/mine', { method: 'POST' });
  },
};
