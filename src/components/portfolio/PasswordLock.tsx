'use client'

import { useState } from 'react'
import { Lock, ArrowRight } from 'lucide-react'

export function PasswordLock({ expectedPassword, children }: { expectedPassword: string, children: React.ReactNode }) {
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState(false)

  if (unlocked || !expectedPassword) {
    return <>{children}</>
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === expectedPassword) {
      setUnlocked(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white font-outfit p-4 text-center">
       <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500 card-premium p-8 border border-white/10 shadow-2xl">
          <div className="w-20 h-20 bg-primary/10 text-primary flex items-center justify-center rounded-3xl mx-auto shadow-2xl shadow-primary/20 border border-primary/20">
             <Lock size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Protected Portfolio</h1>
            <p className="text-zinc-400 text-sm">Please enter the password to view this portfolio.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
             <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className={`input-field w-full pr-12 ${error ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-all">
                   <ArrowRight size={16} />
                </button>
             </div>
             {error && <p className="text-red-500 text-xs font-bold text-left animate-shake">Incorrect password</p>}
          </form>
       </div>
    </div>
  )
}
