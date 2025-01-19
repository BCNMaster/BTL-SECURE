import React, { useState, useEffect } from 'react';
import { Lock, Shield, Fingerprint, Key, AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { WalletSecurity as SecurityService } from '../services/security';

interface SecurityState {
  isBiometricEnabled: boolean;
  is2FAEnabled: boolean;
  isPasswordChangeModalOpen: boolean;
  lastActivity: number;
  sessionTimeout: number;
}

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export const WalletSecurity: React.FC = () => {
  const [state, setState] = useState<SecurityState>({
    isBiometricEnabled: false,
    is2FAEnabled: false,
    isPasswordChangeModalOpen: false,
    lastActivity: Date.now(),
    sessionTimeout: INACTIVITY_TIMEOUT,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const securityService = new SecurityService();

  // Handle inactivity timeout
  useEffect(() => {
    const checkInactivity = () => {
      const now = Date.now();
      if (now - state.lastActivity > state.sessionTimeout) {
        handleLockWallet();
      }
    };

    const interval = setInterval(checkInactivity, 1000);
    const updateActivity = () => setState(prev => ({ ...prev, lastActivity: Date.now() }));

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
    };
  }, [state.sessionTimeout]);

  const handleLockWallet = () => {
    // Implement wallet locking logic
    console.log('Wallet locked due to inactivity');
  };

  const toggleBiometric = async () => {
    try {
      if (!state.isBiometricEnabled) {
        // Request biometric authentication
        const isBiometricAvailable = await securityService.validateBiometric();
        if (!isBiometricAvailable) {
          setError('Biometric authentication is not available on this device');
          return;
        }
      }

      setState(prev => ({
        ...prev,
        isBiometricEnabled: !prev.isBiometricEnabled
      }));
      
      setSuccess('Biometric settings updated successfully');
    } catch (error) {
      setError('Failed to update biometric settings');
    }
  };

  const toggle2FA = async () => {
    try {
      if (!state.is2FAEnabled) {
        // Generate and display 2FA QR code
        setState(prev => ({ ...prev, is2FAEnabled: true }));
        setSuccess('2FA enabled successfully. Please save your backup codes.');
      } else {
        // Verify 2FA code before disabling
        setState(prev => ({ ...prev, is2FAEnabled: false }));
        setSuccess('2FA disabled successfully');
      }
    } catch (error) {
      setError('Failed to update 2FA settings');
    }
  };

  const handlePasswordChange = async () => {
    try {
      setError(null);

      // Validate password requirements
      if (passwordForm.newPassword.length < 12) {
        setError('Password must be at least 12 characters long');
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setError('New passwords do not match');
        return;
      }

      // Implement password change logic here
      const success = await securityService.verifyPassword(passwordForm.currentPassword, passwordForm.newPassword);
      if (success) {
        setSuccess('Password updated successfully');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setState(prev => ({ ...prev, isPasswordChangeModalOpen: false }));
      } else {
        setError('Failed to update password');
      }
    } catch (error) {
      setError('Failed to update password');
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Security Settings</h2>
        <Button
          variant="outline"
          onClick={handleLockWallet}
          className="flex items-center space-x-2"
        >
          <Lock className="w-4 h-4" />
          <span>Lock Wallet</span>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Key className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="font-semibold">Password Protection</h3>
                <p className="text-sm text-gray-600">Update your wallet password</p>
              </div>
            </div>
            <Button
              onClick={() => setState(prev => ({ ...prev, isPasswordChangeModalOpen: true }))}
            >
              Change Password
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Fingerprint className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="font-semibold">Biometric Authentication</h3>
                <p className="text-sm text-gray-600">
                  {state.isBiometricEnabled 
                    ? 'Biometric authentication is enabled'
                    : 'Enable fingerprint or face recognition'}
                </p>
              </div>
            </div>
            <Button
              variant={state.isBiometricEnabled ? 'default' : 'outline'}
              onClick={toggleBiometric}
            >
              {state.isBiometricEnabled ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="font-semibold">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600">
                  {state.is2FAEnabled
                    ? '2FA is currently enabled'
                    : 'Add an extra layer of security'}
                </p>
              </div>
            </div>
            <Button
              variant={state.is2FAEnabled ? 'default' : 'outline'}
              onClick={toggle2FA}
            >
              {state.is2FAEnabled ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        open={state.isPasswordChangeModalOpen}
        onOpenChange={(open) => setState(prev => ({ ...prev, isPasswordChangeModalOpen: open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Choose a strong password that you haven't used elsewhere.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>
              <Input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({
                  ...prev,
                  currentPassword: e.target.value
                }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({
                  ...prev,
                  newPassword: e.target.value
                }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm New Password</label>
              <Input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({
                  ...prev,
                  confirmPassword: e.target.value
                }))}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setState(prev => ({ ...prev, isPasswordChangeModalOpen: false }))}
            >
              Cancel
            </Button>
            <Button onClick={handlePasswordChange}>Update Password</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletSecurity;
