import { GraduationCap } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Footer() {
  const supabase = await createClient()
  
  // Fetch total portfolio count
  const { count } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true })

  return (
    <footer className="mt-24 border-t border-white/5 py-12 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-2 font-bold text-xl uppercase tracking-tighter">
            <GraduationCap className="text-primary w-6 h-6" />
            Portfolia
          </div>
          <p className="text-sm text-muted-foreground text-center md:text-left max-w-xs italic">
            Empowering the next generation of professionals to showcase their true potential.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
           <div className="flex items-center gap-2 px-6 py-2 rounded-full glass border border-primary/20 bg-primary/5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="text-sm font-bold font-outfit">
                {count || 0} Portfolios Created Globally
              </span>
           </div>
           <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">Live System Statistics</p>
        </div>

        <div className="flex gap-8 text-sm font-medium text-muted-foreground">
           <Link href="/" className="hover:text-white transition-colors">Home</Link>
           <Link href="/signup" className="hover:text-white transition-colors">Register</Link>
           <Link href="/login" className="hover:text-white transition-colors">Admin Login</Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground gap-4 italic opacity-50">
         <p>© 2026 Portfolia Inc. All rights reserved.</p>
         <div className="flex gap-4 underline">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
         </div>
      </div>
    </footer>
  )
}
