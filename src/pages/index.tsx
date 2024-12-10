import { useEffect } from 'react';
import { useWallet } from '../contexts/WalletProvider';
import { TokenList } from '../components/TokenList';
import { TransactionForm } from '../components/TransactionForm';
import { WalletSecurity } from '../components/WalletSecurity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, ArrowUpDown, Shield, History } from 'lucide-react';

export default function WalletPage() {
  const { 
    state, 
    refreshBalances,
    sendTransaction,
    addToken,
    removeToken
  } = useWallet();

  useEffect(() => {
    if (!state.isLocked) {
      refreshBalances();
    }
  }, [state.isLocked]);

  if (state.isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              <Wallet className="w-8 h-8 mx-auto mb-2" />
              Unlock Wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add UnlockForm component here */}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Wallet className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Secure Wallet</h1>
          </div>
          <div className="flex items-center space-x-4">
            <select
              className="rounded-lg border p-2"
              value={state.selectedNetwork}
              onChange={(e) => selectNetwork(e.target.value)}
            >
              <option value="ethereum">Ethereum</option>
              <option value="solana">Solana</option>
              <option value="polygon">Polygon</option>
            </select>
          </div>
        </header>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Total Balance</h2>
                <p className="text-3xl font-bold">
                  ${calculateTotalBalance(state.balances)}
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
                  <ArrowUpDown className="w-4 h-4" />
                  <span>Send / Receive</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="assets">
          <TabsList>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="assets">
            <TokenList
              tokens={state.tokens}
              onTokenSelect={(token) => {
                // Handle token selection
              }}
              onSend={(token) => {
                // Open send modal
              }}
              onReceive={(token) => {
                // Open receive modal
              }}
            />
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add TransactionHistory component here */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <WalletSecurity />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function calculateTotalBalance(balances: { [key: string]: string }): string {
  // Add implementation to calculate total balance across all networks
  return '0.00';
}