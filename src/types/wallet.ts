export interface WalletState {
  isInitialized: boolean;
  isLocked: boolean;
  selectedNetwork: string;
  addresses: { [key: string]: string };
  balances: { [key: string]: string };
  tokens: Token[];
  transactions: Transaction[];
  pendingTransactions: Transaction[];
}

export interface Token {
  address: string;
  symbol: string;
  decimals: number;
  network: string;
  balance?: string;
}

export interface Transaction {
  hash?: string;
  from: string;
  to: string;
  value: string;
  network: string;
  status?: string;
  timestamp?: number;
}
