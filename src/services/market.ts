import { WebSocket } from 'ws';
import axios from 'axios';

export class MarketDataService {
  private static instance: MarketDataService;
  private priceSubscribers: Map<string, ((price: number) => void)[]> = new Map();
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private readonly RECONNECT_DELAY = 1000;

  private constructor() {
    this.initializeWebSocket();
  }

  static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  private initializeWebSocket() {
    try {
      this.ws = new WebSocket('wss://stream.binance.com:9443/ws');

      this.ws.onopen = () => {
        console.log('WebSocket connection established');
        this.reconnectAttempts = 0;
        this.subscribeToSymbols();
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data.toString());
        if (data.e === 'trade') {
          this.notifySubscribers(data.s, parseFloat(data.p));
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        this.handleReconnection();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
    }
  }

  private handleReconnection() {
    if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
      setTimeout(() => {
        console.log('Attempting to reconnect...');
        this.reconnectAttempts++;
        this.initializeWebSocket();
      }, this.RECONNECT_DELAY * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private subscribeToSymbols() {
    if (!this.ws) return;

    const symbols = Array.from(this.priceSubscribers.keys());
    if (symbols.length === 0) return;

    const subscriptionMessage = {
      method: 'SUBSCRIBE',
      params: symbols.map(symbol => `${symbol.toLowerCase()}@trade`),
      id: Date.now()
    };

    this.ws.send(JSON.stringify(subscriptionMessage));
  }

  private notifySubscribers(symbol: string, price: number) {
    const subscribers = this.priceSubscribers.get(symbol);
    if (subscribers) {
      subscribers.forEach(callback => callback(price));
    }
  }

  subscribeToPriceUpdates(symbol: string, callback: (price: number) => void) {
    if (!this.priceSubscribers.has(symbol)) {
      this.priceSubscribers.set(symbol, []);
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.subscribeToSymbols();
      }
    }
    
    const subscribers = this.priceSubscribers.get(symbol);
    if (subscribers && !subscribers.includes(callback)) {
      subscribers.push(callback);
    }
  }

  unsubscribeFromPriceUpdates(symbol: string, callback: (price: number) => void) {
    const subscribers = this.priceSubscribers.get(symbol);
    if (subscribers) {
      const index = subscribers.indexOf(callback);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
      if (subscribers.length === 0) {
        this.priceSubscribers.delete(symbol);
      }
    }
  }

  async fetchHistoricalPrices(symbol: string, interval: string = '1d', limit: number = 30) {
    try {
      const response = await axios.get(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
      );
      
      return response.data.map((item: any[]) => ({
        timestamp: item[0],
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
        volume: parseFloat(item[5])
      }));
    } catch (error) {
      console.error('Error fetching historical prices:', error);
      return [];
    }
  }

  async getTokenPrice(tokenId: string): Promise<number> {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`
      );
      return response.data[tokenId]?.usd || 0;
    } catch (error) {
      console.error('Error fetching token price:', error);
      return 0;
    }
  }
}