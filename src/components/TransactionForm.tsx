import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { TokenInfo } from '../services/token';
import { TransactionService } from '../services/transaction';
import { FraudDetectionService } from '../services/fraudDetection';
import { AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';

interface TransactionFormProps {
  token: TokenInfo;
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
}

interface TransactionFormState {
  recipient: string;
  amount: string;
  gasPrice?: string;
  isProcessing: boolean;
  error: string | null;
  estimatedFee: string | null;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  token,
  onSuccess,
  onError
}) => {
  const [state, setState] = useState<TransactionFormState>({
    recipient: '',
    amount: '',
    gasPrice: '',
    isProcessing: false,
    error: null,
    estimatedFee: null
  });

  const [fraudRisk, setFraudRisk] = useState<{
    isHighRisk: boolean;
    reasons: string[];
  } | null>(null);

  const transactionService = new TransactionService(
    process.env.NEXT_PUBLIC_ETH_RPC_URL || '',
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL || ''
  );

  const fraudDetectionService = new FraudDetectionService();

  useEffect(() => {
    if (state.recipient && state.amount) {
      estimateTransactionFee();
      checkFraudRisk();
    }
  }, [state.recipient, state.amount]);

  const estimateTransactionFee = async () => {
    try {
      if (token.network === 'ethereum') {
        const gasEstimate = await transactionService.estimateEthereumGas(
          state.recipient,
          state.amount,
          token.address
        );
        setState(prev => ({
          ...prev,
          estimatedFee: `Estimated fee: ${gasEstimate} GWEI`
        }));
      } else if (token.network === 'solana') {
        const fee = await transactionService.getSolanaFees();
        setState(prev => ({
          ...prev,
          estimatedFee: `Estimated fee: ${fee} SOL`
        }));
      }
    } catch (error) {
      console.error('Error estimating fee:', error);
    }
  };

  const checkFraudRisk = async () => {
    try {
      const risk = await fraudDetectionService.analyzeTransaction({
        to: state.recipient,
        value: state.amount,
        timestamp: Date.now() / 1000
      });

      setFraudRisk({
        isHighRisk: risk.isHighRisk,
        reasons: risk.reasons
      });
    } catch (error) {
      console.error('Error checking fraud risk:', error);
    }
  };

  const validateTransaction = (): boolean => {
    if (!state.recipient) {
      setState(prev => ({ ...prev, error: 'Recipient address is required' }));
      return false;
    }

    if (!state.amount || parseFloat(state.amount) <= 0) {
      setState(prev => ({ ...prev, error: 'Invalid amount' }));
      return false;
    }

    const balance = parseFloat(token.balance);
    const amount = parseFloat(state.amount);
    if (amount > balance) {
      setState(prev => ({ ...prev, error: 'Insufficient balance' }));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, error: null }));

    if (!validateTransaction()) {
      return;
    }

    if (fraudRisk?.isHighRisk) {
      const confirmed = window.confirm(
        'This transaction has been flagged as potentially risky. Are you sure you want to proceed?'
      );
      if (!confirmed) {
        return;
      }
    }

    try {
      setState(prev => ({ ...prev, isProcessing: true }));

      let txHash;
      if (token.network === 'ethereum') {
        txHash = await transactionService.sendEthereumTransaction(
          state.recipient,
          state.amount,
          'YOUR_PRIVATE_KEY', // In practice, this should be securely stored/retrieved
          { gasPrice: state.gasPrice }
        );
      } else if (token.network === 'solana') {
        txHash = await transactionService.sendSolanaTransaction(
          'YOUR_KEYPAIR', // In practice, this should be securely stored/retrieved
          state.recipient,
          parseFloat(state.amount)
        );
      }

      if (txHash) {
        onSuccess?.(txHash);
        setState({
          recipient: '',
          amount: '',
          gasPrice: '',
          isProcessing: false,
          error: null,
          estimatedFee: null
        });
      }
    } catch (error) {
      console.error('Transaction error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
      setState(prev => ({ ...prev, error: errorMessage, isProcessing: false }));
      onError?.(error instanceof Error ? error : new Error('Transaction failed'));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send {token.symbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Recipient Address</label>
            <Input
              placeholder="Enter recipient address"
              value={state.recipient}
              onChange={(e) => setState(prev => ({ ...prev, recipient: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="0.0"
                value={state.amount}
                onChange={(e) => setState(prev => ({ ...prev, amount: e.target.value }))}
              />
              <span className="text-sm font-medium">{token.symbol}</span>
            </div>
            {token.price && state.amount && (
              <p className="text-sm text-gray-500">
                ≈ ${(parseFloat(state.amount) * token.price).toFixed(2)} USD
              </p>
            )}
          </div>

          {token.network === 'ethereum' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Gas Price (Optional)</label>
              <Input
                placeholder="Enter gas price in GWEI"
                value={state.gasPrice}
                onChange={(e) => setState(prev => ({ ...prev, gasPrice: e.target.value }))}
              />
            </div>
          )}

          {state.estimatedFee && (
            <p className="text-sm text-gray-500">{state.estimatedFee}</p>
          )}

          {fraudRisk?.isHighRisk && (
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertTitle>Warning: High-Risk Transaction</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-4 mt-2">
                  {fraudRisk.reasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {state.error && (
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={state.isProcessing}
          >
            {state.isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4 mr-2" />
                Send {token.symbol}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;