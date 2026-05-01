'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GraduationCap, LayoutDashboard, User, LogOut, Shield, CreditCard } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'

export default function Navbar() {
  const pathname = usePathname()
  const supabase = createClient()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        supabase.from('students').select('role').eq('user_id', user.id).limit(1).then(({ data }) => {
          if (data && data.length > 0) {
            setRole(data[0].role || 'student')
          } else {
            setRole('student')
          }
        })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase.from('students').select('role').eq('user_id', session.user.id).limit(1).then(({ data }) => {
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

    return () => subscription.unsubscribe()
  }, [supabase.auth])

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
          {user && pathname.startsWith('/dashboard') ? (
            // Dashboard Nav Bar (After Login inside Dashboard)
            <>
              {role === 'admin' && (
                <Link 
                  href="/admin" 
                  className="flex items-center gap-2 text-sm font-bold text-accent transition-colors hover:text-white"
                >
                  <Shield size={18} className="text-accent" />
                  Admin
                </Link>
              )}
              <Link 
                href="/dashboard" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-white ${pathname === '/dashboard' ? 'text-white' : 'text-muted-foreground'}`}
              >
                <LayoutDashboard size={18} />
                Overview
              </Link>
              <Link 
                href="/dashboard/templates" 
                className={`text-sm font-medium transition-colors hover:text-white ${pathname.startsWith('/dashboard/templates') ? 'text-white' : 'text-muted-foreground'}`}
              >
                Templates
              </Link>
              <Link 
                href="/dashboard/analytics" 
                className={`text-sm font-medium transition-colors hover:text-white ${pathname.startsWith('/dashboard/analytics') ? 'text-white' : 'text-muted-foreground'}`}
              >
                Analytics
              </Link>
              <Link 
                href="/pricing" 
                className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
              >
                Pricing
              </Link>
              <Link 
                href="/dashboard/payments" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-white ${pathname.startsWith('/dashboard/payments') ? 'text-white' : 'text-muted-foreground'}`}
              >
                <CreditCard size={18} />
                Billing
              </Link>
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-2 text-sm font-medium text-destructive hover:text-destructive/80 transition-colors ml-4"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : user ? (
            // Public Nav Bar (After Login outside Dashboard)
            <>
              <Link href="/" className={`text-sm font-medium transition-colors hover:text-white ${pathname === '/' ? 'text-white' : 'text-muted-foreground'}`}>
                Home
              </Link>
              <Link href="/pricing" className={`text-sm font-medium transition-colors hover:text-white ${pathname === '/pricing' ? 'text-white' : 'text-muted-foreground'}`}>
                Pricing
              </Link>
              {role === 'admin' && (
                <Link href="/admin" className="flex items-center gap-2 text-sm font-bold text-accent transition-colors hover:text-white">
                  <Shield size={18} className="text-accent" /> Admin
                </Link>
              )}
              <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-white transition-colors ml-4">
                <LayoutDashboard size={18} />
                Go to Dashboard
              </Link>
              <button onClick={handleSignOut} className="flex items-center gap-2 text-sm font-medium text-destructive hover:text-destructive/80 transition-colors pl-4 border-l border-white/10">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            // Public Nav Bar (Before Login)
            <>
              <Link href="/" className={`text-sm font-medium transition-colors hover:text-white ${pathname === '/' ? 'text-white' : 'text-muted-foreground'}`}>
                Home
              </Link>
              <Link href="/pricing" className={`text-sm font-medium transition-colors hover:text-white ${pathname === '/pricing' ? 'text-white' : 'text-muted-foreground'}`}>
                Pricing
              </Link>
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors ml-4">
                Login
              </Link>
              <Link href="/signup" className="btn-primary py-2 px-4 text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
