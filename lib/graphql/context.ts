import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export type Context = {
  dataSource: SupabaseClient
}

let cached: SupabaseClient | null = null

const getClient = (): SupabaseClient => {
  if (cached) return cached
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_KEY
  if (!url || !key) {
    throw new Error('SUPABASE_URL and SUPABASE_KEY must be set')
  }
  cached = createClient(url, key, { auth: { persistSession: false } })
  return cached
}

export const createContext = (): Context => ({
  dataSource: getClient(),
})
