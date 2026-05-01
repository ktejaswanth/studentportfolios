'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  QrCode, 
  Upload, 
  CheckCircle2, 
  Loader2, 
  ArrowLeft,
  Info,
  ShieldCheck,
  Copy
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function UpgradePage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [student, setStudent] = useState<any>(null)
  const [screenshotUrl, setScreenshotUrl] = useState('')
  const [txnId, setTxnId] = useState('')

  const PAYMENT_AMOUNT = 10
  const UPI_ID = '8688088449sbi@ybl'

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      const { data } = await supabase.from('students').select('*').eq('user_id', user.id).maybeSingle()
      setStudent(data)
    }
    fetchUser()
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${student.college_id}-payment-${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('payment-screenshots')
      .upload(fileName, file)

    if (error) {
      toast.error('Upload failed. Please try again.')
      console.error(error)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('payment-screenshots')
      .getPublicUrl(fileName)

    setScreenshotUrl(publicUrl)
    setUploading(false)
    toast.success('Screenshot uploaded successfully!')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!screenshotUrl) {
      toast.error('Please upload your payment screenshot')
      return
    }

    setLoading(true)
    const { error } = await supabase
      .from('payments')
      .insert({
        college_id: student.college_id,
        amount: PAYMENT_AMOUNT,
        payment_screenshot: screenshotUrl,
        transaction_id: txnId,
        status: 'pending'
      })

    if (error) {
      toast.error('Submission failed. Please contact support.')
      console.error(error)
      setLoading(false)
      return
    }

    toast.success('Payment submitted for verification!')
    router.push('/dashboard/payments')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  return (
    <div className="flex flex-col gap-12 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/payments" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold font-outfit">Upgrade to Premium</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Step 1: Payment Details */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-outfit flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">1</span>
              Make Payment
            </h2>
            <div className="card-premium flex flex-col items-center gap-6 py-8">
              <div className="p-4 bg-white rounded-2xl">
                {/* Mock QR Code UI */}
                <div className="w-48 h-48 bg-zinc-100 flex flex-col items-center justify-center gap-2 border-4 border-zinc-200">
                  <QrCode size={120} className="text-zinc-800" />
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter">Scan to Pay ₹{PAYMENT_AMOUNT}</p>
                </div>
              </div>
              
              <div className="w-full space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">UPI ID</p>
                    <p className="font-mono text-sm">{UPI_ID}</p>
                  </div>
                  <button onClick={() => copyToClipboard(UPI_ID)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Copy size={16} className="text-primary" />
                  </button>
                </div>
                
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Amount</p>
                    <p className="text-xl font-bold text-primary">₹{PAYMENT_AMOUNT}.00</p>
                  </div>
                  <CheckCircle2 size={24} className="text-primary opacity-20" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
             <div className="flex items-center gap-2 text-primary font-bold text-sm italic">
                <Info size={16} /> Instructions
             </div>
             <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4 leading-relaxed">
                <li>Open any UPI App (PhonePe, GPay, Paytm)</li>
                <li>Scan the QR or enter the UPI ID above</li>
                <li>Enter the exact amount: <span className="text-primary font-bold">₹{PAYMENT_AMOUNT}</span></li>
                <li>Once successful, take a clear screenshot of the confirmation page</li>
             </ul>
          </div>
        </div>

        {/* Step 2: Verification Details */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-outfit flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">2</span>
              Upload Proof
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Payment Screenshot</label>
                <div className={`relative h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all ${screenshotUrl ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 hover:border-primary/50 bg-white/5'}`}>
                   {screenshotUrl ? (
                     <>
                       <img src={screenshotUrl} className="absolute inset-0 w-full h-full object-contain p-2 rounded-3xl" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-3xl">
                          <label className="btn-secondary py-2 px-4 text-xs cursor-pointer">
                             Change Image
                             <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                          </label>
                       </div>
                       <div className="absolute bottom-4 right-4 bg-green-500 text-white p-1 rounded-full">
                          <CheckCircle2 size={16} />
                       </div>
                     </>
                   ) : (
                     <>
                       {uploading ? (
                         <Loader2 className="w-12 h-12 text-primary animate-spin" />
                       ) : (
                         <div className="flex flex-col items-center gap-4 text-center p-8">
                           <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                              <Upload size={32} />
                           </div>
                           <div>
                              <p className="font-bold">Click to upload screenshot</p>
                              <p className="text-xs text-muted-foreground mt-1">PNG, JPG or JPEG up to 5MB</p>
                           </div>
                           <input type="file" className="hidden" id="screenshot-input" accept="image/*" onChange={handleFileUpload} />
                           <label htmlFor="screenshot-input" className="btn-secondary py-2 px-6 text-sm cursor-pointer">
                              Browse Files
                           </label>
                         </div>
                       )}
                     </>
                   )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Transaction ID (Optional)</label>
                <input 
                  className="input-field" 
                  placeholder="UTR / Txn ID from your app"
                  value={txnId}
                  onChange={(e) => setTxnId(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || uploading || !screenshotUrl}
                className="btn-primary mt-4 flex items-center justify-center gap-3 py-4 text-lg shadow-2xl shadow-primary/20"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <ShieldCheck size={20} />}
                Submit for Verification
              </button>
            </form>
          </div>

          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-xs text-muted-foreground leading-relaxed">
             By submitting, you agree that any fake screenshots will lead to permanent account suspension. Admin verification typically takes 1-24 hours.
          </div>
        </div>
      </div>
    </div>
  )
}
