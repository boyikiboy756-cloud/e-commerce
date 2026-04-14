import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let browserClient: SupabaseClient | null = null

declare global {
  interface Window {
    __APP_PUBLIC_ENV__?: Partial<
      Record<'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY', string>
    >
  }
}

function getWindowEnv(name: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
  if (typeof window === 'undefined') {
    return undefined
  }

  return window.__APP_PUBLIC_ENV__?.[name]?.trim()
}

function getEnv(name: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
  const value = process.env[name]?.trim() || getWindowEnv(name)

  if (!value) {
    throw new Error(`${name} is missing. Add it to your environment before using Supabase.`)
  }

  return value
}

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createClient(getEnv('NEXT_PUBLIC_SUPABASE_URL'), getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'))
  }

  return browserClient
}
