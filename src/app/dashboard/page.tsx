import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  Plus,
  ExternalLink,
  Edit3,
  Layout,
  Share2,
  CheckCircle,
  Circle,
  Clock,
  Settings,
  Shield,
  Globe,
  Crown,
  Sparkles,
  Zap
} from 'lucide-react'
import { redirect } from 'next/navigation'
import { ShareButton } from '@/components/dashboard/ShareButton'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!student) {
    // Auto-Recovery: If auth exists but profile doesn't, create it now!
    const defaultCollegeId = `ID-${Math.floor(Math.random() * 100000)}`

    const oneYearExpiry = new Date()
    oneYearExpiry.setFullYear(oneYearExpiry.getFullYear() + 1)

    await supabase.from('students').insert({
      college_id: defaultCollegeId,
      user_id: user.id,
      name: user.email?.split('@')[0].toUpperCase() || 'NEW STUDENT',
      email: user.email,
      role: 'admin', // Make them admin automatically so they can test it
      subscription_status: 'pro',
      subscription_activated_at: new Date().toISOString(),
      subscription_expiry: oneYearExpiry.toISOString()
    })

    // Refresh the page to load the new profile
    redirect('/dashboard')
  }

  const portfolioUrl = `/portfolio/${student.college_id}`

  // 3. Calculate Completion Score
  const sections = [
    student.summary,
    student.profile_pic_url,
    student.resume_url,
    student.github_url
  ]
  const listCounts = [
    (await supabase.from('experiences').select('*', { count: 'exact', head: true }).eq('college_id', student.college_id)).count,
    (await supabase.from('projects').select('*', { count: 'exact', head: true }).eq('college_id', student.college_id)).count,
    (await supabase.from('education').select('*', { count: 'exact', head: true }).eq('college_id', student.college_id)).count
  ]

  const filledSections = sections.filter(Boolean).length + listCounts.filter(c => (c || 0) > 0).length
  const totalSections = sections.length + listCounts.length
  const completionPercent = Math.round((filledSections / totalSections) * 100)

  const missingSuggestions = []
  if (!student.summary) missingSuggestions.push('Add Summary')
  if (!student.profile_pic_url) missingSuggestions.push('Add Photo')
  if (!student.resume_url) missingSuggestions.push('Upload Resume')
  if (!student.github_url) missingSuggestions.push('Add GitHub')
  if ((listCounts[0] || 0) === 0) missingSuggestions.push('Add Experience')
  if ((listCounts[1] || 0) === 0) missingSuggestions.push('Add Projects')
  if ((listCounts[2] || 0) === 0) missingSuggestions.push('Add Education')

  // 4. Calculate Days Remaining
  const now = new Date()
  const expiry = student.subscription_expiry ? new Date(student.subscription_expiry) : null
  const daysRemaining = expiry ? Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null
  const isExpired = daysRemaining !== null && daysRemaining <= 0;
  const isExpiringSoon = daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 5;

  return (
    <div className="flex flex-col gap-12 py-8">
      {isExpiringSoon && (
        <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl flex items-start gap-3 animate-pulse-glow">
          <div className="p-2 bg-orange-500/20 rounded-full mt-0.5">
            <Clock size={16} className="text-orange-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-orange-400 font-bold text-sm uppercase tracking-widest">Action Required: Expiring Soon</h3>
            <p className="text-sm text-muted-foreground">
              Your portfolio access expires in <span className="font-bold text-orange-400">{daysRemaining} days</span>.
              Renew your subscription now to avoid any interruption to your live portfolio link.
            </p>
          </div>
          <Link href="/dashboard/payments" className="ml-auto btn-primary py-2 px-4 text-xs whitespace-nowrap">
            Renew Now
          </Link>
        </div>
      )}

      {/* Subscription Timeline UI */}
      {student.subscription_expiry && (
        <div className="card-premium p-6 border-b-2 border-primary/20">
           <div className="flex justify-between items-end mb-4">
              <div className="space-y-1">
                 <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Subscription Lifecycle</p>
                 <h2 className="text-xl font-bold font-outfit">Portfolio Validity</h2>
              </div>
              <div className="text-right">
                 <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Expires On</p>
                 <p className="text-sm font-bold text-primary">{new Date(student.subscription_expiry).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
           </div>
           
           <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`absolute top-0 left-0 h-full transition-all duration-1000 ${isExpired ? 'bg-red-500' : 'bg-gradient-to-r from-primary/50 to-primary'}`}
                style={{ width: `${isExpired ? 100 : Math.max(2, Math.min(100, ( (120 - (daysRemaining || 0)) / 120 ) * 100))}%` }}
              />
           </div>
           
           <div className="flex justify-between mt-3 text-[9px] uppercase tracking-tighter font-bold text-muted-foreground">
              <div className="flex flex-col items-start">
                 <span>Started</span>
                 <span className="text-foreground">{student.subscription_activated_at ? new Date(student.subscription_activated_at).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex flex-col items-center">
                 <span>Current Status</span>
                 <span className={isExpired ? 'text-red-500' : 'text-green-400'}>{isExpired ? 'EXPIRED' : 'ACTIVE'}</span>
              </div>
              <div className="flex flex-col items-end">
                 <span>Expiry</span>
                 <span className="text-foreground">{new Date(student.subscription_expiry).toLocaleDateString()}</span>
              </div>
           </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold font-outfit">Hello, {student.name.split(' ')[0]}! 👋</h1>
          <p className="text-muted-foreground italic">Managing portfolio for ID: <span className="text-foreground font-mono">{student.college_id}</span></p>
        </div>
        <div className="flex flex-col md:items-end gap-4">
          {daysRemaining !== null && (
            <div className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border w-fit ${isExpired ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
              {isExpired ? 'Timeline Over' : `${daysRemaining} Days to Portfolio Live`}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <Link href={portfolioUrl} target="_blank" className="btn-secondary flex items-center gap-2 text-sm">
              <ExternalLink size={16} />
              View Live Site
            </Link>
            <Link href="/dashboard/edit" className="btn-primary flex items-center gap-2 text-sm">
              <Edit3 size={16} />
              Edit Portfolio
            </Link>
          </div>
        </div>
      </div>

      {/* Stats/Status Cards */}
      <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-6">
        <div className={`card-premium flex flex-col gap-2 p-5 text-left border-l-2 ${isExpired ? 'border-red-500 bg-red-500/5' : 'border-primary'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Subscription</span>
            <Shield size={18} className={isExpired ? 'text-red-500' : 'text-primary'} />
          </div>
          <div className="mt-2 space-y-2">
            <div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold font-outfit uppercase tracking-wider">
                  {student.subscription_status === 'pro' ? "Premium Pro" : "Free Plan"}
                </div>
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-black uppercase tracking-tighter border border-primary/20">
                  {student.subscription_status === 'pro' ? '120D' : '30D'}
                </span>
              </div>
              <div className={`text-[10px] uppercase font-bold tracking-widest mt-1 ${isExpired ? 'text-red-500' : 'text-muted-foreground'}`}>
                {isExpired ? 'Subscription Expired' : daysRemaining !== null ? `${daysRemaining} Days Left` : 'Unlimited Access'}
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 space-y-1">
              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">
                Started: {student.subscription_activated_at ? new Date(student.subscription_activated_at).toLocaleDateString() : 'N/A'}
              </p>
              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">
                Expires: {student.subscription_expiry ? new Date(student.subscription_expiry).toLocaleDateString() : 'N/A'}
              </p>
            </div>

            <Link href="/dashboard/payments" className="text-[10px] text-primary hover:underline font-bold uppercase tracking-widest mt-2 block pt-1">
              {isExpired ? 'Renew Now →' : 'Manage Billing →'}
            </Link>
          </div>
        </div>

        <div className="card-premium flex flex-col gap-2 p-5 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Status</span>
            <Clock className="text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-outfit">{student.is_published ? "Published" : "Draft"}</div>
            <div className="text-xs text-muted-foreground">{student.is_published ? "Visible to everyone" : "Private view"}</div>
          </div>
        </div>

        <div className="card-premium flex flex-col gap-2 p-5 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Template</span>
            <Layout className="text-purple-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-outfit">{student.selected_template.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}</div>
            <div className="text-xs text-muted-foreground">Modern & Professional</div>
          </div>
        </div>

        <div className="card-premium flex flex-col gap-2 p-5 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Views</span>
            <Share2 className="text-green-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-outfit">{student.view_count || 0}</div>
            <div className="text-xs text-muted-foreground">Total portfolio visits</div>
          </div>
        </div>

        <div className="card-premium flex flex-col gap-2 p-5 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Completion</span>
            <Settings className="text-orange-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-outfit">{completionPercent}%</div>
            {completionPercent === 100 ? (
              <div className="text-xs text-green-400 font-bold flex items-center gap-1 mt-1"><CheckCircle size={12} /> All set!</div>
            ) : (
              <div className="mt-2 flex flex-wrap gap-1">
                {missingSuggestions.slice(0, 2).map((s, i) => (
                  <Link key={i} href="/dashboard/edit" className="text-[9px] uppercase font-bold tracking-widest bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-muted-foreground hover:text-primary transition-colors border border-white/5">
                    + {s}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Premium Pro Upgrade Banner (Only for Free Users) */}
      {student.subscription_status === 'free' && (
        <div className="card-premium bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border-primary/30 flex flex-col md:flex-row items-center justify-between gap-6 p-8 relative overflow-hidden group shadow-2xl shadow-primary/5">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Crown size={120} />
          </div>
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
              <Sparkles size={12} /> Limited Free Plan
            </div>
            <h3 className="text-2xl font-bold font-outfit">Unlock the Full Power of Portfolia</h3>
            <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
              Upgrade to <span className="text-primary font-bold">Premium Pro</span> to unlock all templates, custom branding, priority support, and extend your portfolio validity to 120 days.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
            <Link href="/pricing" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
              Compare Plans
            </Link>
            <Link href="/dashboard/payments/upgrade" className="btn-primary px-8 py-3 shadow-xl shadow-primary/20 flex items-center gap-2 group-hover:scale-105 transition-all">
              Upgrade for ₹10 <Zap size={18} />
            </Link>
          </div>
        </div>
      )}

      {/* Premium Pro Features (For Pro Users) */}
      {student.subscription_status === 'pro' && (
        <div className="card-premium bg-gradient-to-r from-primary/10 to-transparent border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4 p-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Shield size={20} className="text-primary" />
              Premium Pro Active
            </h3>
            <p className="text-sm text-muted-foreground">You have access to all premium templates, custom colors, and priority support.</p>
          </div>
          <a href={`mailto:support@portfolia.com?subject=Priority Support: ID ${student.college_id}`} className="btn-primary text-sm whitespace-nowrap">
            Priority Support
          </a>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="card-premium flex flex-col gap-6">
          <h2 className="text-2xl font-bold font-outfit flex items-center gap-2">
            <Edit3 className="text-primary" size={24} />
            Quick Editor
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <EditorLink href="/dashboard/edit#personal" label="Personal Information" completed={true} />
            <EditorLink href="/dashboard/edit#summary" label="Professional Summary" completed={true} />
            <EditorLink href="/dashboard/edit#experience" label="Work Experience" completed={false} />
            <EditorLink href="/dashboard/edit#projects" label="Project Gallery" completed={false} />
            <EditorLink href="/dashboard/edit#education" label="Educational Background" completed={true} />
          </div>
        </div>

        <div className="card-premium flex flex-col gap-6">
          <h2 className="text-2xl font-bold font-outfit flex items-center gap-2">
            <Layout className="text-primary" size={24} />
            Portfolio Preview
          </h2>
          <div className="relative aspect-video rounded-xl bg-muted overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
            <div className="absolute bottom-4 left-4 z-20">
              <p className="font-bold text-lg">{student.selected_template.toUpperCase()}</p>
              <Link href="/dashboard/templates" className="text-sm text-primary hover:underline">Change template →</Link>
            </div>
            {/* Template Preview Placeholder */}
            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
              <Layout size={48} className="text-primary/20" />
            </div>
          </div>
          <div className="bg-secondary p-4 rounded-xl text-sm border border-border">
            <p className="text-muted-foreground mb-3 text-xs uppercase tracking-widest font-bold">Quick Share</p>
            <ShareButton collegeId={student.college_id} />
          </div>
        </div>
      </div>

      {/* Custom Domain Section (Pro Feature) */}
      <div className="card-premium p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-outfit flex items-center gap-3">
              <Globe className="text-primary" />
              Custom Domain
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl">
              Connect your professional domain (e.g., www.yourname.com) to your portfolio.
              {student.subscription_status !== 'pro' && ' (Upgrade to Pro to unlock)'}
            </p>
          </div>
          {student.subscription_status === 'pro' ? (
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="portfolio.yourname.com"
                className="input-field max-w-xs"
                disabled
                value="pending-dns-config..."
              />
              <button className="btn-secondary whitespace-nowrap opacity-50 cursor-not-allowed">
                Connect
              </button>
            </div>
          ) : (
            <Link href="/dashboard/payments" className="btn-secondary">
              Unlock Domains
            </Link>
          )}
        </div>

        {student.subscription_status === 'pro' && (
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
              <Clock className="text-yellow-500" size={20} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-yellow-500 uppercase tracking-widest">Configuration Required</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                To connect your domain, please point your <b>CNAME record</b> to <code className="bg-white/5 px-1 rounded">cname.portfolia.io</code> and wait up to 24 hours for DNS propagation.
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

function StatusCard({ icon, label, value, subValue }: { icon: React.ReactNode, label: string, value: string, subValue: string }) {
  return (
    <div className="card-premium flex flex-col gap-2 p-5 text-left">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{label}</span>
        {icon}
      </div>
      <div className="mt-2">
        <div className="text-2xl font-bold font-outfit">{value}</div>
        <div className="text-xs text-muted-foreground">{subValue}</div>
      </div>
    </div>
  )
}

function EditorLink({ href, label, completed }: { href: string, label: string, completed: boolean }) {
  return (
    <Link href={href} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border hover:bg-secondary transition-colors group">
      <span className="text-sm font-medium">{label}</span>
      {completed ? (
        <CheckCircle className="text-green-500" size={16} />
      ) : (
        <Plus className="text-muted-foreground group-hover:text-primary transition-colors" size={16} />
      )}
    </Link>
  )
}
