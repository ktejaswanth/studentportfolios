'use client'

import { Share2, Check, QrCode, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { QRCodeSVG } from 'qrcode.react'

export function ShareButton({ collegeId }: { collegeId: string }) {
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [showQR, setShowQR] = useState(false)
  const fullUrl = mounted ? `${window.location.origin}/portfolio/${collegeId}` : ''

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    toast.success('Link copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-2 w-full relative">
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1 font-mono bg-background p-2.5 rounded-lg border border-border text-xs truncate">
          {mounted ? fullUrl : `.../portfolio/${collegeId}`}
        </div>
        <button 
          onClick={() => setShowQR(!showQR)} 
          className="p-2.5 bg-secondary text-white rounded-lg hover:bg-secondary/80 transition-all shrink-0 flex items-center justify-center"
          title="Show QR Code"
        >
          <QrCode size={16} />
        </button>
        <button 
          onClick={handleCopy} 
          className="p-2.5 bg-primary text-white rounded-lg hover:bg-primary/80 transition-all shrink-0 flex items-center justify-center"
          title="Copy Link"
        >
          {copied ? <Check size={16} /> : <Share2 size={16} />}
        </button>
      </div>
      
      {showQR && (
        <div className="absolute top-full right-0 mt-2 p-4 bg-white rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in duration-200 border border-white/20">
           <button onClick={() => setShowQR(false)} className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-800"><X size={16}/></button>
           <div className="pt-4 pb-2 px-2 flex flex-col items-center gap-3">
             <QRCodeSVG value={fullUrl} size={150} level="H" includeMargin={true} />
             <p className="text-xs text-zinc-500 font-medium tracking-wide">Scan to view portfolio</p>
           </div>
        </div>
      )}
    </div>
  )
}
