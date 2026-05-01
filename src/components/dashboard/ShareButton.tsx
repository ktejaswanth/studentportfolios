'use client'

import { Share2, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export function ShareButton({ collegeId }: { collegeId: string }) {
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCopy = () => {
    const url = `${window.location.origin}/portfolio/${collegeId}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('Link copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 font-mono bg-background p-2.5 rounded-lg border border-border text-xs truncate">
        {mounted ? `${window.location.origin}/portfolio/${collegeId}` : `.../portfolio/${collegeId}`}
      </div>
      <button 
        onClick={handleCopy} 
        className="p-2.5 bg-primary text-white rounded-lg hover:bg-primary/80 transition-all shrink-0 flex items-center justify-center"
        title="Copy Link"
      >
        {copied ? <Check size={16} /> : <Share2 size={16} />}
      </button>
    </div>
  )
}
