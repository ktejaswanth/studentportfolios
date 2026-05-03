'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GraduationCap, LayoutDashboard, User, LogOut, Shield, CreditCard, Menu, X, Layout, Share2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    // Initial fetch
    supabase.auth.getUser().then((res: any) => {
      const user = res.data?.user
      setUser(user || null)
      if (user) {
        supabase.from('students').select('role').eq('user_id', user.id).limit(1).then((studentRes: any) => {
          const data = studentRes.data
          if (data && data.length > 0) {
            setRole(data[0].role || 'student')
          } else {
            setRole('student')
          }
        })
      }
    })

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase.from('students').select('role').eq('user_id', session.user.id).limit(1).then((studentRes: any) => {
          const data = studentRes.data
          if (data && data.length > 0) {
            setRole(data[0].role || 'student')
          } else {
            setRole('student')
          }
        })
      } else {
        setRole(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, []) // Remove supabase.auth as it's now a singleton from createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  // Don't show navbar on portfolio pages
  if (pathname.startsWith('/portfolio')) return null

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
      <div className="glass flex items-center justify-between gap-8 px-6 py-3 rounded-2xl w-full max-w-5xl">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <GraduationCap className="text-primary w-8 h-8" />
          <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Portfolia
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {/* ... Desktop Nav Content (Keep existing logic) ... */}
          {user && pathname.startsWith('/dashboard') ? (
            <>
              {role === 'admin' && (
                <Link href="/admin" className="flex items-center gap-2 text-sm font-bold text-accent transition-colors hover:text-white">
                  <Shield size={18} className="text-accent" /> Admin
                </Link>
              )}
              <Link href="/dashboard" className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-white ${pathname === '/dashboard' ? 'text-white' : 'text-muted-foreground'}`}>
                <LayoutDashboard size={18} /> Overview
              </Link>
              <Link href="/dashboard/templates" className={`text-sm font-medium transition-colors hover:text-white ${pathname.startsWith('/dashboard/templates') ? 'text-white' : 'text-muted-foreground'}`}>
                Templates
              </Link>
              <Link href="/dashboard/analytics" className={`text-sm font-medium transition-colors hover:text-white ${pathname.startsWith('/dashboard/analytics') ? 'text-white' : 'text-muted-foreground'}`}>
                Analytics
              </Link>
              <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/dashboard/payments" className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-white ${pathname.startsWith('/dashboard/payments') ? 'text-white' : 'text-muted-foreground'}`}>
                <CreditCard size={18} /> Billing
              </Link>
              <button onClick={handleSignOut} className="flex items-center gap-2 text-sm font-medium text-destructive hover:text-destructive/80 transition-colors ml-4">
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : user ? (
            <>
              <Link href="/" className={`text-sm font-medium transition-colors hover:text-white ${pathname === '/' ? 'text-white' : 'text-muted-foreground'}`}>Home</Link>
              <Link href="/pricing" className={`text-sm font-medium transition-colors hover:text-white ${pathname === '/pricing' ? 'text-white' : 'text-muted-foreground'}`}>Pricing</Link>
              {role === 'admin' && (
                <Link href="/admin" className="flex items-center gap-2 text-sm font-bold text-accent transition-colors hover:text-white">
                  <Shield size={18} className="text-accent" /> Admin
                </Link>
              )}
              <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-white transition-colors ml-4">
                <LayoutDashboard size={18} /> Go to Dashboard
              </Link>
              <button onClick={handleSignOut} className="flex items-center gap-2 text-sm font-medium text-destructive hover:text-destructive/80 transition-colors pl-4 border-l border-white/10">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link href="/" className={`text-sm font-medium transition-colors hover:text-white ${pathname === '/' ? 'text-white' : 'text-muted-foreground'}`}>Home</Link>
              <Link href="/pricing" className={`text-sm font-medium transition-colors hover:text-white ${pathname === '/pricing' ? 'text-white' : 'text-muted-foreground'}`}>Pricing</Link>
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors ml-4">Login</Link>
              <Link href="/signup" className="btn-primary py-2 px-4 text-sm">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {isMenuOpen && (
        <div className="absolute top-20 left-4 right-4 glass p-6 rounded-2xl md:hidden flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300">
           {user && pathname.startsWith('/dashboard') ? (
             <>
               <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                 <LayoutDashboard size={20} className="text-primary" />
                 <span className="font-medium">Overview</span>
               </Link>
               <Link href="/dashboard/templates" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                 <Layout size={20} className="text-primary" />
                 <span className="font-medium">Templates</span>
               </Link>
               <Link href="/dashboard/analytics" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                 <Share2 size={20} className="text-primary" />
                 <span className="font-medium">Analytics</span>
               </Link>
               <Link href="/dashboard/payments" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                 <CreditCard size={20} className="text-primary" />
                 <span className="font-medium">Billing</span>
               </Link>
               <hr className="border-white/5 my-2" />
               <button onClick={handleSignOut} className="flex items-center gap-3 p-3 rounded-xl text-destructive hover:bg-destructive/5 transition-colors">
                 <LogOut size={20} />
                 <span className="font-medium">Logout</span>
               </button>
             </>
           ) : user ? (
             <>
               <Link href="/" className="p-3 rounded-xl hover:bg-white/5 transition-colors font-medium">Home</Link>
               <Link href="/pricing" className="p-3 rounded-xl hover:bg-white/5 transition-colors font-medium">Pricing</Link>
               <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 text-primary transition-colors">
                 <LayoutDashboard size={20} />
                 <span className="font-medium">Go to Dashboard</span>
               </Link>
             </>
           ) : (
             <>
               <Link href="/" className="p-3 rounded-xl hover:bg-white/5 transition-colors font-medium">Home</Link>
               <Link href="/pricing" className="p-3 rounded-xl hover:bg-white/5 transition-colors font-medium">Pricing</Link>
               <Link href="/login" className="p-3 rounded-xl hover:bg-white/5 transition-colors font-medium">Login</Link>
               <Link href="/signup" className="btn-primary py-3 px-6 text-center">Get Started</Link>
             </>
           )}
        </div>
      )}
    </nav>
  )
}
