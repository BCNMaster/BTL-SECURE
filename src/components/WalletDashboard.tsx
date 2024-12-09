import React, { useState } from 'react';
import { WalletIcon, ArrowRightLeft, History, Settings, Copy, ExternalLink, RefreshCcw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const WalletDashboard = () => {
  const [balance, setBalance] = useState('0.00');
  const [address, setAddress] = useState('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
  const [copyAlert, setCopyAlert] = useState(false);

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
        {/* Main Content */}
        <div className="space-y-8">
          {/* Balance Card */}
          <div className="backdrop-blur-lg bg-white/5 p-8 rounded-2xl shadow-xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-blue-100">Wallet Balance</h2>
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <RefreshCcw className="w-5 h-5 text-blue-400" />
              </button>
            </div>
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              ${balance} BTL
            </div>
          </div>

          {/* Address Card */}
          <div className="backdrop-blur-lg bg-white/5 p-6 rounded-2xl shadow-xl border border-white/10">
            <h2 className="text-xl font-semibold text-blue-100 mb-4">Wallet Address</h2>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-white/5 p-3 rounded-lg font-mono text-sm text-blue-200 overflow-hidden">
                {address}
              </div>
              <button
                onClick={handleCopyAddress}
                className="p-3 hover:bg-white/5 rounded-lg transition-colors"
                title="Copy address"
              >
                <Copy className="w-5 h-5 text-blue-400" />
              </button>
              <button
                className="p-3 hover:bg-white/5 rounded-lg transition-colors"
                title="View in explorer"
              >
                <ExternalLink className="w-5 h-5 text-blue-400" />
              </button>
            </div>
            {copyAlert && (
              <Alert className="mt-4 bg-green-500/10 border-green-500/20">
                <AlertDescription className="text-green-200">
                  Address copied to clipboard
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="group relative flex items-center justify-center space-x-4 p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 border border-blue-500/20 transition-all duration-300">
              <div className="absolute inset-0 rounded-xl bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <ArrowRightLeft className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xl font-semibold text-blue-100">Send/Receive</span>
            </button>

            <button className="group relative flex items-center justify-center space-x-4 p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20 border border-purple-500/20 transition-all duration-300">
              <div className="absolute inset-0 rounded-xl bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <History className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xl font-semibold text-purple-100">History</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;
