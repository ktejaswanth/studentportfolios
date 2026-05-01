import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { 
  Users, 
  CreditCard, 
  FileText, 
  ArrowUpRight, 
  BarChart3, 
  ShieldCheck,
  TrendingUp,
  Activity
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  // 1. Security Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('students')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // 2. Fetch Analytics
  const [
    { count: totalUsers },
    { count: totalProjects },
    { count: totalExperiences },
    { data: recentUsers },
    { data: payments }
  ] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('experiences').select('*', { count: 'exact', head: true }),
    supabase.from('students').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('payments').select('*').order('created_at', { ascending: false })
  ])

  return (
    <div className="flex flex-col gap-12 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold font-outfit flex items-center gap-3">
             <ShieldCheck className="text-accent" size={36} />
             System Overview
          </h1>
          <p className="text-muted-foreground italic">Real-time system health and usage metrics.</p>
        </div>
        <div className="flex gap-4">
           <Link href="/admin/users" className="btn-secondary text-sm">Manage Profiles</Link>
           <Link href="/admin/payments" className="btn-primary text-sm flex items-center gap-2">
              <ShieldCheck size={16} /> Verify Payments
           </Link>
        </div>
      </div>

      {/* Analytics Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard 
          icon={<Users className="text-blue-400" />} 
          label="Total Students" 
          value={totalUsers || 0} 
          trend="+12% this week" 
        />
        <StatCard 
          icon={<CreditCard className="text-primary" />} 
          label="Pending Payments" 
          value={payments?.filter(p => p.status === 'pending').length || 0} 
          trend="Needs Attention" 
        />
        <StatCard 
          icon={<BarChart3 className="text-green-400" />} 
          label="Total Revenue" 
          value={`₹${payments?.filter(p => p.status === 'approved').reduce((acc, p) => acc + (p.amount || 0), 0) || 0}`} 
          trend="Manual Billing" 
        />
        <StatCard 
          icon={<TrendingUp className="text-orange-400" />} 
          label="System Load" 
          value="L-0" 
          trend="Healthy" 
        />
      </div>


      <div className="grid lg:grid-cols-3 gap-8">
         {/* Recent Users Table */}
         <div className="lg:col-span-2 card-premium space-y-6">
            <h3 className="text-xl font-bold font-outfit border-b border-white/5 pb-4 flex items-center gap-2">
               <Activity className="text-primary" size={20} />
               Recent Profile Registrations
            </h3>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="text-xs uppercase tracking-widest text-muted-foreground border-b border-white/5">
                        <th className="pb-4">Name</th>
                        <th className="pb-4">College ID</th>
                        <th className="pb-4">Joined</th>
                        <th className="pb-4">Status</th>
                        <th className="pb-4">Action</th>
                     </tr>
                  </thead>
                  <tbody className="text-sm">
                     {recentUsers?.map((u) => (
                        <tr key={u.college_id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                           <td className="py-4 font-medium">{u.name}</td>
                           <td className="py-4 font-mono text-xs">{u.college_id}</td>
                           <td className="py-4 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                           <td className="py-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${u.is_published ? 'border-green-500/50 text-green-400 bg-green-400/5' : 'border-yellow-500/50 text-yellow-400 bg-yellow-400/5'}`}>
                                 {u.is_published ? 'Live' : 'Draft'}
                              </span>
                           </td>
                           <td className="py-4">
                              <Link href={`/portfolio/${u.college_id}`} target="_blank" className="text-primary hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                 View <ArrowUpRight size={14} />
                              </Link>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Tasks / System Work */}
         <div className="card-premium space-y-6">
            <h3 className="text-xl font-bold font-outfit border-b border-white/5 pb-4 flex items-center gap-2">
               <BarChart3 className="text-primary" size={20} />
               Maintenance Tasks
            </h3>
            <div className="space-y-4">
               <TaskItem label="Verify Resume Storage RLS" priority="high" />
               <TaskItem label="Template 'Bold' Optimization" priority="medium" />
               <TaskItem label="Sync Auth with Student Profiles" priority="medium" />
               <TaskItem label="Review New Signups" priority="low" />
            </div>
            
            <div className="pt-4 mt-8 border-t border-white/5">
               <p className="text-xs text-muted-foreground mb-4">System Subscription Analytics</p>
               <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                     <span className="text-muted-foreground">Free Users</span>
                     <span>98%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-primary" style={{ width: '98%' }} />
                  </div>
                  <div className="flex justify-between text-xs mt-4">
                     <span className="text-muted-foreground">Pro Subscribers</span>
                     <span>2%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-accent" style={{ width: '2%' }} />
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string | number, trend: string }) {
  return (
    <div className="card-premium p-6 space-y-4 border-l-2 border-primary">
      <div className="flex items-center justify-between">
         <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
         {icon}
      </div>
      <div className="space-y-1">
         <div className="text-3xl font-bold font-outfit">{value}</div>
         <div className="text-xs text-green-400 font-medium">{trend}</div>
      </div>
    </div>
  )
}

function TaskItem({ label, priority }: { label: string, priority: 'high' | 'medium' | 'low' }) {
  const color = priority === 'high' ? 'bg-red-500' : priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
       <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
       <span className="text-sm font-medium flex-1 truncate">{label}</span>
       <ArrowUpRight size={14} className="text-muted-foreground" />
    </div>
  )
}
