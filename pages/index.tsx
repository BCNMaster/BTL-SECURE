import { useEffect } from 'react';
import WalletAuth from '../src/components/WalletAuth';
import { Shield, Lock, KeyRound } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0F1E] text-white relative overflow-hidden">
      {/* Security pattern background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Gradient orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Security features */}
        <div className="flex justify-center gap-8 mb-12">
          <div className="flex items-center space-x-2 text-blue-400">
            <Shield className="w-5 h-5" />
            <span className="text-sm">End-to-End Encryption</span>
          </div>
          <div className="flex items-center space-x-2 text-blue-400">
            <Lock className="w-5 h-5" />
            <span className="text-sm">Secure Storage</span>
          </div>
          <div className="flex items-center space-x-2 text-blue-400">
            <KeyRound className="w-5 h-5" />
            <span className="text-sm">Private Keys Protected</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600">
              Bottle Chain Vault
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Enterprise-grade security for your digital assets. Advanced encryption meets intuitive design.
            </p>
          </div>
          
          <div className="w-full max-w-md backdrop-blur-sm bg-white/5 p-8 rounded-2xl shadow-2xl border border-white/10 relative">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur opacity-50 -z-10"></div>
            
            <WalletAuth onAuthComplete={() => console.log('Auth completed')} />
          </div>
        </div>
      </div>
    </main>
  );
}
