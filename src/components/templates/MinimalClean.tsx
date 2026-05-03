import { Code, Link2, Mail, ExternalLink, FileText, ArrowUpRight } from 'lucide-react'
import { normalizeUrl } from '@/lib/utils'

export default function MinimalClean({ student, experiences, projects, education, skills, certifications }: any) {
  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-zinc-200 antialiased font-outfit">
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
              <img src={student.profile_pic_url} alt={student.name} className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-xl" />
            )}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">{student.name}</h1>
              <p className="text-xl text-zinc-400 mt-2 font-medium">{student.role_title}</p>
            </div>
          </div>
          
          <div className="flex gap-3 items-center flex-wrap pt-2">
            {student.github_url && <SocialPill href={normalizeUrl(student.github_url, 'github')} label="GitHub" />}
            {student.linkedin_url && <SocialPill href={normalizeUrl(student.linkedin_url, 'linkedin')} label="LinkedIn" />}
            {student.email && <SocialPill href={`mailto:${student.email}`} label="Email" />}
            {student.resume_url && (
              <a href={student.resume_url} target="_blank" className="inline-flex items-center gap-2 text-sm font-bold text-white bg-zinc-900 px-6 py-2.5 rounded-full hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10 active:scale-95">
                <FileText size={14} /> Resume
              </a>
            )}
          </div>
        </header>

        {/* Dynamic Sections */}
        {(student.section_order || ['summary', 'experience', 'projects', 'education', 'skills']).map((section: string) => {
          if (section === 'summary') {
            return (
              <section key="about" id="about-intro" className="space-y-6 animate-slide-up">
                <SectionLabel text="About" />
                <div className="space-y-6">
                   <p className="text-2xl font-bold text-zinc-800 leading-snug">
                     {student.introduction || student.summary}
                   </p>
                   {student.about_me && (
                     <p className="text-lg leading-[1.8] text-zinc-500 border-l-2 border-zinc-100 pl-8 py-2 italic">
                       {student.about_me}
                     </p>
                   )}
                </div>
              </section>
            )
          }

          if (section === 'experience' && experiences.length > 0) {
            return (
              <section key="work" id="work" className="space-y-12">
                <SectionLabel text="Experience" />
                <div className="space-y-4">
                  {experiences.map((exp: any, i: number) => (
                    <div key={i} className="group flex flex-col md:flex-row md:items-start gap-2 md:gap-8 py-8 border-b border-zinc-100 last:border-0 hover:bg-white hover:px-8 rounded-3xl transition-all duration-500 -mx-8 px-8">
                      <span className="text-xs text-zinc-300 min-w-[120px] pt-1.5 font-mono uppercase tracking-widest">{exp.duration}</span>
                      <div className="space-y-3 flex-1">
                        <h3 className="text-xl font-bold text-zinc-900 group-hover:text-zinc-600 transition-colors">{exp.role} <span className="text-zinc-300 font-normal ml-2">· {exp.company}</span></h3>
                        <p className="text-zinc-500 leading-relaxed text-base">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          }

          if (section === 'projects' && projects.length > 0) {
            return (
              <section key="projects" id="projects" className="space-y-12">
                <SectionLabel text="Projects" />
                <div className="grid gap-6">
                  {projects.map((proj: any, i: number) => (
                    <div key={i} className="group p-8 rounded-[2rem] bg-white border border-zinc-100 hover:border-zinc-300 hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500 hover:-translate-y-1">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-zinc-900 text-2xl group-hover:text-zinc-600 transition-colors">{proj.title}</h3>
                        {proj.link && (
                          <a href={proj.link} target="_blank" className="p-3 rounded-full bg-zinc-50 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all duration-300 shadow-sm">
                            <ArrowUpRight size={18} />
                          </a>
                        )}
                      </div>
                      <p className="text-zinc-500 text-lg leading-relaxed mb-6">{proj.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {proj.tech.split(',').map((t: string, j: number) => (
                          <span key={j} className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 px-4 py-1.5 rounded-full border border-zinc-100">{t.trim()}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          }

          if (section === 'certifications' && certifications?.length > 0) {
            return (
              <section key="certifications" className="space-y-12">
                 <SectionLabel text="Certifications" />
                 <div className="grid md:grid-cols-2 gap-6">
                    {certifications.map((cert: any, i: number) => (
                      <div key={i} className="p-6 rounded-2xl bg-white border border-zinc-100 space-y-2 hover:shadow-lg transition-all">
                         <h3 className="font-bold text-zinc-900">{cert.name}</h3>
                         <p className="text-sm text-zinc-400">{cert.issuer}</p>
                         <p className="text-[10px] font-mono text-zinc-300 pt-2">{cert.date}</p>
                      </div>
                    ))}
                 </div>
              </section>
            )
          }

          if (section === 'education' && education.length > 0) {
            return (
              <section key="education" className="space-y-8">
                <SectionLabel text="Education" />
                <div className="grid md:grid-cols-2 gap-8">
                   {education.map((edu: any, i: number) => (
                     <div key={i} className="space-y-2 group">
                        <h3 className="font-bold text-zinc-900 text-lg group-hover:text-zinc-500 transition-colors leading-tight">{edu.college}</h3>
                        <p className="text-zinc-500 font-medium">{edu.degree}</p>
                        <p className="text-zinc-300 text-sm font-mono">{edu.year} · {edu.cgpa}</p>
                     </div>
                   ))}
                </div>
              </section>
            )
          }

          if (section === 'skills' && skills.length > 0) {
            return (
              <section key="skills" className="space-y-8">
                <SectionLabel text="Skills" />
                <div className="flex flex-wrap gap-3">
                   {skills.map((skill: any, i: number) => (
                     <span key={i} className="px-5 py-3 bg-white border border-zinc-100 rounded-2xl text-sm font-bold text-zinc-600 hover:border-zinc-300 hover:shadow-md transition-all duration-300">
                       {skill.name}
                     </span>
                   ))}
                </div>
              </section>
            )
          }

          if (section === 'hobbies' && student.hobbies) {
            return (
              <section key="hobbies" className="space-y-6">
                 <SectionLabel text="Hobbies" />
                 <p className="text-2xl font-bold text-zinc-400 leading-snug">{student.hobbies}</p>
              </section>
            )
          }

          if (section === 'interests' && student.interests) {
            return (
              <section key="interests" className="space-y-6">
                 <SectionLabel text="Interests" />
                 <p className="text-2xl font-bold text-zinc-400 leading-snug">{student.interests}</p>
              </section>
            )
          }

          if (section === 'achievements' && student.achievements) {
            return (
              <section key="achievements" className="space-y-6">
                 <SectionLabel text="Achievements" />
                 <div className="p-10 rounded-[2.5rem] bg-zinc-50 border border-zinc-100 text-2xl font-bold italic text-zinc-800">
                    &ldquo;{student.achievements}&rdquo;
                 </div>
              </section>
            )
          }

          return null;
        })}



        {/* Footer */}
        <footer className="pt-24 pb-8 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-zinc-300">
           <span className="font-mono font-bold text-zinc-900">{student.name} / {new Date().getFullYear()}</span>
           <div className="flex gap-8">
              {student.email && <a href={`mailto:${student.email}`} className="hover:text-zinc-900 transition-colors">Email</a>}
              {student.linkedin_url && <a href={normalizeUrl(student.linkedin_url, 'linkedin')} target="_blank" className="hover:text-zinc-900 transition-colors">LinkedIn</a>}
           </div>
           {(!student.subscription_status || student.subscription_status === 'free') && (
             <span className="italic opacity-40">Built with Portfolia</span>
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
