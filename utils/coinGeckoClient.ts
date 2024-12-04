export interface Token {
  address: string;
  symbol: string;
  name: string;
  price: number;
  volume24h: number;
  marketCap: number;
}

export class CoinGeckoClient {
  async getTopTokens(): Promise<Token[]> {
    // Implement CoinGecko API call
    return [];
  }
} 