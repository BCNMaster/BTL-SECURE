import { ethers } from 'ethers';
import * as bip39 from 'bip39';
import { Keypair } from '@solana/web3.js';
import CryptoJS from 'crypto-js';

export class WalletSecurity {
  private readonly ENCRYPTION_ALGORITHM = 'aes-256-gcm';
  private readonly KEY_LENGTH = 32;
  private readonly IV_LENGTH = 12;

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
    encryptedPrivateKey: string;
    addresses: {
      ethereum: string;
      solana: string;
    };
  }> {
    // Generate mnemonic
    const mnemonic = bip39.generateMnemonic(256);
    
    // Ethereum wallet
    const ethWallet = ethers.Wallet.fromMnemonic(mnemonic);
    
    // Solana wallet
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const solanaKeypair = Keypair.fromSeed(seed.slice(0, 32));

    // Encrypt private key
    const encryptedPrivateKey = await this.encryptPrivateKey(ethWallet.privateKey, password);

    return {
      mnemonic,
      encryptedPrivateKey,
      addresses: {
        ethereum: ethWallet.address,
        solana: solanaKeypair.publicKey.toString()
      }
    };
  }

  // Encrypt private key
  async encryptPrivateKey(privateKey: string, password: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await this.deriveKey(password, Buffer.from(salt));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      Buffer.from(privateKey)
    );

    // Combine salt + iv + ciphertext + tag
    return Buffer.concat([
      Buffer.from(salt),
      Buffer.from(iv),
      Buffer.from(encrypted)
    ]).toString('base64');
  }

  // Decrypt private key
  async decryptPrivateKey(encryptedKey: string, password: string): Promise<string> {
    try {
      const data = Buffer.from(encryptedKey, 'base64');
      
      const salt = data.slice(0, 16);
      const iv = data.slice(16, 28);
      const ciphertext = data.slice(28);

      const key = await this.deriveKey(password, salt);
      
      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv
        },
        key,
        ciphertext
      );

      return Buffer.from(decrypted).toString();
    } catch (error) {
      throw new Error('Failed to decrypt private key');
    }
  }

  // Verify password
  async verifyPassword(encryptedPrivateKey: string, password: string): Promise<boolean> {
    try {
      await this.decryptPrivateKey(encryptedPrivateKey, password);
      return true;
    } catch {
      return false;
    }
  }

  // Hash sensitive data
  async hashData(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest(
      'SHA-256',
      encoder.encode(data)
    );
    return Buffer.from(hashBuffer).toString('hex');
  }

  // Generate session token
  generateSessionToken(): string {
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    return Buffer.from(randomBytes).toString('base64');
  }

  // Validate biometric
  async validateBiometric(): Promise<boolean> {
    if (!window.PublicKeyCredential) {
      return false;
    }

    try {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch (error) {
      return false;
    }
  }
}
