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

  async estimateGas(
    toAddress: string,
    amount: string,
    options: {
      gasLimit?: number;
      gasPrice?: string;
    } = {}
  ): Promise<{ estimatedCost: string; maxCost: string }> {
    const gasPrice = options.gasPrice
      ? ethers.utils.parseUnits(options.gasPrice, 'gwei')
      : await this.ethereumProvider.getGasPrice();

    const gasLimit = options.gasLimit || await this.ethereumProvider.estimateGas({
      to: toAddress,
      value: ethers.utils.parseEther(amount)
    });

    const estimatedCost = gasPrice.mul(gasLimit);
    const maxCost = estimatedCost.mul(ethers.BigNumber.from(2)); // Assuming max cost is double the estimated cost

    return {
      estimatedCost: ethers.utils.formatEther(estimatedCost),
      maxCost: ethers.utils.formatEther(maxCost)
    };
  }

  async getGasPrice(): Promise<{ slow: string; medium: string; fast: string }> {
    const gasPrice = await this.ethereumProvider.getGasPrice();
    return {
      slow: gasPrice.mul(ethers.BigNumber.from(0.8)).toString(),
      medium: gasPrice.toString(),
      fast: gasPrice.mul(ethers.BigNumber.from(1.2)).toString()
    };
  }

  formatGasPrice(gasPrice: string): string {
    return `${ethers.utils.formatUnits(gasPrice, 'gwei')} Gwei`;
  }

  formatCost(cost: string): string {
    return `${ethers.utils.formatEther(cost)} ETH`;
  }
}
