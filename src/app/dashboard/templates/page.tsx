'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check, Layout, Loader2, Sparkles, Zap, Minimize, Sun, Briefcase } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const templates = [
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    description: 'Clean glassmorphism with dynamic gradients. Perfect for developers.',
    icon: <Zap className="text-yellow-400" />,
    color: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Ultra-minimalist design. Focus on typography and white space.',
    icon: <Minimize className="text-white" />,
    color: 'from-zinc-400 to-zinc-600'
  },
  {
    id: 'gradient-bold',
    name: 'Gradient Bold',
    description: 'Vibrant, high-contrast design that makes your projects pop.',
    icon: <Sparkles className="text-purple-400" />,
    color: 'from-pink-500 to-purple-600',
    isPremium: true
  },
  {
    id: 'light-creative',
    name: 'Light Creative',
    description: 'Vibrant, modern light theme with soft shadows and colorful accents.',
    icon: <Sun className="text-orange-400" />,
    color: 'from-orange-400 to-red-500',
    isPremium: true
  },
  {
    id: 'professional-white',
    name: 'Professional White',
    description: 'Clean, monochrome corporate template. Ultra-professional.',
    icon: <Briefcase className="text-slate-800" />,
    color: 'from-slate-200 to-slate-400',
    isPremium: true
  }
]

export default function TemplatePicker() {
  const router = useRouter()
  const supabase = createClient()
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [studentId, setStudentId] = useState('')
  const [status, setStatus] = useState('free')

  useEffect(() => {
    fetchCurrentTemplate()
  }, [])

  const fetchCurrentTemplate = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('students')
      .select('selected_template, college_id, subscription_status')
      .eq('user_id', user.id)
      .maybeSingle()

    if (data) {
      setSelected(data.selected_template)
      setStudentId(data.college_id)
      setStatus(data.subscription_status || 'free')
    }
    setLoading(false)
  }

  const handleSelect = async (tpl: any) => {
    if (tpl.isPremium && status !== 'pro') {
      toast.error('Premium template. Please upgrade to use this.')
      router.push('/dashboard/payments')
      return
    }

    setSelected(tpl.id)
    setSaving(true)
    
    const { error } = await supabase
      .from('students')
      .update({ selected_template: tpl.id })
      .eq('college_id', studentId)

    if (error) {
       toast.error('Failed to update template')
    } else {
       toast.success(`${id.replace('-', ' ')} template selected!`)
    }
    setSaving(false)
  }

  if (loading) return (
     <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 size={40} className="animate-spin text-primary" />
     </div>
  )

  return (
    <div className="flex flex-col gap-12 py-8 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold font-outfit">Choose your Template</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Select a design that matches your professional identity. You can change this anytime with one click.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {templates.map((tpl: any) => (
          <div 
            key={tpl.id}
            onClick={() => handleSelect(tpl)}
            className={`group relative card-premium flex flex-col gap-6 p-2 overflow-hidden cursor-pointer transition-all duration-500 ${
              selected === tpl.id ? 'ring-2 ring-primary border-primary/50' : 'hover:border-white/20'
            }`}
          >
            {/* Template Preview Box */}
            <div className={`aspect-[4/5] rounded-xl overflow-hidden relative bg-gradient-to-br ${tpl.color} p-4`}>
               <div className="absolute inset-0 bg-background/40 group-hover:bg-transparent transition-colors duration-500" />
               <div className="relative z-10 w-full h-full flex items-center justify-center">
                  {tpl.icon}
               </div>

               {tpl.isPremium && (
                 <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-yellow-400 uppercase tracking-widest flex items-center gap-1 border border-yellow-400/20">
                   Premium
                 </div>
               )}

               {selected === tpl.id && (
                  <div className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <Check size={18} className="text-white" />
                  </div>
               )}
            </div>

            <div className="p-4 space-y-2">
               <h3 className="text-xl font-bold font-outfit">{tpl.name}</h3>
               <p className="text-sm text-muted-foreground leading-relaxed italic line-clamp-2">
                 {tpl.description}
               </p>
            </div>
            
            <div className="px-4 pb-4">
               <button 
                 className={`w-full py-2 rounded-lg text-sm font-semibold transition-all ${
                    selected === tpl.id 
                    ? 'bg-primary text-white' 
                    : 'bg-white/5 group-hover:bg-white/10 text-muted-foreground'
                 }`}
               >
                 {selected === tpl.id ? 'Active Template' : 'Select Template'}
               </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
         <button 
           onClick={() => router.push(`/portfolio/${studentId}`)}
           className="btn-secondary flex items-center gap-2 px-8"
         >
           Preview with my data <Layout size={18} />
         </button>
      </div>
    </div>
  )
}
