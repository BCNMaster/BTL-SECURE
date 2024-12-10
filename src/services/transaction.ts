import { ethers } from 'ethers';
import { Connection, Transaction, PublicKey, SystemProgram } from '@solana/web3.js';

export class TransactionService {
  private ethereumProvider: ethers.providers.JsonRpcProvider;
  private solanaConnection: Connection;

  constructor(ethereumRpcUrl: string, solanaRpcUrl: string) {
    this.ethereumProvider = new ethers.providers.JsonRpcProvider(ethereumRpcUrl);
    this.solanaConnection = new Connection(solanaRpcUrl, 'confirmed');
  }

  async sendEthereumTransaction(
    toAddress: string,
    amount: string,
    privateKey: string,
    options: {
      gasLimit?: number;
      gasPrice?: string;
    } = {}
  ): Promise<string> {
    const wallet = new ethers.Wallet(privateKey, this.ethereumProvider);
    
    const tx = {
      to: toAddress,
      value: ethers.utils.parseEther(amount),
      gasLimit: options.gasLimit || await wallet.estimateGas({
        to: toAddress,
        value: ethers.utils.parseEther(amount)
      }),
      gasPrice: options.gasPrice ? ethers.utils.parseUnits(options.gasPrice, 'gwei') 
                               : await this.ethereumProvider.getGasPrice()
    };

    const txResponse = await wallet.sendTransaction(tx);
    return txResponse.hash;
  }

  async sendSolanaTransaction(
    fromKeypair: any,
    toAddress: string,
    amount: number
  ): Promise<string> {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: new PublicKey(toAddress),
        lamports: amount
      })
    );

    const signature = await this.solanaConnection.sendTransaction(
      transaction,
      [fromKeypair]
    );

    await this.solanaConnection.confirmTransaction(signature);
    return signature;
  }

  async getTransactionStatus(txHash: string, network: string): Promise<string> {
    if (network === 'ethereum') {
      return this.getEthereumTransactionStatus(txHash);
    } else if (network === 'solana') {
      return this.getSolanaTransactionStatus(txHash);
    }
    throw new Error('Unsupported network');
  }

  private async getEthereumTransactionStatus(txHash: string): Promise<string> {
    const tx = await this.ethereumProvider.getTransaction(txHash);
    if (!tx) return 'pending';
    
    const receipt = await this.ethereumProvider.getTransactionReceipt(txHash);
    if (!receipt) return 'pending';
    
    return receipt.status ? 'confirmed' : 'failed';
  }

  private async getSolanaTransactionStatus(signature: string): Promise<string> {
    const status = await this.solanaConnection.getSignatureStatus(signature);
    if (!status.value) return 'unknown';
    return status.value.confirmationStatus || 'unknown';
  }
}