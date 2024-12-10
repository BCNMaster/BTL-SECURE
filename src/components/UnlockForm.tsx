import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useWallet } from '../contexts/WalletProvider';
import { AlertTriangle, Lock, Fingerprint, Loader2 } from 'lucide-react';

interface UnlockFormProps {
  onSuccess?: () => void;
}

export const UnlockForm: React.FC<UnlockFormProps> = ({ onSuccess }) => {
  const { unlockWallet } = useWallet();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const success = await unlockWallet(password);
      if (success) {
        onSuccess?.();
      } else {
        setError('Invalid password');
      }
    } catch (error) {
      setError('Failed to unlock wallet');
      console.error('Unlock error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricUnlock = async () => {
    setError(null);
    setShowBiometricPrompt(true);

    try {
      // Check if biometric authentication is available
      if (!window.PublicKeyCredential) {
        setError('Biometric authentication is not available');
        return;
      }

      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!available) {
        setError('Biometric authentication is not available');
        return;
      }

      // Request biometric authentication
      // This is a simplified example - in a real implementation,
      // you would need to handle the WebAuthn protocol properly
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          rpId: window.location.hostname,
          userVerification: 'required',
          timeout: 60000
        }
      });

      if (credential) {
        // Verify the credential server-side
        const success = await unlockWallet('biometric');
        if (success) {
          onSuccess?.();
        } else {
          setError('Biometric authentication failed');
        }
      }
    } catch (error) {
      setError('Biometric authentication failed');
      console.error('Biometric error:', error);
    } finally {
      setShowBiometricPrompt(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <Input
            type="password"
            placeholder="Enter your wallet password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading || showBiometricPrompt}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || showBiometricPrompt}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Unlocking...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Unlock with Password
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleBiometricUnlock}
            disabled={isLoading || showBiometricPrompt}
          >
            <Fingerprint className="w-4 h-4 mr-2" />
            {showBiometricPrompt ? 'Scanning...' : 'Use Biometric'}
          </Button>
        </div>
      </form>

      <div className="text-center">
        <button
          type="button"
          className="text-sm text-blue-500 hover:text-blue-600"
          onClick={() => {
            // Add reset password functionality
          }}
          disabled={isLoading || showBiometricPrompt}
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
};

export default UnlockForm;