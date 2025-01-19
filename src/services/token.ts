import { ethers } from 'ethers';
import { Connection, PublicKey } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';

export interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
  network: string;
  balance: string;
  price?: number;
}

export class TokenService {
  private ethereumProvider: ethers.providers.JsonRpcProvider;
  private solanaConnection: Connection;

  constructor(ethereumRpcUrl: string, solanaRpcUrl: string) {
    this.ethereumProvider = new ethers.providers.JsonRpcProvider(ethereumRpcUrl);
    this.solanaConnection = new Connection(solanaRpcUrl, 'confirmed');
  }

  async getERC20TokenInfo(tokenAddress: string, walletAddress: string): Promise<TokenInfo> {
    try {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        [
          'function name() view returns (string)',
          'function symbol() view returns (string)',
          'function decimals() view returns (uint8)',
          'function balanceOf(address) view returns (uint256)'
        ],
        this.ethereumProvider
      );

      const [symbol, decimals, balance] = await Promise.all([
        tokenContract.symbol(),
        tokenContract.decimals(),
        tokenContract.balanceOf(walletAddress)
      ]);

      return {
        address: tokenAddress,
        symbol,
        decimals,
        network: 'ethereum',
        balance: ethers.utils.formatUnits(balance, decimals)
      };
    } catch (error) {
      console.error(`Error fetching ERC20 token info for ${tokenAddress}:`, error);
      throw error;
    }
  }

  async getSPLTokenInfo(tokenMintAddress: string, walletAddress: string): Promise<TokenInfo> {
    try {
      const mintPublicKey = new PublicKey(tokenMintAddress);
      const accountInfo = await this.solanaConnection.getTokenAccountsByOwner(
        new PublicKey(walletAddress),
        { mint: mintPublicKey }
      );

      const balance = await this.solanaConnection.getTokenSupply(mintPublicKey);

      return {
        address: tokenMintAddress,
        symbol: '', // Fetch from token metadata
        decimals: balance.value.decimals,
        network: 'solana',
        balance: balance.value.uiAmount?.toString() || '0'
      };
    } catch (error) {
      console.error(`Error fetching SPL token info for ${tokenMintAddress}:`, error);
      throw error;
    }
  }

  async getTokenBalances(walletAddress: string, network: string): Promise<TokenInfo[]> {
    try {
      if (network === 'ethereum') {
        return this.getEthereumTokenBalances(walletAddress);
      } else if (network === 'solana') {
        return this.getSolanaTokenBalances(walletAddress);
      }
      return [];
    } catch (error) {
      console.error(`Error fetching token balances for ${walletAddress} on ${network}:`, error);
      throw error;
    }
  }

  private async getEthereumTokenBalances(walletAddress: string): Promise<TokenInfo[]> {
    try {
      // Implementation for fetching Ethereum token balances
      return [];
    } catch (error) {
      console.error(`Error fetching Ethereum token balances for ${walletAddress}:`, error);
      throw error;
    }
  }

  private async getSolanaTokenBalances(walletAddress: string): Promise<TokenInfo[]> {
    try {
      // Implementation for fetching Solana token balances
      return [];
    } catch (error) {
      console.error(`Error fetching Solana token balances for ${walletAddress}:`, error);
      throw error;
    }
  }
}
