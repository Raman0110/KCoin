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
import { log } from 'console';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

// Helper function to make authenticated requests
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};

// Authentication APIs
export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const result = await response.json();

    // Store token in localStorage
    if (result.token) {
      localStorage.setItem('auth_token', result.token);
    }

    return result;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message)
    }

    // Store token in localStorage
    if (result.token) {
      localStorage.setItem('auth_token', result.token);
    }

    return result;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
  },
};

// Wallet APIs
export const walletAPI = {
  getWallet: async (): Promise<UserWallet> => {
    return fetchWithAuth('/wallet');
  },
};

// Transaction APIs
export const transactionAPI = {
  createTransaction: async (data: TransactionRequest): Promise<Transaction> => {
    return fetchWithAuth('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getPendingTransactions: async (): Promise<Transaction[]> => {
    return fetchWithAuth('/transactions/pending');
  },
};

// Blockchain APIs
export const blockchainAPI = {
  getChain: async (): Promise<Block[]> => {
    return fetchWithAuth('/chain');
  },

  mineBlock: async (): Promise<MineResponse> => {
    return fetchWithAuth('/mine', {
      method: 'POST',
    });
  },
};