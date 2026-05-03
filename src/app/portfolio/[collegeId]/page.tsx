import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ModernDark from '@/components/templates/ModernDark'
import MinimalClean from '@/components/templates/MinimalClean'
import GradientBold from '@/components/templates/GradientBold'
import LightCreative from '@/components/templates/LightCreative'
import ProfessionalWhite from '@/components/templates/ProfessionalWhite'

export default async function PublicPortfolio({ params }: { params: Promise<{ collegeId: string }> }) {
  const supabase = await createClient()
  const { collegeId } = await params

  // 1. Increment View Count (Fire and forget from server)
  await supabase.rpc('increment_view_count', { target_college_id: collegeId })

  // 2. Fetch student
  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('college_id', collegeId)
    .maybeSingle()

  if (!student) {
    notFound()
  }

  if (student.subscription_expiry && new Date(student.subscription_expiry) < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white font-outfit p-4 text-center">
         <div className="max-w-md space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 flex items-center justify-center rounded-3xl mx-auto shadow-2xl shadow-red-500/5 border border-red-500/20">
               <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Link Expired</h1>
              <p className="text-zinc-400 text-lg leading-relaxed">This public portfolio link is no longer active. The student's subscription period has ended.</p>
            </div>
            <div className="pt-4">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-8" />
              <p className="text-sm text-zinc-500 italic">Are you the owner? Renew your plan in the dashboard to go live again.</p>
            </div>
         </div>
      </div>
    )
  }

  // Fetch related data
  const [exp, proj, edu, sk] = await Promise.all([
    supabase.from('experiences').select('*').eq('college_id', collegeId).order('created_at'),
    supabase.from('projects').select('*').eq('college_id', collegeId).order('created_at'),
    supabase.from('education').select('*').eq('college_id', collegeId).order('created_at'),
    supabase.from('skills').select('*').eq('college_id', collegeId).order('created_at')
  ])

  const templateProps = {
    student,
    experiences: exp.data || [],
    projects: proj.data || [],
    education: edu.data || [],
    skills: sk.data || []
  }

  // Render correct template
  let renderedTemplate;
  switch (student.selected_template) {
    case 'modern-dark': renderedTemplate = <ModernDark {...templateProps} />; break;
    case 'minimal-clean': renderedTemplate = <MinimalClean {...templateProps} />; break;
    case 'gradient-bold': renderedTemplate = <GradientBold {...templateProps} />; break;
    case 'light-creative': renderedTemplate = <LightCreative {...templateProps} />; break;
    case 'professional-white': renderedTemplate = <ProfessionalWhite {...templateProps} />; break;
    default: renderedTemplate = <ModernDark {...templateProps} />; break;
  }

  const themeStyle = student.theme_color ? { '--app-primary': student.theme_color } as React.CSSProperties : {};

  return (
    <div style={themeStyle}>
      {renderedTemplate}
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ collegeId: string }> }) {
  const supabase = await createClient()
  const { collegeId } = await params
  const { data: student } = await supabase
    .from('students')
    .select('name, role_title, summary, subscription_expiry')
    .eq('college_id', collegeId)
    .maybeSingle()

  if (!student) return { title: 'Not Found' }

  // Check expiration for metadata too
  if (student.subscription_expiry && new Date(student.subscription_expiry) < new Date()) {
    return {
      title: 'Portfolio Expired | Portfolia',
      description: 'This professional portfolio link has expired.',
      robots: { index: false, follow: false }
    }
  }

  return {
    title: `${student.name} | ${student.role_title}`,
    description: student.summary,
    openGraph: {
      title: `${student.name}'s Professional Portfolio`,
      description: student.summary,
      type: 'website',
    }
  }
}
