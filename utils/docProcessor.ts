import { readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import type { ApiEndpoint } from '../types/api';

interface DocSource {
  name: string;
  path: string;
  type: 'api' | 'guide' | 'reference';
  category?: string;
}

const DOC_SOURCES: DocSource[] = [
  // API Docs
  { name: 'DefiLlama', path: 'api-docs/defillama/README.md', type: 'api', category: 'DeFi' },
  { name: 'Dune Analytics', path: 'dune-docs/README.md', type: 'api', category: 'Analytics' },
  { name: 'Footprint', path: 'api-docs/footprint/README.md', type: 'api', category: 'Analytics' },
  { name: 'The Graph', path: 'api-docs/subgraphs/README.md', type: 'api', category: 'GraphQL' },
  { name: 'Bitquery', path: 'api-docs/bitquery/README.md', type: 'api', category: 'GraphQL' },

  // DeFi Endpoints
  { name: 'Lending', path: 'api-docs/endpoints/lending/README.md', type: 'reference', category: 'DeFi' },
  { name: 'DEX', path: 'api-docs/endpoints/dex/README.md', type: 'reference', category: 'DeFi' },
  { name: 'Liquid Staking', path: 'api-docs/endpoints/defi/liquid-staking/README.md', type: 'reference', category: 'DeFi' },
  { name: 'Perpetuals', path: 'api-docs/endpoints/defi/perpetuals/README.md', type: 'reference', category: 'DeFi' },
  { name: 'Synthetics', path: 'api-docs/endpoints/defi/synthetics/README.md', type: 'reference', category: 'DeFi' },

  // Other Endpoints
  { name: 'NFTs', path: 'api-docs/endpoints/nfts/README.md', type: 'reference', category: 'NFTs' },
  { name: 'Tokens', path: 'api-docs/endpoints/tokens/README.md', type: 'reference', category: 'Tokens' },
  { name: 'Protocols', path: 'api-docs/endpoints/protocols/README.md', type: 'reference', category: 'Protocols' },
  { name: 'Bridges', path: 'api-docs/endpoints/bridges/README.md', type: 'reference', category: 'Infrastructure' },
  { name: 'Analytics', path: 'api-docs/endpoints/analytics/README.md', type: 'reference', category: 'Analytics' },

  // Guides
  { name: 'Getting Started', path: 'api-docs/getting-started/README.md', type: 'guide' },
  { name: 'Authentication', path: 'api-docs/authentication/README.md', type: 'guide' },
  { name: 'Rate Limits', path: 'api-docs/rate-limits/README.md', type: 'guide' },
  { name: 'Integration', path: 'api-docs/integration/README.md', type: 'guide' },

  // Dune Analytics Specific
  { name: 'Dune Execution', path: 'dune-docs/api-reference/executions/README.md', type: 'reference', category: 'Dune' },
  { name: 'Dune DEX', path: 'dune-docs/api-reference/dex/README.md', type: 'reference', category: 'Dune' },
  { name: 'Dune EigenLayer', path: 'dune-docs/api-reference/eigenlayer/README.md', type: 'reference', category: 'Dune' },

  // Footprint Analytics
  { name: 'Footprint API', path: 'api-docs/footprint/README.md', type: 'api', category: 'Analytics' },
  { name: 'Footprint SDK', path: 'gitbook/data/data-products/api-sdk-developers/README.md', type: 'guide', category: 'Analytics' },

  // Subgraphs
  { name: 'Subgraphs Overview', path: 'subgraphs/README.md', type: 'guide', category: 'GraphQL' },
  { name: 'DEX Dashboard', path: 'subgraphs/apps/dex-dashboard/README.md', type: 'reference', category: 'DeFi' },
  { name: 'Curve Pool', path: 'subgraphs/apps/curve-pool-depeg/README.md', type: 'reference', category: 'DeFi' },

  // Footprint Analytics Specific
  { name: 'Footprint SQL', path: 'api-docs/footprint/sql-reference.md', type: 'reference', category: 'Analytics' },
  { name: 'Footprint Metrics', path: 'api-docs/footprint/metrics.md', type: 'reference', category: 'Analytics' },
  { name: 'Footprint Tables', path: 'api-docs/footprint/tables.md', type: 'reference', category: 'Analytics' },
  { name: 'Footprint Integration', path: 'api-docs/footprint/integration.md', type: 'guide', category: 'Analytics' },

  // Dune Analytics Additional Docs
  { name: 'Dune Spells', path: 'dune-docs/spells/README.md', type: 'reference', category: 'Dune' },
  { name: 'Dune Tables', path: 'dune-docs/tables/README.md', type: 'reference', category: 'Dune' },
  { name: 'Dune Functions', path: 'dune-docs/functions/README.md', type: 'reference', category: 'Dune' },
  { name: 'Dune Abstractions', path: 'dune-docs/abstractions/README.md', type: 'reference', category: 'Dune' },

  // Subgraph Additional Docs
  { name: 'Uniswap V3', path: 'subgraphs/uniswap-v3/README.md', type: 'reference', category: 'DeFi' },
  { name: 'Aave V3', path: 'subgraphs/aave-v3/README.md', type: 'reference', category: 'DeFi' },
  { name: 'Curve', path: 'subgraphs/curve/README.md', type: 'reference', category: 'DeFi' },
  { name: 'Balancer', path: 'subgraphs/balancer/README.md', type: 'reference', category: 'DeFi' },
  { name: 'Compound', path: 'subgraphs/compound/README.md', type: 'reference', category: 'DeFi' },

  // Protocol Specific Docs
  { name: 'Lending Protocols', path: 'api-docs/protocols/lending/README.md', type: 'reference', category: 'DeFi' },
  { name: 'DEX Protocols', path: 'api-docs/protocols/dex/README.md', type: 'reference', category: 'DeFi' },
  { name: 'Yield Protocols', path: 'api-docs/protocols/yield/README.md', type: 'reference', category: 'DeFi' },
  { name: 'Bridge Protocols', path: 'api-docs/protocols/bridges/README.md', type: 'reference', category: 'Infrastructure' },

  // Chain Specific Docs
  { name: 'Ethereum Data', path: 'api-docs/chains/ethereum/README.md', type: 'reference', category: 'Chains' },
  { name: 'Arbitrum Data', path: 'api-docs/chains/arbitrum/README.md', type: 'reference', category: 'Chains' },
  { name: 'Optimism Data', path: 'api-docs/chains/optimism/README.md', type: 'reference', category: 'Chains' },
  { name: 'Polygon Data', path: 'api-docs/chains/polygon/README.md', type: 'reference', category: 'Chains' },

  // Integration Guides
  { name: 'Python SDK', path: 'api-docs/sdk/python/README.md', type: 'guide', category: 'Integration' },
  { name: 'JavaScript SDK', path: 'api-docs/sdk/javascript/README.md', type: 'guide', category: 'Integration' },
  { name: 'REST API', path: 'api-docs/rest-api/README.md', type: 'guide', category: 'Integration' },
  { name: 'GraphQL API', path: 'api-docs/graphql-api/README.md', type: 'guide', category: 'Integration' }
];

interface ProcessedDoc {
  title: string;
  content: string;
  metadata: any;
  endpoints?: ApiEndpoint[];
  examples?: {
    title: string;
    code: string;
    language: string;
  }[];
  category?: string;
  type: 'api' | 'guide' | 'reference';
}

interface CodeExample {
  title: string;
  code: string;
  language: string;
  response?: string;
}

export async function processAllDocs(): Promise<Record<string, ProcessedDoc>> {
  const docs: Record<string, ProcessedDoc> = {};

  for (const source of DOC_SOURCES) {
    try {
      const fullPath = join(process.cwd(), source.path);
      const fileContents = readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const parsedContent = await marked(content);

      // Extract endpoints if it's an API doc
      const endpoints = source.type === 'api' ? extractEndpoints(content) : undefined;

      // Extract code examples
      const examples = extractExamples(content);

      docs[source.name] = {
        title: data.title || source.name,
        content: parsedContent,
        metadata: data,
        endpoints,
        examples,
        category: source.category,
        type: source.type
      };
    } catch (error) {
      console.error(`Error processing ${source.name}:`, error);
    }
  }

  return docs;
}

function extractEndpoints(content: string): ApiEndpoint[] {
  const endpoints: ApiEndpoint[] = [];
  const lines = content.split('\n');
  let currentEndpoint: Partial<ApiEndpoint> | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Look for endpoint definitions
    if (line.startsWith('### `') || line.startsWith('## `')) {
      // Save previous endpoint if exists
      if (currentEndpoint && currentEndpoint.path) {
        endpoints.push(currentEndpoint as ApiEndpoint);
      }

      // Parse new endpoint
      const match = line.match(/`(GET|POST|PUT|DELETE)\s+([^`]+)`/);
      if (match) {
        currentEndpoint = {
          method: match[1] as 'GET' | 'POST' | 'PUT' | 'DELETE',
          path: match[2],
          description: '',
          parameters: [],
          examples: []
        };
      }
    }
    // Parse description
    else if (currentEndpoint && !line.startsWith('#') && line.length > 0) {
      currentEndpoint.description += line + ' ';
    }
    // Parse parameters
    else if (line.startsWith('| Parameter')) {
      while (i < lines.length && lines[i].includes('|')) {
        const paramMatch = lines[i].match(/\|\s*(\w+)\s*\|\s*(\w+)\s*\|\s*(Required|Optional)\s*\|\s*(.+?)\s*\|/);
        if (paramMatch && currentEndpoint) {
          currentEndpoint.parameters?.push({
            name: paramMatch[1],
            type: paramMatch[2],
            required: paramMatch[3] === 'Required',
            description: paramMatch[4]
          });
        }
        i++;
      }
    }
  }

  // Add last endpoint
  if (currentEndpoint && currentEndpoint.path) {
    endpoints.push(currentEndpoint as ApiEndpoint);
  }

  return endpoints;
}

function extractExamples(content: string): CodeExample[] {
  const examples: CodeExample[] = [];
  const lines = content.split('\n');
  let currentExample: Partial<CodeExample> | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Look for example blocks
    if (line.startsWith('```')) {
      if (!currentExample) {
        // Start new example
        const language = line.replace('```', '').trim();
        currentExample = {
          title: 'Example',
          language,
          code: ''
        };
      } else {
        // End current example
        if (currentExample.code && currentExample.language) {
          examples.push(currentExample as CodeExample);
        }
        currentExample = null;
      }
    }
    // Collect example content
    else if (currentExample) {
      currentExample.code += line + '\n';
    }
    // Look for example titles
    else if (line.startsWith('#### ') || line.startsWith('### Example:')) {
      if (currentExample) {
        examples.push(currentExample as CodeExample);
      }
      currentExample = {
        title: line.replace(/^[#\s]+/, '').replace('Example:', '').trim(),
        language: '',
        code: ''
      };
    }
  }

  return examples;
}

// Helper function to parse markdown tables
function parseMarkdownTable(tableContent: string): Record<string, string>[] {
  const lines = tableContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split('|').map(h => h.trim()).filter(Boolean);
  const rows: Record<string, string>[] = [];

  for (let i = 2; i < lines.length; i++) {
    const values = lines[i].split('|').map(v => v.trim()).filter(Boolean);
    if (values.length === headers.length) {
      const row = headers.reduce((acc, header, index) => ({
        ...acc,
        [header]: values[index]
      }), {});
      rows.push(row);
    }
  }

  return rows;
}

export function getDocsByCategory(docs: Record<string, ProcessedDoc>, category: string) {
  return Object.entries(docs)
    .filter(([_, doc]) => doc.category === category)
    .reduce((acc, [key, doc]) => ({ ...acc, [key]: doc }), {});
}

export function getDocsByType(docs: Record<string, ProcessedDoc>, type: 'api' | 'guide' | 'reference') {
  return Object.entries(docs)
    .filter(([_, doc]) => doc.type === type)
    .reduce((acc, [key, doc]) => ({ ...acc, [key]: doc }), {});
} 