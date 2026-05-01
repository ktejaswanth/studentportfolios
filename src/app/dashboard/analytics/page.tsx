import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BarChart3, TrendingUp, Eye, MousePointerClick, Globe, ArrowUpRight, Lock } from 'lucide-react'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: student } = await supabase
    .from('students')
    .select('view_count, subscription_status, college_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!student) redirect('/dashboard')

  const isPro = student.subscription_status === 'pro'

  // Generate some visually appealing mock data scaled to their real view count
  const baseViews = student.view_count || 0
  const dailyAverage = Math.round(baseViews / 30) || 1
  const clickThrough = Math.min(Math.round(baseViews * 0.4), 100)

  return (
    <div className="flex flex-col gap-12 py-8 max-w-5xl mx-auto relative">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold font-outfit flex items-center gap-3">
          <BarChart3 className="text-primary w-8 h-8" />
          Advanced Analytics
        </h1>
        <p className="text-muted-foreground text-lg">
          Deep insights into your portfolio's performance and audience engagement.
        </p>
      </div>

      {/* Paywall Overlay */}
      {!isPro && (
        <div className="absolute inset-0 z-50 flex items-center justify-center mt-32">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md rounded-3xl" />
          <div className="relative z-10 card-premium border-primary/50 flex flex-col items-center text-center max-w-md p-12 space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold font-outfit">Premium Feature</h2>
            <p className="text-muted-foreground">
              Upgrade to Premium Pro to unlock advanced traffic analytics, engagement metrics, and audience insights.
            </p>
            <Link href="/dashboard/payments" className="btn-primary w-full mt-4">
              Unlock Analytics
            </Link>
          </div>
        </div>
      )}

      {/* Analytics Content (Blurred if not pro) */}
      <div className={`space-y-12 ${!isPro ? 'opacity-20 pointer-events-none select-none filter blur-sm' : ''}`}>
        
        {/* KPI Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          <KpiCard title="Total Views" value={baseViews.toString()} icon={<Eye className="text-blue-400"/>} trend="+12%" />
          <KpiCard title="Daily Avg" value={dailyAverage.toString()} icon={<TrendingUp className="text-green-400"/>} trend="+5%" />
          <KpiCard title="Link Clicks" value={clickThrough.toString()} icon={<MousePointerClick className="text-purple-400"/>} trend="+22%" />
          <KpiCard title="Global Reach" value="Top 15%" icon={<Globe className="text-orange-400"/>} trend="Ascending" />
        </div>

        {/* Chart Area */}
        <div className="card-premium p-8 space-y-8 h-[400px] flex flex-col">
          <h3 className="text-xl font-bold font-outfit">30-Day Traffic Overview</h3>
          <div className="flex-1 border-b border-l border-white/10 flex items-end justify-between p-4 relative">
             {/* Mock Chart Bars */}
             {[...Array(30)].map((_, i) => {
                const height = Math.random() * 80 + 20; // 20% to 100%
                return (
                  <div key={i} className="w-[2%] bg-primary/40 hover:bg-primary rounded-t-sm transition-all cursor-pointer group relative" style={{ height: `${height}%` }}>
                     <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                       {Math.round(height * (dailyAverage / 50))}
                     </div>
                  </div>
                )
             })}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
             <span>30 days ago</span>
             <span>Today</span>
          </div>
        </div>

      </div>
    </div>
  )
}

function KpiCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
  return (
    <div className="card-premium p-6 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {icon}
      </div>
      <div className="flex items-end justify-between">
         <span className="text-3xl font-bold font-outfit">{value}</span>
         <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full flex items-center gap-1">
           {trend} <ArrowUpRight size={12} />
         </span>
      </div>
    </div>
  )
}
