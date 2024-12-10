'use client';

import { useEffect, useState } from 'react';
import { TokenList } from '../components/TokenList';
import { TransactionForm } from '../components/TransactionForm';
import { WalletSecurity } from '../components/WalletSecurity';
import { UnlockForm } from '../components/UnlockForm';
import { WalletSecurity as SecurityService } from '../services/security';
import { MarketDataService } from '../services/market';
import { TokenService } from '../services/token';
import { TransactionService } from '../services/transaction';

export default function WalletPage() {
  const [isLocked, setIsLocked] = useState(true);
  const [balances, setBalances] = useState({});
  const [tokens, setTokens] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
  
  const securityService = new SecurityService();
  const marketService = new MarketDataService();
  const tokenService = new TokenService(
    process.env.NEXT_PUBLIC_ETH_RPC_URL || '',
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL || ''
  );

  useEffect(() => {
    // Check if wallet exists and is locked
    checkWalletStatus();
  }, []);

  const checkWalletStatus = async () => {
    // Implement checking for existing wallet and lock status
    const hasWallet = localStorage.getItem('hasWallet');
    if (!hasWallet) {
      // Show create wallet flow
      return;
    }
    // Wallet exists but is locked
    setIsLocked(true);
  };

  const handleUnlock = async (password: string) => {
    try {
      const success = await securityService.verifyPassword('storedEncryptedKey', password);
      if (success) {
        setIsLocked(false);
        await loadWalletData();
      }
      return success;
    } catch (error) {
      console.error('Failed to unlock wallet:', error);
      return false;
    }
  };

  const loadWalletData = async () => {
    try {
      // Load balances
      const addresses = {
        ethereum: 'your-eth-address',
        solana: 'your-solana-address'
      };
      
      const balances = await tokenService.getTokenBalances(
        addresses[selectedNetwork],
        selectedNetwork
      );
      setTokens(balances);

      // Start price updates
      balances.forEach(token => {
        marketService.subscribeToPriceUpdates(token.symbol, (price) => {
          setTokens(current =>
            current.map(t =>
              t.symbol === token.symbol ? { ...t, price } : t
            )
          );
        });
      });
    } catch (error) {
      console.error('Failed to load wallet data:', error);
    }
  };

  if (isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6">Unlock Your Wallet</h1>
          <UnlockForm onSuccess={() => setIsLocked(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Your Wallet</h1>
            <select
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value)}
              className="p-2 border rounded-lg"
            >
              <option value="ethereum">Ethereum</option>
              <option value="solana">Solana</option>
            </select>
          </div>

          {/* Balance Section */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Total Balance</h2>
            {/* Add balance display */}
          </div>

          {/* Tokens List */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Your Assets</h2>
            <TokenList tokens={tokens} />
          </div>

          {/* Transaction Form */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Send</h2>
            <TransactionForm />
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Security</h2>
            <WalletSecurity />
          </div>
        </div>
      </div>
    </div>
  );
}