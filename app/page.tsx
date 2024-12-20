'use client'

import { createClient } from '@supabase/supabase-js'
import CabalTerminal from './agent'

// Add error handling for Supabase initialization
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_KEY,
      {
        auth: {
          persistSession: false
        }
      }
    )
  : null;

export default function Home() {
  // Add fallback UI if Supabase is not initialized
  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-purple-400 mb-4">
            Configuration Required
          </h1>
          <p className="text-gray-400">
            Please check your environment variables for Supabase configuration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-gray-900 to-slate-900 p-4">
      <div className="w-full max-w-[90vw] xl:max-w-[80vw]">
        <CabalTerminal />
      </div>
    </main>
  )
}
