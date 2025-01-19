'use client';

import { useState } from 'react';
import Image from 'next/image';

export function Landing() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Simulating wallet connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      localStorage.setItem('walletConnected', 'true');
      window.location.reload();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">BTL Secure Wallet</h1>
          <p className="text-xl text-gray-300">Advanced Cryptocurrency Wallet with Multi-Chain Support</p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg backdrop-blur">
            <h2 className="text-xl font-semibold mb-4">Multi-Chain Support</h2>
            <p className="text-gray-300">Manage assets across multiple blockchain networks from a single interface.</p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg backdrop-blur">
            <h2 className="text-xl font-semibold mb-4">Enhanced Security</h2>
            <p className="text-gray-300">Advanced encryption and multi-factor authentication to protect your assets.</p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg backdrop-blur">
            <h2 className="text-xl font-semibold mb-4">Portfolio Analytics</h2>
            <p className="text-gray-300">Track and analyze your portfolio performance across all chains.</p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg backdrop-blur">
            <h2 className="text-xl font-semibold mb-4">Cross-Chain Bridge</h2>
            <p className="text-gray-300">Seamlessly transfer assets between different blockchain networks.</p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg backdrop-blur">
            <h2 className="text-xl font-semibold mb-4">Token Swaps</h2>
            <p className="text-gray-300">Exchange tokens directly within the wallet interface.</p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg backdrop-blur">
            <h2 className="text-xl font-semibold mb-4">Price Monitoring</h2>
            <p className="text-gray-300">Real-time price tracking and alerts for your assets.</p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </div>
  );
}
