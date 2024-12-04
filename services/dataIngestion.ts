import { createClient } from '@supabase/supabase-js'
import { DuneClient } from '@/utils/duneClient'
import { FlipsideClient } from '@/utils/flipsideClient'
import { DefiLlamaClient } from '@/utils/defiLlamaClient'
import { CoinGeckoClient } from '@/utils/coinGeckoClient'
import { EtherscanClient } from '@/utils/etherscanClient'
import { formatMetrics, formatDuneMetrics, formatFlipsideMetrics, type MetricData } from '@/utils/metrics'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface ProtocolData {
  name: string
  tvl: number
  volume24h: number
  fees24h: number
  users24h: number
  chains: string[]
  timestamp: Date
}

interface TokenData {
  address: string
  symbol: string
  name: string
  price: number
  volume24h: number
  marketCap: number
  timestamp: Date
}

interface ChainMetrics {
  chain: string
  tvl: number
  transactions24h: number
  fees24h: number
  activeAddresses24h: number
  timestamp: Date
}

interface Protocol {
  name: string;
  tvl: number;
  chains: string[];
}

interface Token {
  address: string;
  symbol: string;
  name: string;
  price: number;
  volume24h: number;
  marketCap: number;
}

export class DataIngestionService {
  private duneClient: DuneClient
  private flipsideClient: FlipsideClient
  private defiLlamaClient: DefiLlamaClient
  private coinGeckoClient: CoinGeckoClient
  private etherscanClient: EtherscanClient

  constructor() {
    this.duneClient = new DuneClient(process.env.NEXT_PUBLIC_DUNE_API_KEY!)
    this.flipsideClient = new FlipsideClient(process.env.NEXT_PUBLIC_FLIPSIDE_API_KEY!)
    this.defiLlamaClient = new DefiLlamaClient()
    this.coinGeckoClient = new CoinGeckoClient()
    this.etherscanClient = new EtherscanClient(process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY!)
  }

  async ingestAllData() {
    try {
      console.log('Starting data ingestion...')
      
      await Promise.all([
        this.ingestProtocolData(),
        this.ingestTokenData(),
        this.ingestChainMetrics(),
        this.ingestDexData(),
        this.ingestLendingData(),
        this.ingestDerivativesData()
      ])

      console.log('Data ingestion completed successfully')
    } catch (error) {
      console.error('Error during data ingestion:', error)
      throw error
    }
  }

  private async ingestProtocolData() {
    console.log('Ingesting protocol data...')
    
    // Get top protocols from DeFiLlama
    const protocols = await this.defiLlamaClient.getTopProtocols()
    
    const protocolData: ProtocolData[] = await Promise.all(
      protocols.map(async (protocol: Protocol) => {
        const [duneMetrics, flipsideMetrics] = await Promise.all([
          this.duneClient.getProtocolMetrics(protocol.name),
          this.flipsideClient.getProtocolMetrics(protocol.name)
        ])

        return {
          name: protocol.name,
          tvl: protocol.tvl,
          volume24h: duneMetrics.volume24h || flipsideMetrics.volume24h || 0,
          fees24h: duneMetrics.fees24h || flipsideMetrics.fees24h || 0,
          users24h: duneMetrics.users24h || flipsideMetrics.users24h || 0,
          chains: protocol.chains,
          timestamp: new Date()
        }
      })
    )

    const { error } = await supabase
      .from('protocol_metrics')
      .insert(protocolData)

    if (error) throw error
  }

  private async ingestTokenData() {
    console.log('Ingesting token data...')
    
    // Get top tokens from CoinGecko
    const tokens = await this.coinGeckoClient.getTopTokens()
    
    const tokenData: TokenData[] = tokens.map((token: Token) => ({
      address: token.address,
      symbol: token.symbol,
      name: token.name,
      price: token.price || 0,
      volume24h: token.volume24h || 0,
      marketCap: token.marketCap || 0,
      timestamp: new Date()
    }))

    const { error } = await supabase
      .from('token_metrics')
      .insert(tokenData)

    if (error) throw error
  }

