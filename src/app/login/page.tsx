'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GraduationCap, Mail, Lock, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (error) {
      console.error('Login error:', error)
      toast.error(error.message)
      setLoading(false)
      return
    }

    console.log('Login successful, redirecting...')
    toast.success('Sign in successful!')
    
    // Use window.location.href for a full reload to ensure middleware sees the new session
    window.location.href = '/dashboard'
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="card-premium w-full max-w-md flex flex-col gap-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <GraduationCap className="text-primary w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold font-outfit">Welcome Back</h1>
          <p className="text-muted-foreground text-sm">Login to manage your professional presence.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                type="email" 
                required
                className="input-field pl-12"
                placeholder="john@college.edu"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium ml-1 flex justify-between items-center">
              <span>Password</span>
              <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                type="password" 
                required
                className="input-field pl-12"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary mt-4 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Log In'}
          </button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline transition-all">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
