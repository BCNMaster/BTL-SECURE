interface TransactionRisk {
  score: number;
  reasons: string[];
  isHighRisk: boolean;
}

interface AddressRisk {
  score: number;
  isSuspicious: boolean;
  reasons: string[];
  lastChecked: Date;
}

export class FraudDetectionService {
  private knownScamAddresses: Set<string> = new Set();
  private suspiciousPatterns: RegExp[] = [];
  private addressRiskCache: Map<string, AddressRisk> = new Map();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private readonly HIGH_RISK_THRESHOLD = 0.7;

  constructor() {
    this.initializePatterns();
  }

  private initializePatterns() {
    // Common scam contract patterns
    this.suspiciousPatterns = [
      /^0x0{20,}/, // Addresses with many leading zeros
      /(.)\1{15,}/, // Repetitive patterns
    ];
  }

  async analyzeTransaction(transaction: any): Promise<TransactionRisk> {
    const risk: TransactionRisk = {
      score: 0,
      reasons: [],
      isHighRisk: false
    };

    // Check recipient address
    const addressRisk = await this.checkAddress(transaction.to);
    risk.score += addressRisk.score;
    risk.reasons.push(...addressRisk.reasons);

    // Check transaction amount
    if (this.isUnusualAmount(transaction.value)) {
      risk.score += 0.3;
      risk.reasons.push('Unusual transaction amount');
    }

    // Check transaction timing
    if (this.isUnusualTiming(transaction.timestamp)) {
      risk.score += 0.2;
      risk.reasons.push('Unusual transaction timing');
    }

    // Check for rapid successive transactions
    if (await this.hasRecentSimilarTransactions(transaction)) {
      risk.score += 0.4;
      risk.reasons.push('Multiple similar transactions detected');
    }

    risk.isHighRisk = risk.score >= this.HIGH_RISK_THRESHOLD;
    return risk;
  }

  async checkAddress(address: string): Promise<AddressRisk> {
    // Check cache first
    const cached = this.addressRiskCache.get(address);
    if (cached && Date.now() - cached.lastChecked.getTime() < this.CACHE_DURATION) {
      return cached;
    }

    const risk: AddressRisk = {
      score: 0,
      isSuspicious: false,
      reasons: [],
      lastChecked: new Date()
    };

    // Check against known scam addresses
    if (this.knownScamAddresses.has(address)) {
      risk.score = 1;
      risk.isSuspicious = true;
      risk.reasons.push('Known scam address');
      this.addressRiskCache.set(address, risk);
      return risk;
    }

    // Check address patterns
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(address)) {
        risk.score += 0.4;
        risk.reasons.push('Suspicious address pattern detected');
      }
    }

    // Check contract verification status
    if (await this.isUnverifiedContract(address)) {
      risk.score += 0.3;
      risk.reasons.push('Unverified contract');
    }

    risk.isSuspicious = risk.score >= this.HIGH_RISK_THRESHOLD;
    this.addressRiskCache.set(address, risk);
    return risk;
  }

  private isUnusualAmount(amount: string): boolean {
    const value = parseFloat(amount);
    // Check for round numbers or unusually large amounts
    return value >= 1000000 || Number.isInteger(Math.log10(value));
  }

  private isUnusualTiming(timestamp: number): boolean {
    const date = new Date(timestamp * 1000);
    const hour = date.getHours();
    // Flag transactions during unusual hours (e.g., 2 AM - 4 AM)
    return hour >= 2 && hour <= 4;
  }

  private async hasRecentSimilarTransactions(transaction: any): Promise<boolean> {
    // This would typically check recent transactions in your database
    // For now, return false as a placeholder
    return false;
  }

  private async isUnverifiedContract(address: string): Promise<boolean> {
    // This would typically check contract verification status on block explorers
    // For now, return false as a placeholder
    return false;
  }

  // Real-time monitoring methods
  monitorTransactions(callback: (risk: TransactionRisk) => void): void {
    // This would typically set up real-time transaction monitoring
    // Implementation depends on your blockchain interaction setup
  }

  async addScamAddress(address: string): Promise<void> {
    this.knownScamAddresses.add(address);
    // Clear cache for this address
    this.addressRiskCache.delete(address);
  }

  async reportSuspiciousActivity(
    address: string,
    reason: string
  ): Promise<void> {
    // Log suspicious activity
    console.warn(`Suspicious activity reported for ${address}: ${reason}`);
    // This would typically send alerts or notifications
  }
}