  private async ingestChainMetrics() {
    console.log('Ingesting chain metrics...')
    
    const chains = ['ethereum', 'bsc', 'polygon', 'arbitrum', 'optimism']
    
    const chainMetrics: ChainMetrics[] = await Promise.all(
      chains.map(async (chain) => {
        const [duneMetrics, flipsideMetrics] = await Promise.all([
          this.duneClient.getChainMetrics(chain),
          this.flipsideClient.getChainMetrics(chain)
        ])

        const tvl = await this.defiLlamaClient.getChainTVL(chain)

        return {
          chain,
          tvl: tvl || 0,
          transactions24h: duneMetrics.transactions24h || flipsideMetrics.transactions24h || 0,
          fees24h: duneMetrics.fees24h || flipsideMetrics.fees24h || 0,
          activeAddresses24h: duneMetrics.activeAddresses24h || flipsideMetrics.activeAddresses24h || 0,
          timestamp: new Date()
        }
      })
    )

    const { error } = await supabase
      .from('chain_metrics')
      .insert(chainMetrics)

    if (error) throw error
  }

  private async ingestDexData() {
    console.log('Ingesting DEX data...')
    
    const dexes = ['uniswap', 'sushiswap', 'curve', 'balancer', 'pancakeswap']
    
    const dexMetrics = await Promise.all(
      dexes.map(async (dex) => {
        const [duneMetrics, flipsideMetrics] = await Promise.all([
          this.duneClient.getDexMetrics(dex),
          this.flipsideClient.getDexMetrics(dex)
        ])

        return {
          name: dex,
          volume24h: duneMetrics.volume24h || flipsideMetrics.volume24h,
          tvl: await this.defiLlamaClient.getProtocolTVL(dex),
          trades24h: duneMetrics.trades24h || flipsideMetrics.trades24h,
          uniqueTraders24h: duneMetrics.uniqueTraders24h || flipsideMetrics.uniqueTraders24h,
          timestamp: new Date()
        }
      })
    )

    const { error } = await supabase
      .from('dex_metrics')
      .insert(dexMetrics)

    if (error) throw error
  }

  private async ingestLendingData() {
    console.log('Ingesting lending protocol data...')
    
    const lendingProtocols = ['aave', 'compound', 'maker', 'benqi', 'venus']
    
    const lendingMetrics = await Promise.all(
      lendingProtocols.map(async (protocol) => {
        const [duneMetrics, flipsideMetrics] = await Promise.all([
          this.duneClient.getLendingMetrics(protocol),
          this.flipsideClient.getLendingMetrics(protocol)
        ])

        return {
          name: protocol,
          tvl: await this.defiLlamaClient.getProtocolTVL(protocol),
          totalBorrowed: duneMetrics.totalBorrowed || flipsideMetrics.totalBorrowed,
          totalSupplied: duneMetrics.totalSupplied || flipsideMetrics.totalSupplied,
          borrowApy: duneMetrics.borrowApy || flipsideMetrics.borrowApy,
          supplyApy: duneMetrics.supplyApy || flipsideMetrics.supplyApy,
          timestamp: new Date()
        }
      })
    )

    const { error } = await supabase
      .from('lending_metrics')
      .insert(lendingMetrics)

    if (error) throw error
  }

  private async ingestDerivativesData() {
    console.log('Ingesting derivatives data...')
    
    const derivativesProtocols = ['gmx', 'dydx', 'perpetual', 'synthetix']
    
    const derivativesMetrics = await Promise.all(
      derivativesProtocols.map(async (protocol) => {
        const [duneMetrics, flipsideMetrics] = await Promise.all([
          this.duneClient.getDerivativesMetrics(protocol),
          this.flipsideClient.getDerivativesMetrics(protocol)
        ])

        return {
          name: protocol,
          volume24h: duneMetrics.volume24h || flipsideMetrics.volume24h,
          openInterest: duneMetrics.openInterest || flipsideMetrics.openInterest,
          trades24h: duneMetrics.trades24h || flipsideMetrics.trades24h,
          uniqueTraders24h: duneMetrics.uniqueTraders24h || flipsideMetrics.uniqueTraders24h,
          timestamp: new Date()
        }
      })
    )

    const { error } = await supabase
      .from('derivatives_metrics')
      .insert(derivativesMetrics)

    if (error) throw error
  }
} 