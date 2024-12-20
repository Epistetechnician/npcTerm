export interface PerpetualMetrics {
  symbol: string;
  timestamp: Date;
  
  // Hyperliquid data
  funding_rate: number;
  perp_volume_24h: number;
  open_interest: number;
  mark_price: number;
  
  // DexScreener data
  spot_price: number;
  spot_volume_24h: number;
  liquidity: number;
  
  // Solscan data
  holder_count: number;
}

export interface HyperliquidMarket {
  symbol: string;
  dayNtlVlm: string;
  funding: string;
  markPx: string;
  openInterest: string;
}

export const TRACKED_PERP_TOKENS = [
  'POPCAT',
  'WIF',
  'GOAT',
  'PNUT',
  'CHILLGUY',
  'MOODENG',
  'MEW',
  'BRETT'
] as const;

export type TrackedPerpToken = typeof TRACKED_PERP_TOKENS[number]; 