'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  ShieldCheck, 
  Search, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Clock,
  IndianRupee,
  Eye,
  MessageSquare
} from 'lucide-react'
import toast from 'react-hot-toast'
import { triggerApprovalEmail } from '@/app/actions/email'

export default function AdminPayments() {
  const supabase = createClient()
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null)

  const fetchPayments = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        students (
          name,
          email,
          college_id
        )
      `)
      .order('created_at', { ascending: false })

    if (error) toast.error('Failed to fetch payments')
    else setPayments(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const handleApprove = async (payment: any) => {
    setProcessingId(payment.id)
    try {
      // 1. Update Payment Status
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + 120) // 120 days Premium Pro

      const { error: pError } = await supabase
        .from('payments')
        .update({ 
          status: 'approved',
          expiry_date: expiryDate.toISOString()
        })
        .eq('id', payment.id)

      if (pError) throw pError

      // 2. Update Student Subscription Status
      const { error: sError } = await supabase
        .from('students')
        .update({ 
          subscription_status: 'pro',
          subscription_activated_at: new Date().toISOString(),
          subscription_expiry: expiryDate.toISOString()
        })
        .eq('college_id', payment.college_id)

      if (sError) throw sError

      // 3. Send Success Email
      if (payment.students?.email) {
        await triggerApprovalEmail(payment.students.email, payment.students.name)
      }

      toast.success('Payment approved and subscription activated!')
      fetchPayments()
    } catch (err) {
      toast.error('Approval failed')
      console.error(err)
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (paymentId: string) => {
    const reason = window.prompt('Enter reason for rejection:')
    if (!reason) return

    setProcessingId(paymentId)
    try {
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: 'rejected',
          rejection_reason: reason
        })
        .eq('id', paymentId)

      if (error) throw error

      toast.success('Payment rejected')
      fetchPayments()
    } catch (err) {
      toast.error('Rejection failed')
      console.error(err)
    } finally {
      setProcessingId(null)
    }
  }

  const filteredPayments = payments.filter(p => 
    p.students?.name.toLowerCase().includes(search.toLowerCase()) || 
    p.college_id.toLowerCase().includes(search.toLowerCase()) ||
    p.transaction_id?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    pending: payments.filter(p => p.status === 'pending').length,
    totalRevenue: payments.filter(p => p.status === 'approved').reduce((acc, p) => acc + (p.amount || 0), 0),
    totalUsers: new Set(payments.map(p => p.college_id)).size
  }

  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold font-outfit flex items-center gap-3">
            <ShieldCheck className="text-primary" />
            Payment Verifications
          </h1>
          <p className="text-muted-foreground italic">Manually verify student screenshots and activate Pro accounts.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input 
            placeholder="Search name, ID or txn..." 
            className="input-field pl-12 min-w-[300px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Mini Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="card-premium p-4 flex items-center gap-4 border-l-4 border-yellow-500">
            <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-500"><Clock size={24}/></div>
            <div>
               <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Pending</p>
               <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
         </div>
         <div className="card-premium p-4 flex items-center gap-4 border-l-4 border-green-500">
            <div className="p-3 rounded-xl bg-green-500/10 text-green-500"><IndianRupee size={24}/></div>
            <div>
               <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Revenue</p>
               <p className="text-2xl font-bold">₹{stats.totalRevenue}</p>
            </div>
         </div>
         <div className="card-premium p-4 flex items-center gap-4 border-l-4 border-primary">
            <div className="p-3 rounded-xl bg-primary/10 text-primary"><IndianRupee size={24}/></div>
            <div>
               <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Req</p>
               <p className="text-2xl font-bold">{payments.length}</p>
            </div>
         </div>
      </div>

      <div className="card-premium p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Txn ID</th>
                <th className="px-6 py-4">Proof</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <Loader2 className="animate-spin inline-block text-primary" size={32} />
                  </td>
                </tr>
              ) : filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold">{p.students?.name}</span>
                      <span className="text-xs text-muted-foreground">{p.college_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-primary">₹{p.amount}</td>
                  <td className="px-6 py-4 font-mono text-xs">{p.transaction_id || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedScreenshot(p.payment_screenshot)}
                      className="flex items-center gap-2 text-xs font-bold text-primary hover:underline"
                    >
                      <Eye size={14} /> View Screenshot
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className={
                      p.status === 'approved' ? 'badge-approved' : 
                      p.status === 'rejected' ? 'badge-rejected' : 'badge-pending'
                    }>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {p.status === 'pending' ? (
                      <div className="flex items-center gap-3">
                        <button 
                          disabled={processingId === p.id}
                          onClick={() => handleApprove(p)}
                          className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all disabled:opacity-50"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          disabled={processingId === p.id}
                          onClick={() => handleReject(p.id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
                        {p.status === 'approved' ? 'Sub Active' : 'Req Rejected'}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screenshot Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedScreenshot(null)}>
           <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setSelectedScreenshot(null)}
                className="absolute -top-12 right-0 text-white hover:text-primary transition-colors flex items-center gap-2 font-bold"
              >
                 <XCircle size={24} /> Close
              </button>
              <img src={selectedScreenshot} className="w-full h-auto rounded-2xl shadow-2xl border border-white/10" />
           </div>
        </div>
      )}
    </div>
  )
}
