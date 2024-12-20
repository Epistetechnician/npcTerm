declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_DUNE_API_KEY: string;
      NEXT_PUBLIC_FLIPSIDE_API_KEY: string;
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_KEY: string;
      NEXT_PUBLIC_CORS_PROXY?: string;
      [key: string]: string | undefined;
    }
  }
}

export {}; 