export interface ApiExample {
  title: string;
  code: string;
  response: string;
  language: string;
}

export interface BaseEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  parameters?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
}

export interface ApiEndpoint extends BaseEndpoint {
  examples?: ApiExample[];
  authentication?: string;
  rateLimit?: string;
  category?: string;
  schema?: {
    request?: object;
    response?: object;
  };
}

export interface ApiResponse {
  error?: string
  data?: any
  status?: number
  timestamp?: string
}

export interface ApiEndpointConfig {
  url: string | ((param: string) => string)
  method: 'GET' | 'POST'
  description?: string
} 