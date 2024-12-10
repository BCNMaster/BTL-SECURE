import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { WalletState, Token, Transaction, NetworkConfig } from '../types/wallet';
import { SUPPORTED_NETWORKS } from '../config/ui.config';
import { MarketDataService } from '../services/market';
import { TokenService } from '../services/token';
import { TransactionService } from '../services/transaction';

interface WalletContextType {
  state: WalletState;
  initializeWallet: (password: string) => Promise<void>;
  lockWallet: () => void;
  unlockWallet: (password: string) => Promise<boolean>;
  sendTransaction: (transaction: Transaction) => Promise<string>;
  addToken: (token: Token) => void;
  removeToken: (tokenAddress: string, network: string) => void;
  selectNetwork: (networkId: string) => void;
  refreshBalances: () => Promise<void>;
}

type WalletAction =
  | { type: 'INITIALIZE'; payload: Partial<WalletState> }
  | { type: 'LOCK' }
  | { type: 'UNLOCK' }
  | { type: 'SET_NETWORK'; payload: string }
  | { type: 'UPDATE_BALANCES'; payload: { [key: string]: string } }
  | { type: 'ADD_TOKEN'; payload: Token }
  | { type: 'REMOVE_TOKEN'; payload: { address: string; network: string } }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: { hash: string; status: string } };

const initialState: WalletState = {
  isInitialized: false,
  isLocked: true,
  selectedNetwork: 'ethereum',
  addresses: {},
  balances: {},
  tokens: [],
  transactions: [],
  pendingTransactions: []
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

function walletReducer(state: WalletState, action: WalletAction): WalletState {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        ...action.payload,
        isInitialized: true
      };
    case 'LOCK':
      return {
        ...state,
        isLocked: true
      };
    case 'UNLOCK':
      return {
        ...state,
        isLocked: false
      };
    case 'SET_NETWORK':
      return {
        ...state,
        selectedNetwork: action.payload
      };
    case 'UPDATE_BALANCES':
      return {
        ...state,
        balances: {
          ...state.balances,
          ...action.payload
        }
      };
    case 'ADD_TOKEN':
      return {
        ...state,
        tokens: [...state.tokens, action.payload]
      };
    case 'REMOVE_TOKEN':
      return {
        ...state,
        tokens: state.tokens.filter(
          token =>
            token.address !== action.payload.address ||
            token.network !== action.payload.network
        )
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
        pendingTransactions: action.payload.status === 'pending'
          ? [action.payload, ...state.pendingTransactions]
          : state.pendingTransactions
      };
    case 'UPDATE_TRANSACTION':
      const updatedTransactions = state.transactions.map(tx =>
        tx.hash === action.payload.hash
          ? { ...tx, status: action.payload.status }
          : tx
      );
      return {
        ...state,
        transactions: updatedTransactions,
        pendingTransactions: state.pendingTransactions.filter(
          tx => tx.hash !== action.payload.hash
        )
      };
    default:
      return state;
  }
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(walletReducer, initialState);
  
  const marketDataService = new MarketDataService();
  const tokenService = new TokenService(
    SUPPORTED_NETWORKS.ethereum.rpcUrl,
    SUPPORTED_NETWORKS.solana.rpcUrl
  );
  const transactionService = new TransactionService(
    SUPPORTED_NETWORKS.ethereum.rpcUrl,
    SUPPORTED_NETWORKS.solana.rpcUrl
  );

  useEffect(() => {
    if (state.isInitialized && !state.isLocked) {
      refreshBalances();
      const interval = setInterval(refreshBalances, 30000);
      return () => clearInterval(interval);
    }
  }, [state.isInitialized, state.isLocked]);

  const initializeWallet = async (password: string) => {
    try {
      // Initialize wallet logic here
      dispatch({
        type: 'INITIALIZE',
        payload: {
          addresses: {
            ethereum: '0x...', // Generated address
            solana: 'So...' // Generated address
          }
        }
      });
    } catch (error) {
      console.error('Failed to initialize wallet:', error);
      throw error;
    }
  };

  const lockWallet = () => {
    dispatch({ type: 'LOCK' });
  };

  const unlockWallet = async (password: string): Promise<boolean> => {
    try {
      // Verify password and unlock wallet
      dispatch({ type: 'UNLOCK' });
      return true;
    } catch (error) {
      console.error('Failed to unlock wallet:', error);
      return false;
    }
  };

  const sendTransaction = async (transaction: Transaction): Promise<string> => {
    try {
      let txHash;
      if (transaction.network === 'ethereum') {
        txHash = await transactionService.sendEthereumTransaction(
          transaction.to,
          transaction.value,
          'YOUR_PRIVATE_KEY', // Should be securely stored/retrieved
          {}
        );
      } else if (transaction.network === 'solana') {
        txHash = await transactionService.sendSolanaTransaction(
          'YOUR_KEYPAIR', // Should be securely stored/retrieved
          transaction.to,
          parseFloat(transaction.value)
        );
      }

      if (txHash) {
        dispatch({
          type: 'ADD_TRANSACTION',
          payload: {
            ...transaction,
            hash: txHash,
            status: 'pending',
            timestamp: Date.now()
          }
        });
        return txHash;
      }
      throw new Error('Transaction failed');
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw error;
    }
  };

  const addToken = (token: Token) => {
    dispatch({ type: 'ADD_TOKEN', payload: token });
  };

  const removeToken = (tokenAddress: string, network: string) => {
    dispatch({
      type: 'REMOVE_TOKEN',
      payload: { address: tokenAddress, network }
    });
  };

  const selectNetwork = (networkId: string) => {
    if (SUPPORTED_NETWORKS[networkId]) {
      dispatch({ type: 'SET_NETWORK', payload: networkId });
    }
  };

  const refreshBalances = async () => {
    try {
      const balances: { [key: string]: string } = {};
      
      // Fetch native token balances
      for (const [network, address] of Object.entries(state.addresses)) {
        const balance = await tokenService.getTokenBalances(address, network);
        if (balance.length > 0) {
          balances[network] = balance[0].balance;
        }
      }

      dispatch({ type: 'UPDATE_BALANCES', payload: balances });
    } catch (error) {
      console.error('Failed to refresh balances:', error);
    }
  };

  const value = {
    state,
    initializeWallet,
    lockWallet,
    unlockWallet,
    sendTransaction,
    addToken,
    removeToken,
    selectNetwork,
    refreshBalances
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
