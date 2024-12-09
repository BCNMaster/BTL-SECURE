import React, { useState } from 'react';
import { WalletIcon, ArrowRightLeft, History, Settings, Copy, ExternalLink, RefreshCcw, Layers, PieChart, DollarSign, Bridge } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import NetworkManager from './NetworkManager';
import TokenManager from './TokenManager';
import ChainBridge from './ChainBridge';
import PortfolioAnalytics from './PortfolioAnalytics';
import PriceMonitor from './PriceMonitor';
import TransactionConfirm from './TransactionConfirm';

const WalletDashboard = () => {
  const [balance, setBalance] = useState('0.00');
  const [address, setAddress] = useState('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
  const [copyAlert, setCopyAlert] = useState(false);
  const [activeTab, setActiveTab] = useState('portfolio'); // ['portfolio', 'swap', 'bridge', 'buy']

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopyAlert(true);
    setTimeout(() => setCopyAlert(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="space-y-8">
          {/* Network Selection & Address */}
          <div className="flex justify-between items-center">
            <NetworkManager />
            <div className="flex items-center space-x-2 backdrop-blur-lg bg-white/5 p-2 rounded-lg">
              <div className="font-mono text-sm text-blue-200 truncate max-w-[120px]">
                {address.substring(0, 6)}...{address.substring(address.length - 4)}
              </div>
              <button
                onClick={handleCopyAddress}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4 text-blue-400" />
              </button>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="flex space-x-4 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                activeTab === 'portfolio' 
                ? 'bg-blue-500/20 text-blue-100' 
                : 'hover:bg-white/5 text-gray-400'
              }`}
            >
              <div className="flex items-center space-x-2">
                <PieChart className="w-5 h-5" />
                <span>Portfolio</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('swap')}
              className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                activeTab === 'swap' 
                ? 'bg-blue-500/20 text-blue-100' 
                : 'hover:bg-white/5 text-gray-400'
              }`}
            >
              <div className="flex items-center space-x-2">
                <ArrowRightLeft className="w-5 h-5" />
                <span>Swap</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('bridge')}
              className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                activeTab === 'bridge' 
                ? 'bg-blue-500/20 text-blue-100' 
                : 'hover:bg-white/5 text-gray-400'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5" />
                <span>Bridge</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('buy')}
              className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                activeTab === 'buy' 
                ? 'bg-blue-500/20 text-blue-100' 
                : 'hover:bg-white/5 text-gray-400'
              }`}
            >
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Buy</span>
              </div>
            </button>
          </div>

          {/* Content Area */}
          <div className="backdrop-blur-lg bg-white/5 p-6 rounded-2xl shadow-xl border border-white/10">
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                <PortfolioAnalytics />
                <TokenManager />
                <PriceMonitor />
              </div>
            )}

            {activeTab === 'swap' && (
              <div className="space-y-6">
                <TokenManager mode="swap" />
                <TransactionConfirm />
              </div>
            )}

            {activeTab === 'bridge' && (
              <ChainBridge />
            )}

            {activeTab === 'buy' && (
              <div className="space-y-6">
                <TokenManager mode="buy" />
              </div>
            )}
          </div>
        </div>
      </div>

      {copyAlert && (
        <Alert className="fixed bottom-4 right-4 bg-green-500/10 border-green-500/20">
          <AlertDescription className="text-green-200">
            Address copied to clipboard
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default WalletDashboard;
