import { Code, Link2, Mail, ExternalLink, FileText, ArrowUpRight } from 'lucide-react'

export default function MinimalClean({ student, experiences, projects, education, skills }: any) {
  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-zinc-200 antialiased">
      {/* Floating Nav */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl">
        <div className="backdrop-blur-xl bg-white/70 border border-zinc-200/60 rounded-2xl px-6 py-3 flex justify-between items-center shadow-lg shadow-zinc-900/5">
          <span className="font-bold text-lg tracking-tighter text-zinc-900">{student.name.split(' ')[0]}</span>
          <div className="flex gap-5 text-sm font-medium text-zinc-400">
            <a href="#about" className="hover:text-zinc-900 transition-colors duration-300">About</a>
            <a href="#work" className="hover:text-zinc-900 transition-colors duration-300">Work</a>
            <a href="#projects" className="hover:text-zinc-900 transition-colors duration-300">Projects</a>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-32 space-y-28">
        {/* Header */}
        <header id="about" className="space-y-8 animate-fade-in">
          <div className="flex items-center gap-6">
            {student.profile_pic_url && (
              <img src={student.profile_pic_url} alt={student.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-zinc-100 shadow-md" />
            )}
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900">{student.name}</h1>
              <p className="text-lg text-zinc-400 mt-1">{student.role_title}</p>
            </div>
          </div>
          
          <div className="flex gap-3 items-center flex-wrap">
            {student.github_url && <SocialPill href={student.github_url} label="GitHub" />}
            {student.linkedin_url && <SocialPill href={student.linkedin_url} label="LinkedIn" />}
            {student.email && <SocialPill href={`mailto:${student.email}`} label="Email" />}
            {student.resume_url && (
              <a href={student.resume_url} target="_blank" className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-zinc-900 px-5 py-2 rounded-full hover:bg-zinc-700 transition-colors shadow-md shadow-zinc-900/10">
                <FileText size={14} /> Resume
              </a>
            )}
          </div>
        </header>

        {/* About */}
        <section className="space-y-4 animate-slide-up">
          <SectionLabel text="About" />
          <p className="text-lg leading-[1.8] text-zinc-500">
            {student.summary}
          </p>
        </section>

        {/* Experience */}
        <section id="work" className="space-y-8">
          <SectionLabel text="Experience" />
          <div className="space-y-0">
            {experiences.map((exp: any, i: number) => (
              <div key={i} className="group flex flex-col md:flex-row md:items-start gap-2 md:gap-8 py-6 border-b border-zinc-100 last:border-0 hover:bg-white hover:px-4 rounded-xl transition-all duration-300 -mx-4 px-4">
                <span className="text-sm text-zinc-300 min-w-[120px] pt-1 font-mono">{exp.duration}</span>
                <div className="space-y-2 flex-1">
                  <h3 className="font-bold text-zinc-900 group-hover:text-zinc-600 transition-colors">{exp.role} <span className="text-zinc-300 font-normal">· {exp.company}</span></h3>
                  <p className="text-zinc-400 leading-relaxed text-sm">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="space-y-8">
          <SectionLabel text="Projects" />
          <div className="grid gap-4">
            {projects.map((proj: any, i: number) => (
              <div key={i} className="group p-6 rounded-2xl bg-white border border-zinc-100 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-100 transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-zinc-900 text-lg group-hover:text-zinc-600 transition-colors">{proj.title}</h3>
                  {proj.link && (
                    <a href={proj.link} target="_blank" className="p-2 rounded-full bg-zinc-50 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all duration-300">
                      <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">{proj.description}</p>
                <div className="flex flex-wrap gap-2">
                  {proj.tech.split(',').map((t: string, j: number) => (
                    <span key={j} className="text-[11px] font-medium text-zinc-400 bg-zinc-50 px-3 py-1 rounded-full border border-zinc-100">{t.trim()}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education & Skills */}
        <div className="grid md:grid-cols-2 gap-20">
          <section className="space-y-6">
            <SectionLabel text="Education" />
            <div className="space-y-6">
               {education.map((edu: any, i: number) => (
                 <div key={i} className="space-y-1 group">
                    <h3 className="font-bold text-zinc-900 text-sm group-hover:text-zinc-500 transition-colors">{edu.college}</h3>
                    <p className="text-zinc-500 text-sm">{edu.degree}</p>
                    <p className="text-zinc-300 text-xs font-mono">{edu.year} · {edu.cgpa}</p>
                 </div>
               ))}
            </div>
          </section>

          <section className="space-y-6">
            <SectionLabel text="Skills" />
            <div className="flex flex-wrap gap-2">
               {skills.map((skill: any, i: number) => (
                 <span key={i} className="px-4 py-2 bg-white border border-zinc-100 rounded-xl text-sm font-medium text-zinc-600 hover:border-zinc-300 hover:shadow-sm transition-all duration-300">
                   {skill.name}
                 </span>
               ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="pt-16 pb-8 border-t border-zinc-100 flex justify-between items-center text-xs text-zinc-300">
           <span className="font-mono">{student.name} / {new Date().getFullYear()}</span>
           {(!student.subscription_status || student.subscription_status === 'free') && (
             <span className="italic">Built with Portfolia</span>
           )}
        </footer>
      </div>
    </div>
  )
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-300">{text}</h2>
      <div className="h-px bg-zinc-100 flex-1" />
    </div>
  )
}

function SocialPill({ href, label }: { href: string, label: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      className="px-5 py-2 rounded-full bg-white border border-zinc-100 text-sm font-medium text-zinc-500 hover:border-zinc-300 hover:text-zinc-900 hover:shadow-md hover:shadow-zinc-100 transition-all duration-300"
    >
      {label}
    </a>
  )
}
