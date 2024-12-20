import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

const validateAndFormatUrl = (url: string | undefined): string | null => {
  if (!url) return null
  
  try {
    // Add https:// if not present
    const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`
    new URL(urlWithProtocol) // Validate URL format
    return urlWithProtocol
  } catch (e) {
    console.error('Invalid Supabase URL:', url)
    return null
  }
}

export const createSupabaseClient = async () => {
  if (typeof window === 'undefined') return null
  if (supabaseInstance) return supabaseInstance

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

  const supabaseUrl = validateAndFormatUrl(rawUrl)

  if (!supabaseUrl || !supabaseKey) {
    console.error('Invalid or missing Supabase credentials:', { 
      url: supabaseUrl ? '[VALID]' : '[MISSING/INVALID]', 
      key: supabaseKey ? '[PRESENT]' : '[MISSING]' 
    })
    return null
  }

  try {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        fetch: fetch.bind(globalThis)
      }
    })

    // Test the connection
    const { error } = await supabaseInstance.from('perpetual_metrics').select('count', { count: 'exact' })
    if (error) throw error

    return supabaseInstance
  } catch (error) {
    console.error('Supabase client initialization failed:', error)
    supabaseInstance = null
    return null
  }
}

export const getSupabase = async () => {
  return createSupabaseClient()
} 