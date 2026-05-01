import { Code, Link2, Mail, ExternalLink, FileText, ChevronRight, Sparkles, ArrowRight } from 'lucide-react'

export default function GradientBold({ student, experiences, projects, education, skills }: any) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-purple-500/30 overflow-x-hidden">
      {/* Rich Ambient Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-15%] left-[-5%] w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[600px] h-[600px] bg-pink-600/8 rounded-full blur-[150px]" />
        <div className="absolute top-[50%] left-[50%] w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[120px]" />
        {/* Dot grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>
      
      {/* Floating Glass Nav */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl">
        <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-2xl px-6 py-3 flex justify-between items-center shadow-2xl shadow-purple-500/5">
          <span className="font-black text-lg uppercase italic tracking-tighter bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
            {student.name.split(' ')[0]}
          </span>
          <div className="flex gap-5 text-xs font-black uppercase tracking-widest text-white/30">
            <a href="#work" className="hover:text-white transition-colors duration-300">Work</a>
            <a href="#exp" className="hover:text-white transition-colors duration-300">Experience</a>
            <a href="#skills" className="hover:text-white transition-colors duration-300">Skills</a>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-20 lg:py-32 space-y-36">
        {/* Hero */}
        <section className="space-y-10 min-h-[80vh] flex flex-col justify-center animate-fade-in">
          <div className="inline-flex items-center gap-2 p-1 px-4 w-fit rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">
             <Sparkles size={12} /> Student Portfolio
          </div>
          <h1 className="text-7xl lg:text-[10rem] font-black italic tracking-tighter leading-[0.85] uppercase">
             {student.name.split(' ')[0]} <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500">
                {student.name.split(' ').slice(1).join(' ')}
             </span>
          </h1>
          <div className="flex flex-col md:flex-row gap-8 md:items-center">
             <p className="text-xl md:text-2xl font-bold bg-white/[0.03] p-4 py-2.5 border-l-4 border-purple-500 rounded-r-xl">
                {student.role_title}
             </p>
             <div className="flex gap-3">
                 {student.github_url && <IconButton href={student.github_url} icon={<Code size={18}/>}/>}
                 {student.linkedin_url && <IconButton href={student.linkedin_url} icon={<Link2 size={18}/>}/>}
                {student.email && <IconButton href={`mailto:${student.email}`} icon={<Mail size={18}/>}/>}
             </div>
          </div>
          <p className="text-xl text-zinc-500 max-w-2xl font-medium leading-relaxed">
             {student.summary}
          </p>
        </section>

        {/* Projects Grid */}
        <section id="work" className="space-y-16">
           <SectionHeading title="Selected Works" subtitle="Projects that define me" />
           <div className="grid md:grid-cols-2 gap-4">
              {projects.map((proj: any, i: number) => (
                <div key={i} className="group relative bg-white/[0.02] overflow-hidden border border-white/[0.06] rounded-2xl hover:border-purple-500/30 transition-all duration-700">
                   <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                   <div className="relative p-10 space-y-6">
                      <div className="space-y-2">
                         <h3 className="text-3xl font-black italic uppercase group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-orange-400 transition-all duration-500">{proj.title}</h3>
                         <div className="flex flex-wrap gap-2">
                           {proj.tech.split(',').map((t: string, j: number) => (
                             <span key={j} className="text-[10px] font-bold uppercase tracking-widest text-purple-400/60 bg-purple-400/5 px-3 py-1 rounded-full border border-purple-400/10">{t.trim()}</span>
                           ))}
                         </div>
                      </div>
                      <p className="text-zinc-500 text-sm leading-relaxed">{proj.description}</p>
                      {proj.link && (
                        <a href={proj.link} target="_blank" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40 hover:text-purple-400 transition-all duration-300 group-hover:translate-x-2">
                          EXPLORE <ArrowRight size={14} />
                        </a>
                      )}
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Experience & Skills */}
        <div id="exp" className="grid lg:grid-cols-2 gap-24">
           <section className="space-y-12">
              <SectionHeading title="Experience" subtitle="My professional journey" />
              <div className="space-y-8">
                 {experiences.map((exp: any, i: number) => (
                    <div key={i} className="group space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/20 hover:bg-white/[0.04] transition-all duration-500">
                       <div className="flex justify-between items-center">
                          <h3 className="text-xl font-black uppercase italic group-hover:text-purple-400 transition-colors duration-300">{exp.company}</h3>
                          <span className="text-[10px] font-bold text-zinc-600 font-mono bg-white/5 px-2 py-1 rounded">{exp.duration}</span>
                       </div>
                       <p className="text-purple-400/80 font-bold text-sm uppercase tracking-wide">{exp.role}</p>
                       <p className="text-zinc-500 text-sm leading-relaxed">{exp.description}</p>
                    </div>
                 ))}
              </div>
           </section>

           <section id="skills" className="space-y-12">
              <SectionHeading title="Arsenal" subtitle="Skills and expertise" />
              <div className="grid grid-cols-1 gap-4">
                 {skills.map((skill: any, i: number) => (
                    <div key={i} className="group space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/20 transition-all duration-300">
                       <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                          <span className="group-hover:text-purple-400 transition-colors">{skill.name}</span>
                          <span className="text-zinc-600">{skill.level}%</span>
                       </div>
                       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-orange-500 rounded-full transition-all duration-1000" style={{ width: `${skill.level}%` }} />
                       </div>
                    </div>
                 ))}
              </div>
           </section>
        </div>

        {/* Footer */}
        <footer className="py-32 border-t border-zinc-900 flex flex-col items-center gap-10 relative">
           <div className="absolute inset-0 bg-gradient-to-t from-purple-600/[0.03] to-transparent pointer-events-none" />
           <h2 className="text-5xl md:text-7xl font-black italic uppercase text-center relative z-10 leading-tight">
              READY TO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-orange-500">COLLABORATE?</span>
           </h2>
           <div className="flex gap-4 relative z-10">
              <a href={`mailto:${student.email}`} className="px-10 py-4 bg-white text-black font-black uppercase italic tracking-widest hover:bg-gradient-to-r hover:from-purple-500 hover:to-orange-500 hover:text-white transition-all duration-500 rounded-xl active:scale-95 shadow-xl shadow-white/5">
                 Say Hello
              </a>
              {student.resume_url && (
                <a href={student.resume_url} target="_blank" className="px-10 py-4 border-2 border-white/20 text-white font-black uppercase italic tracking-widest hover:border-purple-500 hover:text-purple-400 transition-all duration-500 rounded-xl active:scale-95">
                   Resume
                </a>
              )}
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700 mt-10 relative z-10">
              © {new Date().getFullYear()} {student.name}
              {(!student.subscription_status || student.subscription_status === 'free') && ' · PORTFOLIA'}
           </p>
        </footer>
      </div>
    </div>
  )
}

function SectionHeading({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div className="space-y-2">
       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-orange-500">{subtitle}</span>
       <h2 className="text-5xl font-black italic uppercase tracking-tighter">{title}</h2>
    </div>
  )
}

function IconButton({ href, icon }: { href: string, icon: React.ReactNode }) {
  return (
    <a href={href} target="_blank" className="w-12 h-12 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/40 hover:bg-gradient-to-br hover:from-purple-500 hover:to-orange-500 hover:text-white hover:border-transparent transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/20 active:scale-90">
       {icon}
    </a>
  )
}
