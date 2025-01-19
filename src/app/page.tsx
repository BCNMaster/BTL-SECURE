'use client';

import { Dashboard } from '@/components/Dashboard';
import { Landing } from '@/components/Landing';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    // Check if wallet is connected from local storage
    const walletStatus = localStorage.getItem('walletConnected');
    if (walletStatus === 'true') {
      setIsWalletConnected(true);
    }
  }, []);

  return isWalletConnected ? <Dashboard /> : <Landing />;
}
