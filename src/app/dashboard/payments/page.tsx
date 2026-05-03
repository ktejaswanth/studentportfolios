'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  History,
  ShieldCheck,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function PaymentsPage() {
  const supabase = createClient()
  const [student, setStudent] = useState<any>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Fetch student info for subscription status
    const { data: studentData } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (studentData) {
      setStudent(studentData)
      
      // Fetch payment history
      const { data: paymentData } = await supabase
        .from('payments')
        .select('*')
        .eq('college_id', studentData.college_id)
        .order('created_at', { ascending: false })
      
      setPayments(paymentData || [])
    }
    setLoading(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>
  )

  const isPremium = student?.subscription_status === 'pro'
  const isExpired = student?.subscription_expiry && new Date(student.subscription_expiry) < new Date()
  const hasPendingPayment = payments.some(p => p.status === 'pending')

  return (
    <div className="flex flex-col gap-12 py-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold font-outfit flex items-center gap-3">
            <CreditCard className="text-primary" size={36} />
            Billing & Subscription
          </h1>
          <p className="text-muted-foreground italic">Manage your premium features and payment history.</p>
        </div>
        {!isPremium && !hasPendingPayment && (
          <Link href="/dashboard/payments/upgrade" className="btn-primary flex items-center gap-2 animate-pulse-glow">
            Upgrade to Premium <ArrowRight size={18} />
          </Link>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Status Card */}
        <div className="card-premium md:col-span-1 flex flex-col gap-6">
          <h2 className="text-xl font-bold font-outfit border-b border-white/5 pb-4">Current Plan</h2>
          <div className="flex flex-col items-center py-6 gap-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isPremium ? 'bg-primary/10 text-primary border-2 border-primary/20' : 'bg-white/5 text-muted-foreground border border-white/10'}`}>
              {isPremium ? <ShieldCheck size={40} /> : <Clock size={40} />}
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-outfit uppercase tracking-wider">
                {isPremium ? 'Premium Pro' : 'Free Plan'}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {student.subscription_expiry && !isExpired
                  ? `Valid until ${new Date(student.subscription_expiry).toLocaleDateString()}` 
                  : isExpired 
                    ? <span className="text-red-500 font-bold">Subscription Expired</span>
                    : 'Basic features enabled'}
              </p>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-2">
                 Plan Duration: {isPremium ? '120 Days' : '30 Days'}
              </p>
            </div>
          </div>
          
          {(isExpired || (!isPremium && !hasPendingPayment)) && (
             <Link href="/dashboard/payments/upgrade" className="btn-primary w-full text-center flex items-center justify-center gap-2">
                {isExpired ? 'Renew Subscription' : 'Upgrade to Pro'} <ArrowRight size={18} />
             </Link>
          )}
          
          <div className="space-y-3 pt-4">
            <FeatureItem active={!isExpired} label="Public Portfolio URL" />
            <FeatureItem active={true} label="Standard Templates" />
            <FeatureItem active={isPremium && !isExpired} label="Premium Templates" />
            <FeatureItem active={isPremium && !isExpired} label="Advanced Analytics" />
            <FeatureItem active={isPremium && !isExpired} label="Priority Support" />
          </div>
        </div>

        {/* Payment History */}
        <div className="card-premium md:col-span-2 flex flex-col gap-6">
          <h2 className="text-xl font-bold font-outfit border-b border-white/5 pb-4 flex items-center gap-2">
            <History size={20} className="text-primary" />
            Transaction History
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-xs uppercase tracking-widest text-muted-foreground border-b border-white/5">
                <tr>
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Notes</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="py-4 text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 font-bold">₹{p.amount}</td>
                    <td className="py-4">
                      <span className={
                        p.status === 'approved' ? 'badge-approved' : 
                        p.status === 'rejected' ? 'badge-rejected' : 'badge-pending'
                      }>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 text-xs italic text-muted-foreground">
                      {p.status === 'rejected' ? p.rejection_reason : (p.status === 'approved' ? 'Active Subscription' : 'Verification in progress')}
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-muted-foreground italic">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {hasPendingPayment && (
        <div className="p-6 rounded-2xl bg-yellow-400/5 border border-yellow-500/20 flex items-start gap-4 animate-fade-in">
          <AlertCircle className="text-yellow-400 shrink-0 mt-1" />
          <div className="space-y-1">
            <h3 className="font-bold text-yellow-400">Payment Verification Pending</h3>
            <p className="text-sm text-muted-foreground">
              We have received your payment request. Our admin will verify the screenshot and activate your premium status within 24 hours.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function FeatureItem({ active, label }: { active: boolean, label: string }) {
  return (
    <div className={`flex items-center gap-3 text-sm ${active ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}>
      <CheckCircle2 size={16} className={active ? 'text-primary' : 'text-muted-foreground'} />
      <span>{label}</span>
    </div>
  )
}
