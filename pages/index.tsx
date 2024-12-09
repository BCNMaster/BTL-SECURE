import { useState } from 'react';
import WalletAuth from '../src/components/WalletAuth';
import WalletDashboard from '../src/components/WalletDashboard';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthComplete = () => {
    setIsAuthenticated(true);
  };

  if (isAuthenticated) {
    return <WalletDashboard />;
  }

  return (
    <main className="min-h-screen bg-[#0A0F1E] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Gradient orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-100">
              Welcome to Bottle Chain Wallet
            </h1>
            <p className="text-blue-200 text-lg">Secure. Simple. Reliable.</p>
          </div>
          <div className="w-full max-w-md backdrop-blur-lg bg-white/5 p-8 rounded-2xl shadow-xl border border-white/10">
            <WalletAuth onAuthComplete={handleAuthComplete} />
          </div>
        </div>
      </div>
    </main>
  );
}
