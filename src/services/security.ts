import { ethers } from 'ethers';
import * as bip39 from 'bip39';
import { Keypair } from '@solana/web3.js';

export class WalletSecurity {
  private static readonly ENCRYPTION_ALGORITHM = 'aes-256-gcm';
  private static readonly KEY_LENGTH = 32;
  private static readonly IV_LENGTH = 12;

  // Key derivation
  private async deriveKey(password: string, salt: Buffer): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Generate wallet
  async generateWallet(password: string): Promise<{
    mnemonic: string;
    addresses: {
      ethereum: string;
      solana: string;
    };
  }> {
    const mnemonic = bip39.generateMnemonic(256);
    const ethWallet = ethers.Wallet.fromMnemonic(mnemonic);
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const solanaKeypair = Keypair.fromSeed(seed.slice(0, 32));

    return {
      mnemonic,
      addresses: {
        ethereum: ethWallet.address,
        solana: solanaKeypair.publicKey.toString()
      }
    };
  }

  // Verify password
  async verifyPassword(storedHash: string, password: string): Promise<boolean> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return storedHash === Buffer.from(hash).toString('hex');
  }

  // Generate authentication token
  generateAuthToken(): string {
    const token = crypto.getRandomValues(new Uint8Array(32));
    return Buffer.from(token).toString('base64');
  }
}