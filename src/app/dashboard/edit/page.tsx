'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Briefcase, 
  BookOpen, 
  Code, 
  Trophy, 
  FileText, 
  Mail, 
  Phone, 
  Link2, 
  Plus, 
  Trash2, 
  Save, 
  Loader2,
  Upload,
  ArrowUp,
  ArrowDown,
  Layout,
  Award,
  Heart,
  Star,
  Zap,
  Info
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

type Experience = { company: string; role: string; duration: string; description: string }
type Project = { title: string; description: string; tech: string; link: string }
type Education = { college: string; degree: string; year: string; cgpa: string }
type Skill = { name: string; level: number }
type Certification = { name: string; issuer: string; date: string; link: string }

export default function EditPortfolio() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [personal, setPersonal] = useState({
    name: '',
    role_title: '',
    email: '',
    phone: '',
    github_url: '',
    linkedin_url: '',
    summary: '',
    profile_pic_url: '',
    resume_url: '',
    college_id: '',
    theme_color: '#E53935',
    subscription_status: 'free',
    portfolio_password: '',
    about_me: '',
    introduction: '',
    hobbies: '',
    interests: '',
    achievements: '',
    font_family: 'Outfit',
    font_size: 'standard',
    section_order: ['summary', 'experience', 'projects', 'education', 'skills', 'certifications', 'interests', 'hobbies']
  })

  const [experiences, setExperiences] = useState<Experience[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: student } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (student) {
      setPersonal({
        name: student.name || '',
        role_title: student.role_title || '',
        email: student.email || '',
        phone: student.phone || '',
        github_url: student.github_url || '',
        linkedin_url: student.linkedin_url || '',
        summary: student.summary || '',
        profile_pic_url: student.profile_pic_url || '',
        resume_url: student.resume_url || '',
        college_id: student.college_id,
        theme_color: student.theme_color || '#E53935',
        subscription_status: student.subscription_status || 'free',
        portfolio_password: student.portfolio_password || '',
        about_me: student.about_me || '',
        introduction: student.introduction || '',
        hobbies: student.hobbies || '',
        interests: student.interests || '',
        achievements: student.achievements || '',
        font_family: student.font_family || 'Outfit',
        font_size: student.font_size || 'standard',
        section_order: (() => {
          const defaults = ['summary', 'experience', 'projects', 'education', 'skills', 'certifications', 'interests', 'hobbies', 'achievements'];
          const existing = student.section_order || [];
          const missing = defaults.filter(d => !existing.includes(d));
          return [...existing, ...missing];
        })()
      })
      
      // Fetch related data
      const [exp, proj, edu, sk, cert] = await Promise.all([
        supabase.from('experiences').select('*').eq('college_id', student.college_id).order('created_at'),
        supabase.from('projects').select('*').eq('college_id', student.college_id).order('created_at'),
        supabase.from('education').select('*').eq('college_id', student.college_id).order('created_at'),
        supabase.from('skills').select('*').eq('college_id', student.college_id).order('created_at'),
        supabase.from('certifications').select('*').eq('college_id', student.college_id).order('created_at')
      ])

      setExperiences(exp.data || [])
      setProjects(proj.data || [])
      setEducation(edu.data || [])
      setSkills(sk.data || [])
      setCertifications(cert.data || [])
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      // 1. Update Student Personal Info
      const { subscription_status, ...updatePayload } = personal;
      const { error: studentError } = await supabase
        .from('students')
        .update(updatePayload)
        .eq('college_id', personal.college_id)

      if (studentError) throw studentError

      // 2. Simple sync strategy: Delete all and re-insert for children
      // (In a prod app, you'd do a delta update, but this is simpler for this project)
      await Promise.all([
        supabase.from('experiences').delete().eq('college_id', personal.college_id),
        supabase.from('projects').delete().eq('college_id', personal.college_id),
        supabase.from('education').delete().eq('college_id', personal.college_id),
        supabase.from('skills').delete().eq('college_id', personal.college_id),
        supabase.from('certifications').delete().eq('college_id', personal.college_id)
      ])

      const insertPromises = []
      if (experiences.length) insertPromises.push(supabase.from('experiences').insert(experiences.map(e => ({ ...e, college_id: personal.college_id }))))
      if (projects.length) insertPromises.push(supabase.from('projects').insert(projects.map(p => ({ ...p, college_id: personal.college_id }))))
      if (education.length) insertPromises.push(supabase.from('education').insert(education.map(e => ({ ...e, college_id: personal.college_id }))))
      if (skills.length) insertPromises.push(supabase.from('skills').insert(skills.map(s => ({ ...s, college_id: personal.college_id }))))
      if (certifications.length) insertPromises.push(supabase.from('certifications').insert(certifications.map(c => ({ ...c, college_id: personal.college_id }))))

      await Promise.all(insertPromises)

      toast.success('Portfolio updated successfully!')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'pic' | 'resume') => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileExt = file.name.split('.').pop()
    const fileName = `${personal.college_id}-${type}-${Math.random()}.${fileExt}`
    const bucket = type === 'pic' ? 'profile-pics' : 'resumes'

    setSaving(true)
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file)

    if (error) {
       toast.error(`Upload failed: ${error.message}. Make sure the bucket exists and is public.`)
       setSaving(false)
       return
    }

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName)
    
    if (type === 'pic') setPersonal({...personal, profile_pic_url: publicUrl})
    else setPersonal({...personal, resume_url: publicUrl})
    
    setSaving(false)
    toast.success('File uploaded!')
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>
  )


  const generateWithAI = async (type: 'summary' | 'project' | 'achievements', index?: number) => {
    if (!personal.role_title) {
       toast.error('Please enter a Headline / Role Type first'); return;
    }
    setAiLoading(true)
    const existingContent = type === 'summary' ? personal.summary : (type === 'project' && index !== undefined ? projects[index].description : (type === 'achievements' ? personal.achievements : ''));
    const isRefining = existingContent && existingContent.length > 20;

    try {
       let prompt = "";
       if (type === 'summary') {
          prompt = isRefining 
            ? `I am a ${personal.role_title}. Improve and professionally polish this bio: "${existingContent}"` 
            : `I am a ${personal.role_title}. I have skills in ${skills.map(s => s.name).join(', ')}. Generate a short professional bio.`;
       } else if (type === 'project' && index !== undefined) {
          prompt = isRefining
            ? `Improve this project description for ${projects[index].title}: "${existingContent}"`
            : `I am a ${personal.role_title}. This project is called ${projects[index].title} using ${projects[index].tech}. Describe it professionally.`;
       } else if (type === 'achievements') {
          prompt = isRefining
            ? `Improve and professionally polish these achievements: "${existingContent}"`
            : `I am a ${personal.role_title}. Generate a list of professional achievements or honors based on my background.`;
       }
          
       const res = await fetch('/api/ai/generate', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ type, prompt, resume_url: personal.resume_url })
       });
       const data = await res.json();
       
       if (data.error) throw new Error(data.error);
       
       if (type === 'summary') {
          setPersonal(prev => ({...prev, summary: data.text}))
       } else if (type === 'project' && index !== undefined) {
          const newProj = [...projects];
          newProj[index].description = data.text;
          setProjects(newProj);
       } else if (type === 'achievements') {
          setPersonal(prev => ({...prev, achievements: data.text}))
       }
       toast.success(isRefining ? 'Content refined with AI!' : 'AI generation successful!')
    } catch (err) {
       toast.error('AI Generation failed')
    }
    setAiLoading(false)
  }

  return (
    <div className="flex flex-col gap-8 md:gap-12 max-w-4xl mx-auto py-4 md:py-8">
      <div className="flex items-center justify-between sticky top-[64px] md:top-24 z-40 bg-background/80 backdrop-blur-md py-3 md:py-4 border-b border-white/5 -mx-4 px-4 md:mx-0 md:px-0">
        <h1 className="text-2xl md:text-3xl font-bold font-outfit">Edit Portfolio</h1>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="btn-primary flex items-center gap-2 py-2 px-4 text-sm"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          <span className="hidden sm:inline">Save Changes</span>
          <span className="sm:hidden">Save</span>
        </button>
      </div>

      {/* Personal Info */}
      <section id="personal" className="space-y-6">
        <SectionTitle icon={<User size={24} />} title="Personal Information" />
        <div className="grid md:grid-cols-2 gap-6 card-premium">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input 
                className="input-field" 
                value={personal.name} 
                onChange={(e) => setPersonal({...personal, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Headline / Role Type</label>
              <input 
                className="input-field" 
                placeholder="Software Engineer Intern"
                value={personal.role_title} 
                onChange={(e) => setPersonal({...personal, role_title: e.target.value})}
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-border rounded-2xl gap-4">
             {personal.profile_pic_url ? (
                <img src={personal.profile_pic_url} className="w-24 h-24 rounded-full object-cover border-2 border-primary" />
             ) : (
                <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                   <User size={40} />
                </div>
             )}
             <label className="btn-secondary text-xs py-2 px-4 cursor-pointer">
                <Upload size={14} className="inline mr-2" />
                Upload Profile Pic
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'pic')} />
             </label>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 card-premium">
           <InputWithIcon label="Email" icon={<Mail size={16}/>} value={personal.email} onChange={(v) => setPersonal({...personal, email: v})} />
           <InputWithIcon label="Phone" icon={<Phone size={16}/>} value={personal.phone} onChange={(v) => setPersonal({...personal, phone: v})} />
           <InputWithIcon label="GitHub URL" icon={<Code size={16}/>} value={personal.github_url} onChange={(v) => setPersonal({...personal, github_url: v})} />
           <InputWithIcon label="LinkedIn URL" icon={<Link2 size={16}/>} value={personal.linkedin_url} onChange={(v) => setPersonal({...personal, linkedin_url: v})} />
           
           <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                 Theme Color
                 {personal.subscription_status !== 'pro' && <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-widest">Pro</span>}
              </label>
              <div className="flex items-center gap-3">
                 <input 
                   type="color" 
                   className={`w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0 ${personal.subscription_status !== 'pro' ? 'opacity-50 cursor-not-allowed' : ''}`}
                   value={personal.theme_color || '#E53935'}
                   onChange={(e) => personal.subscription_status === 'pro' && setPersonal({...personal, theme_color: e.target.value})}
                   disabled={personal.subscription_status !== 'pro'}
                 />
                 <span className="text-muted-foreground font-mono text-sm">{personal.theme_color || '#E53935'}</span>
              </div>
           </div>

           <div className="md:col-span-1 space-y-2">
              <label className="text-sm font-medium">Resume PDF</label>
              <label className="input-field flex items-center gap-2 cursor-pointer text-muted-foreground truncate">
                 <FileText size={16} />
                 {personal.resume_url ? 'Resume Updated' : 'Upload Resume'}
                 <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileUpload(e, 'resume')} />
              </label>
           </div>
           
           <div className="md:col-span-1 space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                Portfolio Password
                {personal.subscription_status !== 'pro' && <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-widest">Pro</span>}
              </label>
              <input 
                type="password"
                className="input-field" 
                placeholder="Leave empty for public"
                value={personal.portfolio_password}
                onChange={(e) => personal.subscription_status === 'pro' && setPersonal({...personal, portfolio_password: e.target.value})}
                disabled={personal.subscription_status !== 'pro'}
              />
           </div>
        </div>
      </section>

      {/* Layout Settings */}
      <section id="layout" className="space-y-6">
         <div className="flex items-center justify-between">
            <SectionTitle icon={<Layout size={24} />} title="Layout Ordering" />
         </div>
         <div className="card-premium space-y-2">
            <p className="text-sm text-muted-foreground mb-4">Rearrange the sections of your portfolio. (Premium feature)</p>
            {personal.section_order?.map((section: string, idx: number) => (
               <div key={section} className={`flex items-center justify-between p-3 rounded-lg border border-white/5 ${personal.subscription_status === 'pro' ? 'bg-white/5' : 'bg-white/[0.02] opacity-50'}`}>
                  <span className="text-sm font-bold capitalize">{section}</span>
                  <div className="flex gap-2">
                     <button 
                       disabled={personal.subscription_status !== 'pro' || idx === 0}
                       onClick={() => {
                          const newOrder = [...personal.section_order];
                          [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
                          setPersonal({...personal, section_order: newOrder})
                       }}
                       className="p-1 hover:bg-white/10 rounded transition-colors disabled:opacity-30"
                     >
                       <ArrowUp size={16} />
                     </button>
                     <button 
                       disabled={personal.subscription_status !== 'pro' || idx === personal.section_order.length - 1}
                       onClick={() => {
                          const newOrder = [...personal.section_order];
                          [newOrder[idx + 1], newOrder[idx]] = [newOrder[idx], newOrder[idx + 1]];
                          setPersonal({...personal, section_order: newOrder})
                       }}
                       className="p-1 hover:bg-white/10 rounded transition-colors disabled:opacity-30"
                     >
                       <ArrowDown size={16} />
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* About Me & Introduction */}
      <section id="about" className="space-y-6">
         <div className="flex items-center justify-between">
            <SectionTitle icon={<Info size={24} />} title="About Me & Introduction" />
         </div>
         <div className="grid md:grid-cols-1 gap-6 card-premium">
            <div className="space-y-2">
               <label className="text-sm font-medium">Short Introduction</label>
               <input 
                 className="input-field" 
                 placeholder="A brief one-liner introduction..."
                 value={personal.introduction || ''} 
                 onChange={(e) => setPersonal({...personal, introduction: e.target.value})}
               />
            </div>
            <div className="space-y-2">
               <label className="text-sm font-medium">Detailed About Me</label>
               <textarea 
                 className="input-field min-h-[120px] resize-none" 
                 placeholder="Tell your story, your background, and what makes you unique..."
                 value={personal.about_me || ''} 
                 onChange={(e) => setPersonal({...personal, about_me: e.target.value})}
               />
            </div>
         </div>
      </section>

      {/* Summary */}
      <section id="summary" className="space-y-6">
         <div className="flex items-center justify-between">
            <SectionTitle icon={<FileText size={24} />} title="Professional Summary" />
            <button 
               onClick={() => generateWithAI('summary')} 
               disabled={aiLoading}
               className="btn-secondary flex items-center gap-2 py-1 px-3 text-xs"
            >
               {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <span>🪄</span>}
               {personal.summary && personal.summary.length > 20 ? 'Refine with AI' : 'AI Auto-Write'}
            </button>
         </div>
         <div className="card-premium">
            <textarea 
              className="input-field min-h-[150px] resize-none" 
              placeholder="Tell us about yourself, your passions, and your goals..."
              value={personal.summary}
              onChange={(e) => setPersonal({...personal, summary: e.target.value})}
            />
         </div>
      </section>

      {/* Experience */}
      <section id="experience" className="space-y-6">
         <div className="flex items-center justify-between">
           <SectionTitle icon={<Briefcase size={24} />} title="Work Experience" />
           <button 
             onClick={() => setExperiences([...experiences, { company: '', role: '', duration: '', description: '' }])}
             className="btn-secondary py-2 px-4 text-xs flex items-center gap-2"
           >
             <Plus size={14} /> Add Experience
           </button>
         </div>
         <div className="space-y-4">
            {experiences.map((exp, i) => (
              <div key={i} className="card-premium relative group">
                 <button 
                   onClick={() => setExperiences(experiences.filter((_, idx) => idx !== i))}
                   className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
                 >
                   <Trash2 size={18} />
                 </button>
                 <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <input 
                      placeholder="Company Name" 
                      className="input-field" 
                      value={exp.company} 
                      onChange={(e) => {
                         const newList = [...experiences]; newList[i].company = e.target.value; setExperiences(newList);
                      }}
                    />
                    <input 
                      placeholder="Role" 
                      className="input-field" 
                      value={exp.role} 
                      onChange={(e) => {
                         const newList = [...experiences]; newList[i].role = e.target.value; setExperiences(newList);
                      }}
                    />
                    <input 
                      placeholder="Duration (e.g. 2023 - Present)" 
                      className="input-field" 
                      value={exp.duration} 
                      onChange={(e) => {
                         const newList = [...experiences]; newList[i].duration = e.target.value; setExperiences(newList);
                      }}
                    />
                 </div>
                 <textarea 
                   placeholder="Describe what you did..." 
                   className="input-field min-h-[100px] resize-none" 
                   value={exp.description}
                   onChange={(e) => {
                      const newList = [...experiences]; newList[i].description = e.target.value; setExperiences(newList);
                   }}
                 />
              </div>
            ))}
            {experiences.length === 0 && <EmptyState message="No experience added yet." />}
         </div>
      </section>

      {/* Projects */}
      <section id="projects" className="space-y-6">
         <div className="flex items-center justify-between">
            <SectionTitle icon={<Code size={24} />} title="Projects" />
            <button 
              onClick={() => setProjects([...projects, { title: '', description: '', tech: '', link: '' }])}
              className="btn-secondary py-2 px-4 text-xs flex items-center gap-2"
            >
              <Plus size={14} /> Add Project
            </button>
         </div>
         <div className="grid md:grid-cols-2 gap-6">
            {projects.map((proj, i) => (
              <div key={i} className="card-premium relative group">
                 <button 
                   onClick={() => setProjects(projects.filter((_, idx) => idx !== i))}
                   className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors z-10"
                 >
                   <Trash2 size={18} />
                 </button>
                 <div className="space-y-4">
                    <input placeholder="Project Title" className="input-field" value={proj.title} onChange={(e) => { const n = [...projects]; n[i].title = e.target.value; setProjects(n); }} />
                    <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <span className="text-xs text-muted-foreground font-medium">Description</span>
                         <button 
                           onClick={() => generateWithAI('project', i)} 
                           disabled={aiLoading}
                           className="btn-secondary flex items-center gap-2 py-0.5 px-2 text-[10px]"
                         >
                           {aiLoading ? <Loader2 size={10} className="animate-spin" /> : <span>🪄</span>}
                           {proj.description && proj.description.length > 20 ? 'Refine with AI' : 'AI Generate'}
                         </button>
                       </div>
                       <textarea placeholder="Brief description..." className="input-field min-h-[80px] resize-none" value={proj.description} onChange={(e) => { const n = [...projects]; n[i].description = e.target.value; setProjects(n); }} />
                    </div>
                    <input placeholder="Tech Stack (e.g. React, Node, SQL)" className="input-field" value={proj.tech} onChange={(e) => { const n = [...projects]; n[i].tech = e.target.value; setProjects(n); }} />
                    <input placeholder="Live/GitHub Link" className="input-field" value={proj.link} onChange={(e) => { const n = [...projects]; n[i].link = e.target.value; setProjects(n); }} />
                 </div>
              </div>
            ))}
         </div>
         {projects.length === 0 && <EmptyState message="Showcase your best work here!" />}
      </section>

      {/* Education */}
      <section id="education" className="space-y-6">
         <div className="flex items-center justify-between">
           <SectionTitle icon={<BookOpen size={24} />} title="Education" />
           <button 
             onClick={() => setEducation([...education, { college: '', degree: '', year: '', cgpa: '' }])}
             className="btn-secondary py-2 px-4 text-xs flex items-center gap-2"
           >
             <Plus size={14} /> Add Education
           </button>
         </div>
         <div className="space-y-4">
            {education.map((edu, i) => (
              <div key={i} className="card-premium relative grid md:grid-cols-5 gap-4 items-end">
                 <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">College / University</label>
                    <input className="input-field" value={edu.college} onChange={(e) => { const n = [...education]; n[i].college = e.target.value; setEducation(n); }} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Degree</label>
                    <input className="input-field" value={edu.degree} onChange={(e) => { const n = [...education]; n[i].degree = e.target.value; setEducation(n); }} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Year</label>
                    <input className="input-field" placeholder="2020 - 2024" value={edu.year} onChange={(e) => { const n = [...education]; n[i].year = e.target.value; setEducation(n); }} />
                 </div>
                 <div className="space-y-2 flex items-center gap-2">
                    <div className="flex-1 space-y-2">
                       <label className="text-xs font-medium text-muted-foreground">CGPA / %</label>
                       <input className="input-field" value={edu.cgpa} onChange={(e) => { const n = [...education]; n[i].cgpa = e.target.value; setEducation(n); }} />
                    </div>
                    <button 
                      onClick={() => setEducation(education.filter((_, idx) => idx !== i))}
                      className="text-muted-foreground hover:text-destructive transition-colors mb-2"
                    >
                      <Trash2 size={20} />
                    </button>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* Skills */}
      <section id="skills" className="space-y-6">
         <div className="flex items-center justify-between">
           <SectionTitle icon={<Trophy size={24} />} title="Skills & Tools" />
           <button 
             onClick={() => setSkills([...skills, { name: '', level: 80 }])}
             className="btn-secondary py-2 px-4 text-xs flex items-center gap-2"
           >
             <Plus size={14} /> Add Skill
           </button>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {skills.map((skill, i) => (
              <div key={i} className="card-premium p-3 flex flex-col gap-2">
                 <input 
                   placeholder="Skill name" 
                   className="bg-transparent border-none outline-none text-sm font-bold w-full" 
                   value={skill.name} 
                   onChange={(e) => { const n = [...skills]; n[i].name = e.target.value; setSkills(n); }} 
                 />
                 <div className="flex items-center justify-between gap-2 mt-1">
                    <input 
                       type="range" 
                       min="0" max="100" 
                       className="flex-1 accent-primary h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                       value={skill.level}
                       onChange={(e) => { const n = [...skills]; n[i].level = parseInt(e.target.value); setSkills(n); }}
                    />
                    <button 
                      onClick={() => setSkills(skills.filter((_, idx) => idx !== i))}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </button>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* Certifications */}
      <section id="certifications" className="space-y-6">
         <div className="flex items-center justify-between">
            <SectionTitle icon={<Award size={24} />} title="Certifications" />
            <button 
              onClick={() => setCertifications([...certifications, { name: '', issuer: '', date: '', link: '' }])}
              className="btn-secondary py-2 px-4 text-xs flex items-center gap-2"
            >
              <Plus size={14} /> Add Certification
            </button>
         </div>
         <div className="space-y-4">
            {certifications.map((cert, i) => (
              <div key={i} className="card-premium relative grid md:grid-cols-4 gap-4 items-end">
                 <div className="md:col-span-1 space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Name</label>
                    <input className="input-field" value={cert.name} onChange={(e) => { const n = [...certifications]; n[i].name = e.target.value; setCertifications(n); }} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Issuer</label>
                    <input className="input-field" value={cert.issuer} onChange={(e) => { const n = [...certifications]; n[i].issuer = e.target.value; setCertifications(n); }} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Date</label>
                    <input className="input-field" placeholder="Jan 2024" value={cert.date} onChange={(e) => { const n = [...certifications]; n[i].date = e.target.value; setCertifications(n); }} />
                 </div>
                 <div className="space-y-2 flex items-center gap-2">
                    <div className="flex-1 space-y-2">
                       <label className="text-xs font-medium text-muted-foreground">Link</label>
                       <input className="input-field" value={cert.link} onChange={(e) => { const n = [...certifications]; n[i].link = e.target.value; setCertifications(n); }} />
                    </div>
                    <button 
                      onClick={() => setCertifications(certifications.filter((_, idx) => idx !== i))}
                      className="text-muted-foreground hover:text-destructive transition-colors mb-2"
                    >
                      <Trash2 size={20} />
                    </button>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* Achievements, Hobbies, Interests */}
      <section id="extra" className="space-y-6">
         <SectionTitle icon={<Star size={24} />} title="Achievements, Hobbies & Interests" />
         <div className="grid md:grid-cols-1 gap-6 card-premium">
            <div className="space-y-2">
               <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2">
                     <Trophy size={16} className="text-primary" /> Key Achievements
                  </label>
                  <button 
                     onClick={() => generateWithAI('achievements')} 
                     disabled={aiLoading}
                     className="btn-secondary flex items-center gap-2 py-0.5 px-2 text-[10px]"
                  >
                     {aiLoading ? <Loader2 size={10} className="animate-spin" /> : <span>🪄</span>}
                     {personal.achievements && personal.achievements.length > 20 ? 'Refine with AI' : 'AI Generate'}
                  </button>
               </div>
               <textarea 
                 className="input-field min-h-[80px] resize-none" 
                 placeholder="Honors, awards, competition wins..."
                 value={personal.achievements || ''} 
                 onChange={(e) => setPersonal({...personal, achievements: e.target.value})}
               />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                     <Heart size={16} className="text-primary" /> Hobbies
                  </label>
                  <input 
                    className="input-field" 
                    placeholder="Photography, Traveling, Chess..."
                    value={personal.hobbies || ''} 
                    onChange={(e) => setPersonal({...personal, hobbies: e.target.value})}
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                     <Zap size={16} className="text-primary" /> Interests
                  </label>
                  <input 
                    className="input-field" 
                    placeholder="AI, Web3, Space, Music..."
                    value={personal.interests || ''} 
                    onChange={(e) => setPersonal({...personal, interests: e.target.value})}
                  />
               </div>
            </div>
 
            <div className="space-y-2">
               <label className="text-sm font-medium flex items-center gap-2">
                  Font Family
                  {personal.subscription_status !== 'pro' && <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-widest">Pro</span>}
               </label>
               <select 
                 className={`input-field ${personal.subscription_status !== 'pro' ? 'opacity-50 cursor-not-allowed' : ''}`}
                 value={personal.font_family}
                 onChange={(e) => personal.subscription_status === 'pro' && setPersonal({...personal, font_family: e.target.value})}
                 disabled={personal.subscription_status !== 'pro'}
               >
                 <option value="Outfit">Outfit (Modern)</option>
                 <option value="Inter">Inter (Clean)</option>
                 <option value="Roboto">Roboto (Classic)</option>
                 <option value="Montserrat">Montserrat (Geometric)</option>
                 <option value="Playfair Display">Playfair Display (Elegant)</option>
               </select>
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium flex items-center gap-2">
                  Font Size
                  {personal.subscription_status !== 'pro' && <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-widest">Pro</span>}
               </label>
               <select 
                 className={`input-field ${personal.subscription_status !== 'pro' ? 'opacity-50 cursor-not-allowed' : ''}`}
                 value={personal.font_size}
                 onChange={(e) => personal.subscription_status === 'pro' && setPersonal({...personal, font_size: e.target.value})}
                 disabled={personal.subscription_status !== 'pro'}
               >
                 <option value="small">Small</option>
                 <option value="standard">Standard</option>
                 <option value="large">Large</option>
               </select>
            </div>
         </div>
      </section>

      <div className="pb-24 pt-12 flex justify-center border-t border-white/5">
         <button 
           onClick={handleSave} 
           disabled={saving}
           className="btn-primary flex items-center gap-3 px-12 py-4 text-xl shadow-2xl shadow-primary/20"
         >
           {saving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
           Finalize & Save Portfolio
         </button>
      </div>
    </div>
  )
}

function SectionTitle({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <h2 className="text-2xl font-bold font-outfit">{title}</h2>
    </div>
  )
}

function InputWithIcon({ label, icon, value, onChange }: { label: string, icon: React.ReactNode, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>
        <input 
          className="input-field pl-12" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
        />
      </div>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="p-8 text-center text-muted-foreground border-2 border-dashed border-border rounded-2xl">
      <p>{message}</p>
    </div>
  )
}

