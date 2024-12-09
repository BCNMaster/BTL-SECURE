import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, AlertTriangle, Eye, EyeOff, RefreshCw, Shield, ChevronLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const WalletAuth = ({ onAuthComplete }) => {
  const [step, setStep] = useState('welcome');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mnemonic, setMnemonic] = useState('');
  const [error, setError] = useState('');
  const [generatedMnemonic, setGeneratedMnemonic] = useState([]);

  useEffect(() => {
    if (step === 'backup') {
      // In production, use a proper crypto library for mnemonic generation
      const words = [
        'margin', 'circle', 'balance', 'indoor', 'choice', 'scatter',
        'matrix', 'second', 'battle', 'debate', 'escape', 'journey'
      ];
      setGeneratedMnemonic(words);
    }
  }, [step]);

  const handleCreateWallet = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
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
    setError('');
    onAuthComplete();
  };

  const handleBackupComplete = () => {
    localStorage.setItem('wallet', JSON.stringify({
      mnemonic: generatedMnemonic,
      createdAt: new Date().toISOString()
    }));
    onAuthComplete();
  };

  return (
    <div className="space-y-6">
      {step === 'welcome' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => setStep('create')}
              className="group relative flex items-center justify-center space-x-4 p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 border border-blue-500/20 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-xl bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Shield className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xl font-semibold text-blue-100">Create Secure Wallet</span>
            </button>
            
            <button
              onClick={() => setStep('import')}
              className="group relative flex items-center justify-center space-x-4 p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20 border border-purple-500/20 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-xl bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <KeyRound className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xl font-semibold text-purple-100">Import Existing Wallet</span>
            </button>
          </div>
        </div>
      )}

      {(step === 'create' || step === 'import') && (
        <div className="space-y-6 animate-slideUp">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => setStep('welcome')}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <h2 className="text-2xl font-semibold text-white/90">
              {step === 'create' ? 'Create Secure Wallet' : 'Import Wallet'}
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 text-white placeholder-gray-500"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-300 transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {step === 'import' && (
              <textarea
                placeholder="Enter recovery phrase"
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
                className="w-full p-4 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300 text-white placeholder-gray-500 h-32 resize-none"
              />
            )}

            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <button
              onClick={step === 'create' ? handleCreateWallet : handleImportWallet}
              className="w-full p-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              {step === 'create' ? 'Create Secure Wallet' : 'Import Wallet'}
            </button>
          </div>
        </div>
      )}

      {step === 'backup' && (
        <div className="space-y-6 animate-slideUp">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => setStep('create')}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <h2 className="text-2xl font-semibold text-white/90">Backup Recovery Phrase</h2>
          </div>

          <Alert className="bg-yellow-500/10 border-yellow-500/20">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <AlertDescription className="text-yellow-200">
              Write down these words in the correct order and store them securely. Never share your recovery phrase.
            </AlertDescription>
          </Alert>

          <div className="p-6 rounded-lg bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-white/10">
            <div className="grid grid-cols-3 gap-3">
              {generatedMnemonic.map((word, i) => (
                <div key={i} className="p-3 text-sm text-blue-200 bg-white/5 rounded-lg border border-white/5">
                  {i + 1}. {word}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleBackupComplete}
            className="w-full p-4 rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 text-white font-semibold shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
          >
            I've Securely Saved My Recovery Phrase
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletAuth;
