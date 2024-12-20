'use client'

import { useEffect, useState } from 'react'
import CabalTerminal from './agent'
import { createSupabaseClient } from './utils/supabase'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        const supabase = await createSupabaseClient()
        if (!supabase) {
          throw new Error('Failed to initialize Supabase client')
        }
      } catch (err) {
        console.error('Initialization error:', err)
        setError(err instanceof Error ? err.message : 'Failed to initialize application')
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h2 className="text-xl text-purple-400">Loading...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
          <p className="text-gray-400">{error}</p>
          <p className="text-sm text-gray-500 mt-2">Please check the console for more details.</p>
        </div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-gray-900 to-slate-900 p-4">
      <div className="w-full max-w-[90vw] xl:max-w-[80vw]">
        <CabalTerminal />
      </div>
    </main>
  )
}
