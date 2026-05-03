'use client'

import { Download } from 'lucide-react'

export function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform print:hidden flex items-center justify-center group"
      title="Download as PDF"
    >
      <Download size={24} />
      <span className="absolute right-full mr-4 bg-zinc-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 pointer-events-none">
         Save as PDF
      </span>
    </button>
  )
}
