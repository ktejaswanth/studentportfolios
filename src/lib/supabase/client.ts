import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | undefined

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (typeof window === 'undefined') {
    return createBrowserClient(supabaseUrl, supabaseKey)
  }

  if (!client) {
    client = createBrowserClient(supabaseUrl, supabaseKey)
  }

  return client
}
