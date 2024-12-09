import { useEffect } from 'react';
import WalletAuth from '../src/components/WalletAuth';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center space-y-8">
          <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            BTL Secure Wallet
          </h1>
          <div className="w-full max-w-md backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-xl">
            <WalletAuth onAuthComplete={() => console.log('Auth completed')} />
          </div>
        </div>
      </div>
    </main>
  );
}
