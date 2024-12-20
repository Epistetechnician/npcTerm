'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import CabalTerminal from './agent'
import { createSupabaseClient } from './utils/supabase'

export default function Home() {
  const [isSupabaseInitialized, setIsSupabaseInitialized] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createSupabaseClient()
    if (supabase) {
      setIsSupabaseInitialized(true)
    } else {
      setError('Supabase configuration is missing')
    }
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-purple-400 mb-4">
            Configuration Error
          </h1>
          <p className="text-gray-400">
            {error}
          </p>
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
