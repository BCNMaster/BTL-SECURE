export interface Network {
  id: string;
  name: string;
  rpcUrl: string;
  symbol: string;
  blockExplorer: string;
  chainId?: number;
  decimals: number;
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  network: string;
  balance: string;
  price?: number;
  logoURI?: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  network: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  gasUsed?: number;
  gasPrice?: string;
  nonce?: number;
}

export interface WalletState {
  isInitialized: boolean;
  isLocked: boolean;
  selectedNetwork: string;
  addresses: {
    [network: string]: string;
  };
  balances: {
    [network: string]: string;
  };
  tokens: Token[];
  transactions: Transaction[];
  pendingTransactions: Transaction[];
}

export interface TransactionOptions {
  gasLimit?: number;
  gasPrice?: string;
  nonce?: number;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
}

export interface TransactionRequest {
  to: string;
  value: string;
  data?: string;
  network: string;
  options?: TransactionOptions;
}

export interface SecurityConfig {
  isBiometricEnabled: boolean;
  is2FAEnabled: boolean;
  autoLockTimeout: number;
  lastActivity: number;
}

export interface MarketData {
  price: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  volume24h: number;
  marketCap: number;
  circulatingSupply: number;
  totalSupply: number;
}

export interface NetworkStats {
  blockHeight: number;
  gasPrice?: string;
  avgBlockTime?: number;
  tps?: number;
}

export interface WalletError extends Error {
  code?: string;
  data?: any;
}

export type TransactionStatus = 'pending' | 'confirmed' | 'failed';

export interface TransactionReceipt {
  hash: string;
  status: TransactionStatus;
  blockNumber?: number;
  gasUsed?: number;
  effectiveGasPrice?: string;
  confirmations?: number;
}

export interface AddressBook {
  name: string;
  address: string;
  network: string;
  notes?: string;
}

export interface NetworkConfig {
  [networkId: string]: {
    rpcUrl: string;
    chainId?: number;
    explorer: string;
    tokens: Token[];
  };
}

export interface WalletConfig {
  networks: NetworkConfig;
  defaultNetwork: string;
  autoLockTimeout: number;
  theme: 'light' | 'dark' | 'system';
  language: string;
  currency: string;
}
