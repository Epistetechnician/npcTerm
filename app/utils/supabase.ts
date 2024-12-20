import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials not found')
    return null
  }

  try {
    return createClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false
      }
    })
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error)
    return null
  }
} 