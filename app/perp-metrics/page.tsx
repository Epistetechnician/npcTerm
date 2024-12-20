'use client'

import React, { useEffect, useState } from 'react'
import { createSupabaseClient } from '../utils/supabase'

// Remove static generation
export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default function PerpMetricsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [metrics, setMetrics] = useState([])

  useEffect(() => {
    const initializeSupabase = async () => {
      try {
        const supabase = await createSupabaseClient()
        if (supabase) {
          // Your existing fetch logic
        }
      } catch (error) {
        console.error('Failed to initialize:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeSupabase()
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

  // Rest of your component code...
} 