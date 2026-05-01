'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GraduationCap, Mail, Lock, User, Hash, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [checkingCollegeId, setCheckingCollegeId] = useState(false)
  const [collegeIdError, setCollegeIdError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    collegeId: '',
  })

  const checkCollegeId = async (id: string) => {
    if (!id) return
    setCheckingCollegeId(true)
    setCollegeIdError('')

    const { data, error } = await supabase
      .from('students')
      .select('college_id')
      .eq('college_id', id.trim())
      .maybeSingle()

    if (data) {
      setCollegeIdError('College ID already exists. Try logging in or use a different ID.')
    }
    setCheckingCollegeId(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (collegeIdError) {
      toast.error('Please fix College ID error first')
      return
    }

    setLoading(true)
    
    // 1. Sign up user via Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    })

    if (authError) {
      toast.error(authError.message)
      setLoading(false)
      return
    }

    if (authData.user) {
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + 30) // 30 days free trial

      // 2. Create student record
      const { error: dbError } = await supabase
        .from('students')
        .insert({
          user_id: authData.user.id,
          college_id: formData.collegeId.trim(),
          name: formData.name,
          email: formData.email,
          role_title: 'Student', // Default
          selected_template: 'modern-dark', // Default
          is_published: false,
          subscription_expiry: expiryDate.toISOString()
        })

      if (dbError) {
        toast.error('Account created but portfolio registration failed. Please contact support.')
        console.error(dbError)
        setLoading(false)
        return
      }

      toast.success('Registration successful! Please check your email or login.')
      router.push('/dashboard')
    }
    
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="card-premium w-full max-w-md flex flex-col gap-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <GraduationCap className="text-primary w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold font-outfit">Create Account</h1>
          <p className="text-muted-foreground text-sm">Join the community of professional students.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                type="text" 
                required
                className="input-field pl-12"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">College ID (Primary Key)</label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                type="text" 
                required
                className={`input-field pl-12 ${collegeIdError ? 'border-destructive focus:ring-destructive/20' : ''}`}
                placeholder="CS2024001"
                value={formData.collegeId}
                onBlur={(e) => checkCollegeId(e.target.value)}
                onChange={(e) => {
                  setFormData({...formData, collegeId: e.target.value})
                  setCollegeIdError('')
                }}
              />
              {checkingCollegeId && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-primary w-4 h-4 animate-spin" />
              )}
            </div>
            {collegeIdError && (
              <div className="flex items-center gap-1.5 text-xs text-destructive mt-1">
                <AlertCircle size={14} />
                <span>{collegeIdError}</span>
              </div>
            )}
          </div>

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
            <label className="text-sm font-medium ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                type="password" 
                required
                minLength={6}
                className="input-field pl-12"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || checkingCollegeId || !!collegeIdError}
            className="btn-primary mt-4 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Register Now'}
          </button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline transition-all">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
