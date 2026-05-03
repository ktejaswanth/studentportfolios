import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function test() {
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...')
  
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error('Session Error:', sessionError)
    } else {
      console.log('Session retrieved successfully')
    }

    const { data, error, status, statusText } = await supabase.from('students').select('*').limit(1)
    if (error) {
      console.error('Error fetching students:', { error, status, statusText })
    } else {
      console.log('Students:', data)
    }
  } catch (e) {
    console.error('Thrown error:', e)
  }
}

test()
