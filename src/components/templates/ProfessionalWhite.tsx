import { Code, Link2, ExternalLink, FileText, Briefcase, GraduationCap, Wrench, ChevronRight, ArrowUpRight } from 'lucide-react'
import { normalizeUrl } from '@/lib/utils'

export default function ProfessionalWhite({ student, experiences, projects, education, skills }: any) {
  return (
    <div className="min-h-screen bg-white text-black antialiased selection:bg-black selection:text-white">
      {/* Subtle background texture */}
      <div className="fixed inset-0 -z-10 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Floating Nav */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl">
        <div className="backdrop-blur-xl bg-white/80 border border-zinc-200/50 rounded-2xl px-6 py-3 flex justify-between items-center shadow-lg shadow-zinc-900/5">
          <span className="font-bold text-lg tracking-tighter uppercase">{student.name.split(' ')[0]}</span>
          <div className="flex gap-5 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <a href="#summary" className="hover:text-black transition-colors duration-300">About</a>
            <a href="#experience" className="hover:text-black transition-colors duration-300">Experience</a>
            <a href="#projects" className="hover:text-black transition-colors duration-300">Projects</a>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-32 space-y-28">
        
        {/* Header */}
        <header className="pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in border-b-2 border-black">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase leading-[0.9]">
              {student.name}
            </h1>
            <h2 className="text-2xl md:text-3xl font-light text-zinc-500 tracking-wide">
              {student.role_title}
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
              {student.email && (
                <a href={`mailto:${student.email}`} className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors px-4 py-2 border border-zinc-200 rounded-lg hover:border-black">{student.email}</a>
              )}
              {student.linkedin_url && (
                <a href={normalizeUrl(student.linkedin_url, 'linkedin')} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors px-4 py-2 border border-zinc-200 rounded-lg hover:border-black">LinkedIn</a>
              )}
              {student.github_url && (
                <a href={normalizeUrl(student.github_url, 'github')} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors px-4 py-2 border border-zinc-200 rounded-lg hover:border-black">GitHub</a>
              )}
              {student.resume_url && (
                <a href={student.resume_url} target="_blank" className="text-xs font-bold uppercase tracking-widest text-white bg-black hover:bg-zinc-800 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 active:scale-95">
                  <FileText size={12}/> Resume
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Summary */}
        <section id="summary" className="animate-slide-up">
          <div className="text-xl md:text-2xl leading-[1.8] text-zinc-600 font-light border-l-4 border-black pl-8 py-4">
            {student.summary}
          </div>
        </section>

        {/* Professional Experience */}
        <section id="experience" className="space-y-16">
          <SectionHeader title="Professional Experience" icon={<Briefcase />} />
          <div className="space-y-0">
            {experiences.map((exp: any, i: number) => (
              <div key={i} className="group grid md:grid-cols-[1fr_3fr] gap-4 md:gap-12 py-10 border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 -mx-6 px-6 rounded-xl transition-all duration-300">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-black transition-colors">{exp.duration}</div>
                  <div className="text-lg font-bold mt-1">{exp.company}</div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">{exp.role}</h3>
                  <p className="text-lg text-zinc-600 leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Selected Projects */}
        <section id="projects" className="space-y-16">
          <SectionHeader title="Selected Projects" icon={<Code />} />
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((proj: any, i: number) => (
              <div key={i} className="group border border-zinc-200 p-8 hover:border-black transition-all duration-500 flex flex-col h-full bg-zinc-50/50 hover:bg-white rounded-2xl hover:shadow-xl hover:shadow-zinc-100 hover:-translate-y-1">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold group-hover:text-zinc-600 transition-colors">{proj.title}</h3>
                  {proj.link && (
                    <a href={proj.link} target="_blank" className="p-2 text-zinc-300 hover:text-black transition-colors rounded-lg hover:bg-zinc-100">
                      <ArrowUpRight size={18} />
                    </a>
                  )}
                </div>
                <p className="text-lg text-zinc-500 leading-relaxed flex-grow">{proj.description}</p>
                <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-wrap gap-2">
                  {proj.tech.split(',').map((t: string, j: number) => (
                    <span key={j} className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-white px-3 py-1 rounded-lg border border-zinc-200">{t.trim()}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education & Skills */}
        <div className="grid md:grid-cols-2 gap-16 border-t-2 border-black pt-16">
          <section className="space-y-10">
            <SectionHeader title="Education" icon={<GraduationCap />} />
            <div className="space-y-8">
               {education.map((edu: any, i: number) => (
                 <div key={i} className="group space-y-2 p-6 rounded-xl border border-zinc-100 hover:border-zinc-300 transition-all duration-300 hover:shadow-md">
                    <h3 className="text-xl font-bold group-hover:text-zinc-500 transition-colors">{edu.degree}</h3>
                    <p className="text-lg text-zinc-600">{edu.college}</p>
                    <div className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                      Class of {edu.year} • CGPA: {edu.cgpa}
                    </div>
                 </div>
               ))}
            </div>
          </section>

          <section className="space-y-10">
            <SectionHeader title="Core Competencies" icon={<Wrench />} />
            <div className="grid grid-cols-1 gap-3">
               {skills.map((skill: any, i: number) => (
                 <div key={i} className="group flex items-center gap-4 p-4 rounded-xl border border-zinc-100 hover:border-black transition-all duration-300 hover:bg-zinc-50">
                    <ChevronRight size={16} className="text-zinc-300 group-hover:text-black transition-colors" />
                    <span className="text-lg group-hover:font-bold transition-all">{skill.name}</span>
                 </div>
               ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="pt-16 pb-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-300">
           <span>© {new Date().getFullYear()} {student.name}</span>
           {(!student.subscription_status || student.subscription_status === 'free') && (
             <span>Powered by Portfolia</span>
           )}
        </footer>
      </div>
    </div>
  )
}

function SectionHeader({ title, icon }: { title: string, icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-2.5 bg-black text-white rounded-xl">{icon}</div>
      <h2 className="text-3xl font-bold uppercase tracking-wide">{title}</h2>
      <div className="h-px bg-zinc-200 flex-1" />
    </div>
  )
}
