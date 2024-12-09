import { openDB, IDBPDatabase } from 'idb';
import { Buffer } from 'buffer';
import { subtle } from 'crypto';

export class SecureDatabase {
  private db: IDBPDatabase | null = null;
  private encryptionKey: CryptoKey | null = null;

  async initialize(password: string): Promise<void> {
    // Generate encryption key from password
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const keyMaterial = await subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    this.encryptionKey = await subtle.deriveKey(
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

    // Initialize IndexedDB
    this.db = await openDB('secure-wallet', 1, {
      upgrade(db) {
        // Wallets store
        db.createObjectStore('wallets', { keyPath: 'id' });
        
        // Transactions store
        const txStore = db.createObjectStore('transactions', { keyPath: 'hash' });
        txStore.createIndex('address', 'address');
        txStore.createIndex('timestamp', 'timestamp');
        
        // Tokens store
        const tokenStore = db.createObjectStore('tokens', { keyPath: 'address' });
        tokenStore.createIndex('network', 'network');
        
        // Settings store
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    });
  }

  async encrypt(data: any): Promise<string> {
    if (!this.encryptionKey) throw new Error('Database not initialized');
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(JSON.stringify(data));
    
    const ciphertext = await subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      this.encryptionKey,
      encoded
    );

    return Buffer.from(
      JSON.stringify({
        iv: Buffer.from(iv).toString('hex'),
        data: Buffer.from(ciphertext).toString('hex')
      })
    ).toString('base64');
  }

  async decrypt(encrypted: string): Promise<any> {
    if (!this.encryptionKey) throw new Error('Database not initialized');
    
    const { iv, data } = JSON.parse(Buffer.from(encrypted, 'base64').toString());
    
    const decrypted = await subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: Buffer.from(iv, 'hex')
      },
      this.encryptionKey,
      Buffer.from(data, 'hex')
    );

    return JSON.parse(new TextDecoder().decode(decrypted));
  }

  // Store operations
  async saveWallet(walletData: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    const encrypted = await this.encrypt(walletData);
    await this.db.put('wallets', { id: walletData.id, data: encrypted });
  }

  async getWallet(id: string): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');
    const wallet = await this.db.get('wallets', id);
    return wallet ? await this.decrypt(wallet.data) : null;
  }

  async saveTransaction(tx: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    const encrypted = await this.encrypt(tx);
    await this.db.put('transactions', {
      hash: tx.hash,
      address: tx.address,
      timestamp: tx.timestamp,
      data: encrypted
    });
  }

  async getTransactions(address: string): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');
    const txs = await this.db.getAllFromIndex('transactions', 'address', address);
    return Promise.all(txs.map(tx => this.decrypt(tx.data)));
  }

  // Token operations
  async saveToken(tokenData: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.put('tokens', tokenData);
  }

  async getTokens(network: string): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.getAllFromIndex('tokens', 'network', network);
  }

  // Settings operations
  async saveSetting(key: string, value: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    const encrypted = await this.encrypt(value);
    await this.db.put('settings', { key, data: encrypted });
  }

  async getSetting(key: string): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');
    const setting = await this.db.get('settings', key);
    return setting ? await this.decrypt(setting.data) : null;
  }
}