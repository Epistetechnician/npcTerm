'use client'

import { useEffect, useState } from 'react'
import CabalTerminal from './agent'

// Remove static generation
export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Move initialization to client-side only
    setIsLoading(false)
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

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-gray-900 to-slate-900 p-4">
      <div className="w-full max-w-[90vw] xl:max-w-[80vw]">
        <CabalTerminal />
      </div>
    </main>
  )
}
