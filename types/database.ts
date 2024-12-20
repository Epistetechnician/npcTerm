export interface TokenMetrics {
  address: string;
  symbol: string;
  name: string;
  price: number;
  volume24h: number;
  marketCap: number;
  totalSupply?: number;
  timestamp: Date;
  holders?: number;
  // ... other fields
} 