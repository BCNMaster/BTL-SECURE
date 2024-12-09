import React, { useState } from 'react';
import { Lock, Key, AlertTriangle, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const WalletAuth = ({ onAuthComplete }) => {
  const [step, setStep] = useState('welcome');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mnemonic, setMnemonic] = useState('');
  const [error, setError] = useState('');

  const handleCreateWallet = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    // Add your wallet creation logic here
    setError('');
    setStep('backup');
  };

  const handleImportWallet = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (!mnemonic) {
      setError('Please enter your recovery phrase');
      return;
    }
    // Add your wallet import logic here
    setError('');
    onAuthComplete();
  };

  return (
    <div className="space-y-6">
      {step === 'welcome' && (
        <div className="space-y-4 animate-fadeIn">
          <h2 className="text-2xl font-semibold text-white/90 text-center">Welcome to BTL Secure</h2>
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => setStep('create')}
              className="flex items-center justify-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
            >
              <Lock className="w-5 h-5" />
              <span>Create New Wallet</span>
            </button>
            <button
              onClick={() => setStep('import')}
              className="flex items-center justify-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
            >
              <Key className="w-5 h-5" />
              <span>Import Existing Wallet</span>
            </button>
          </div>
        </div>
      )}

      {(step === 'create' || step === 'import') && (
        <div className="space-y-4 animate-slideUp">
          <h2 className="text-2xl font-semibold text-white/90 text-center">
            {step === 'create' ? 'Create New Wallet' : 'Import Wallet'}
          </h2>
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200 text-white"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-white/60 hover:text-white/90"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {step === 'import' && (
              <textarea
                placeholder="Enter recovery phrase"
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200 text-white h-24"
              />
            )}

            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setStep('welcome')}
                className="flex-1 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 text-white/90 hover:text-white"
              >
                Back
              </button>
              <button
                onClick={step === 'create' ? handleCreateWallet : handleImportWallet}
                className="flex-1 p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-white shadow-lg hover:shadow-blue-500/25"
              >
                {step === 'create' ? 'Create Wallet' : 'Import Wallet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'backup' && (
        <div className="space-y-4 animate-slideUp">
          <h2 className="text-2xl font-semibold text-white/90 text-center">Backup Recovery Phrase</h2>
          <Alert className="bg-yellow-500/10 border-yellow-500/20">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              Write down these words in the correct order and store them safely. Never share your recovery phrase with anyone.
            </AlertDescription>
          </Alert>

          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="p-2 text-sm text-white/90 bg-white/5 rounded">
                  {i + 1}. Word {i + 1}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onAuthComplete}
            className="w-full p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-200 text-white shadow-lg hover:shadow-green-500/25"
          >
            I've Saved My Recovery Phrase
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletAuth;
