export interface Protocol {
  name: string;
  tvl: number;
  chains: string[];
}

export class DefiLlamaClient {
  async getTopProtocols(): Promise<Protocol[]> {
    // Implement DeFiLlama API call
    return [];
  }

  async getProtocolTVL(protocol: string): Promise<number> {
    // Implement DeFiLlama API call
    return 0;
  }

  async getChainTVL(chain: string): Promise<number> {
    // Implement DeFiLlama API call
    return 0;
  }
} 