export const SUPPORTED_NETWORKS = {
  ETHEREUM: {
    chainId: '1',
    name: 'Ethereum',
    rpcUrl: process.env.NEXT_PUBLIC_ETH_RPC_URL,
    currencySymbol: 'ETH',
    blockExplorer: 'https://etherscan.io'
  },
  BSC: {
    chainId: '56',
    name: 'Binance Smart Chain',
    rpcUrl: process.env.NEXT_PUBLIC_BSC_RPC_URL,
    currencySymbol: 'BNB',
    blockExplorer: 'https://bscscan.com'
  },
  SOLANA: {
    cluster: 'mainnet-beta',
    name: 'Solana',
    rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
    currencySymbol: 'SOL',
    blockExplorer: 'https://explorer.solana.com'
  },
  POLYGON: {
    chainId: '137',
    name: 'Polygon',
    rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC_URL,
    currencySymbol: 'MATIC',
    blockExplorer: 'https://polygonscan.com'
  }
};

export const SECURITY_CONFIG = {
  encryptionAlgorithm: 'aes-256-gcm',
  passwordHashAlgorithm: 'argon2id',
  mnemonicStrength: 256,
  maxLoginAttempts: 5,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  biometricTimeout: 24 * 60 * 60 * 1000 // 24 hours
};

export const API_CONFIG = {
  coinGecko: {
    baseUrl: 'https://api.coingecko.com/api/v3',
    priceUpdateInterval: 60000, // 1 minute
  },
  moonpay: {
    baseUrl: process.env.NEXT_PUBLIC_MOONPAY_URL,
    apiKey: process.env.NEXT_PUBLIC_MOONPAY_API_KEY
  },
  ramp: {
    baseUrl: process.env.NEXT_PUBLIC_RAMP_URL,
    apiKey: process.env.NEXT_PUBLIC_RAMP_API_KEY
  }
};

export const DATABASE_CONFIG = {
  type: 'encrypted-indexeddb',
  version: 1,
  stores: {
    wallets: 'id, network, address',
    transactions: 'hash, network, status, timestamp',
    tokens: 'address, network, symbol, decimals',
    settings: 'key, value'
  }
};