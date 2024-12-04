export interface FlipsideMetrics {
  volume24h?: number;
  fees24h?: number;
  users24h?: number;
  transactions24h?: number;
  activeAddresses24h?: number;
  trades24h?: number;
  uniqueTraders24h?: number;
  totalBorrowed?: number;
  totalSupplied?: number;
  borrowApy?: number;
  supplyApy?: number;
  openInterest?: number;
}

export class FlipsideClient {
  private apiKey: string;
  private baseUrl = 'https://api.flipsidecrypto.com/api/v2';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Flipside API key is required');
    }
    this.apiKey = apiKey;
  }

  async executeQuery(query: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        },
        body: JSON.stringify({ query })
      });
      
      if (!response.ok) {
        throw new Error(`Flipside API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to execute Flipside query: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getProtocolMetrics(protocol: string): Promise<FlipsideMetrics> {
    // Implement Flipside API call
    return {};
  }

  async getChainMetrics(chain: string): Promise<FlipsideMetrics> {
    // Implement Flipside API call
    return {};
  }

  async getDexMetrics(dex: string): Promise<FlipsideMetrics> {
    // Implement Flipside API call
    return {};
  }

  async getLendingMetrics(protocol: string): Promise<FlipsideMetrics> {
    // Implement Flipside API call
    return {};
  }

  async getDerivativesMetrics(protocol: string): Promise<FlipsideMetrics> {
    // Implement Flipside API call
    return {};
  }
} 