import { Code, Link2, Mail, ExternalLink, Download, FileText, ChevronRight } from 'lucide-react'

export default function GradientBold({ student, experiences, projects, education, skills }: any) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-purple-500/30 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_20%_20%,_#4c1d95_0%,_transparent_50%),radial-gradient(circle_at_80%_80%,_#701a75_0%,_transparent_50%)] opacity-30" />
      
      <div className="max-w-5xl mx-auto px-6 py-20 lg:py-32 space-y-32">
        {/* Hero */}
        <section className="space-y-10">
          <div className="p-1 px-3 w-fit rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-purple-400">
             Student Portfolio
          </div>
          <h1 className="text-7xl lg:text-9xl font-black italic tracking-tighter leading-none uppercase">
             {student.name.split(' ')[0]} <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500">
                {student.name.split(' ').slice(1).join(' ')}
             </span>
          </h1>
          <div className="flex flex-col md:flex-row gap-8 md:items-center">
             <p className="text-xl md:text-2xl font-bold bg-white/5 p-4 py-2 border-l-4 border-purple-500">
                {student.role_title}
             </p>
             <div className="flex gap-4">
                 {student.github_url && <IconButton href={student.github_url} icon={<Code size={20}/>}/>}
                 {student.linkedin_url && <IconButton href={student.linkedin_url} icon={<Link2 size={20}/>}/>}
                {student.email && <IconButton href={`mailto:${student.email}`} icon={<Mail size={20}/>}/>}
             </div>
          </div>
          <p className="text-xl text-zinc-400 max-w-2xl font-medium leading-relaxed">
             {student.summary}
          </p>
        </section>

        {/* Projects Grid */}
        <section className="space-y-12">
           <SectionHeading title="Selected Works" subtitle="Projects that define me" />
           <div className="grid md:grid-cols-2 gap-4">
              {projects.map((proj: any, i: number) => (
                <div key={i} className="group relative bg-zinc-900 overflow-hidden border border-zinc-800">
                   <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                   <div className="relative p-10 space-y-6">
                      <div className="space-y-2">
                         <h3 className="text-3xl font-black italic uppercase group-hover:scale-105 transition-transform duration-500 origin-left">{proj.title}</h3>
                         <p className="text-zinc-500 font-medium">{proj.tech}</p>
                      </div>
                      <p className="text-zinc-400 text-sm leading-relaxed">{proj.description}</p>
                      {proj.link && (
                        <a href={proj.link} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-purple-400 transition-colors">
                          EXPLORE <ChevronRight size={14} />
                        </a>
                      )}
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Exp & Skills */}
        <div className="grid lg:grid-cols-2 gap-20">
           <section className="space-y-12">
              <SectionHeading title="Experience" subtitle="My professional journey" />
              <div className="space-y-10">
                 {experiences.map((exp: any, i: number) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between items-end border-b border-zinc-800 pb-2">
                          <h3 className="text-2xl font-black uppercase italic">{exp.company}</h3>
                          <span className="text-[10px] font-bold text-zinc-500">{exp.duration}</span>
                       </div>
                       <p className="text-purple-400 font-bold text-sm uppercase">{exp.role}</p>
                       <p className="text-zinc-500 text-sm">{exp.description}</p>
                    </div>
                 ))}
              </div>
           </section>

           <section className="space-y-12">
              <SectionHeading title="Arsenal" subtitle="Skills and expertise" />
              <div className="grid grid-cols-1 gap-4">
                 {skills.map((skill: any, i: number) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                          <span>{skill.name}</span>
                          <span className="text-zinc-500">{skill.level}%</span>
                       </div>
                       <div className="h-[2px] w-full bg-zinc-900 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-orange-500" style={{ width: `${skill.level}%` }} />
                       </div>
                    </div>
                 ))}
              </div>
           </section>
        </div>

        {/* Footer */}
        <footer className="py-32 border-t border-zinc-900 flex flex-col items-center gap-10">
           <h2 className="text-5xl md:text-7xl font-black italic uppercase text-center">
              READY TO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-orange-500 underline decoration-white">COLLABORATE?</span>
           </h2>
           <div className="flex gap-4">
              <a href={`mailto:${student.email}`} className="px-10 py-4 bg-white text-black font-black uppercase italic tracking-widest hover:bg-purple-500 hover:text-white transition-all transform hover:-rotate-3">
                 Say Hello
              </a>
              {student.resume_url && (
                <a href={student.resume_url} className="px-10 py-4 border-2 border-white text-white font-black uppercase italic tracking-widest hover:border-purple-500 hover:text-purple-500 transition-all transform hover:rotate-3">
                   Resume
                </a>
              )}
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700 mt-10">
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
       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">{subtitle}</span>
       <h2 className="text-5xl font-black italic uppercase italic tracking-tighter">{title}</h2>
    </div>
  )
}

function IconButton({ href, icon }: { href: string, icon: React.ReactNode }) {
  return (
    <a href={href} target="_blank" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
       {icon}
    </a>
  )
}
