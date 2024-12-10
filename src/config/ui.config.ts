import { NetworkConfig } from '../types/wallet';

export const SUPPORTED_NETWORKS: NetworkConfig = {
  ethereum: {
    rpcUrl: process.env.NEXT_PUBLIC_ETH_RPC_URL || '',
    chainId: 1,
    explorer: 'https://etherscan.io',
    tokens: [
      {
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        symbol: 'WETH',
        name: 'Wrapped Ether',
        decimals: 18,
        network: 'ethereum',
        balance: '0',
        logoURI: '/tokens/weth.png'
      },
      {
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        network: 'ethereum',
        balance: '0',
        logoURI: '/tokens/usdc.png'
      },
    ]
  },
  solana: {
    rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || '',
    explorer: 'https://explorer.solana.com',
    tokens: [
      {
        address: 'So11111111111111111111111111111111111111112',
        symbol: 'SOL',
        name: 'Solana',
        decimals: 9,
        network: 'solana',
        balance: '0',
        logoURI: '/tokens/sol.png'
      },
      {
        address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        network: 'solana',
        balance: '0',
        logoURI: '/tokens/usdc.png'
      },
    ]
  },
  polygon: {
    rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || '',
    chainId: 137,
    explorer: 'https://polygonscan.com',
    tokens: [
      {
        address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
        symbol: 'WMATIC',
        name: 'Wrapped Matic',
        decimals: 18,
        network: 'polygon',
        balance: '0',
        logoURI: '/tokens/matic.png'
      }
    ]
  }
};

export const UI_CONFIG = {
  theme: {
    primary: '#3B82F6',
    secondary: '#1E293B',
    accent: '#F59E0B',
    background: '#F8FAFC',
    text: '#1E293B',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B'
  },
  animations: {
    duration: '150ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  },
  layout: {
    maxWidth: '1200px',
    padding: '1rem'
  },
  toast: {
    duration: 5000,
    position: 'bottom-right'
  }
};

export const TRANSACTION_DEFAULTS = {
  ethereum: {
    gasLimit: 21000,
    maxFeePerGas: '50', // GWEI
    maxPriorityFeePerGas: '1.5' // GWEI
  },
  solana: {
    commitment: 'confirmed'
  },
  polygon: {
    gasLimit: 21000,
    maxFeePerGas: '30', // GWEI
    maxPriorityFeePerGas: '1' // GWEI
  }
};

export const SECURITY_SETTINGS = {
  passwordMinLength: 12,
  passwordRequirements: {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  },
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  backupPhraseWordCount: 24
};

export const API_CONFIG = {
  endpoints: {
    prices: 'https://api.coingecko.com/api/v3',
    ethereum: process.env.NEXT_PUBLIC_ETH_RPC_URL,
    solana: process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
    polygon: process.env.NEXT_PUBLIC_POLYGON_RPC_URL
  },
  refreshIntervals: {
    prices: 60000, // 1 minute
    balances: 30000, // 30 seconds
    transactions: 15000 // 15 seconds
  },
  batchSize: 100
};
