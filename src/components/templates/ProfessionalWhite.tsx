import { Code, Link2, ExternalLink, FileText, Briefcase, GraduationCap, Wrench, ChevronRight, ArrowUpRight } from 'lucide-react'
import { normalizeUrl } from '@/lib/utils'

export default function ProfessionalWhite({ student, experiences, projects, education, skills, certifications }: any) {
  return (
    <div className="min-h-screen bg-white text-black antialiased selection:bg-black selection:text-white font-outfit">
      {/* Subtle background texture */}
      <div className="fixed inset-0 -z-10 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Floating Nav */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl">
        <div className="backdrop-blur-xl bg-white/80 border border-zinc-200/50 rounded-2xl px-6 py-3 flex justify-between items-center shadow-lg shadow-zinc-900/5">
          <span className="font-bold text-lg tracking-tighter uppercase">{student.name.split(' ')[0]}</span>
          <div className="flex gap-5 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <a href="#about" className="hover:text-black transition-colors duration-300">About</a>
            <a href="#experience" className="hover:text-black transition-colors duration-300">Experience</a>
            <a href="#projects" className="hover:text-black transition-colors duration-300">Projects</a>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-32 space-y-28">
        
        {/* Header */}
        <header className="pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in border-b-2 border-black">
          <div className="space-y-8">
            <div className="space-y-4">
               <h1 className="text-6xl md:text-9xl font-bold tracking-tighter uppercase leading-[0.85] break-words">
                 {student.name}
               </h1>
               <h2 className="text-2xl md:text-4xl font-light text-zinc-400 tracking-wide">
                 {student.role_title}
               </h2>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
              {student.email && (
                <a href={`mailto:${student.email}`} className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-colors px-6 py-3 border border-zinc-200 rounded-xl hover:border-black">{student.email}</a>
              )}
              {student.linkedin_url && (
                <a href={normalizeUrl(student.linkedin_url, 'linkedin')} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-colors px-6 py-3 border border-zinc-200 rounded-xl hover:border-black">LinkedIn</a>
              )}
              {student.github_url && (
                <a href={normalizeUrl(student.github_url, 'github')} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-colors px-6 py-3 border border-zinc-200 rounded-xl hover:border-black">GitHub</a>
              )}
              {student.resume_url && (
                <a href={student.resume_url} target="_blank" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white bg-black hover:bg-zinc-800 transition-colors px-8 py-3 rounded-xl flex items-center gap-2 active:scale-95 shadow-xl shadow-zinc-900/10">
                  <FileText size={14}/> Resume
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Sections */}
        {(student.section_order || ['summary', 'experience', 'projects', 'education', 'skills']).map((section: string) => {
          if (section === 'summary') {
            return (
              <section key="about" id="about-intro" className="animate-slide-up space-y-12 py-12">
                <div className="text-2xl md:text-4xl leading-tight text-zinc-800 font-bold border-l-8 border-black pl-8 py-4 uppercase tracking-tighter">
                  {student.introduction || student.summary}
                </div>
                {student.about_me && (
                   <div className="text-xl md:text-2xl leading-relaxed text-zinc-500 font-light max-w-4xl border-l border-zinc-100 pl-12 italic">
                      {student.about_me}
                   </div>
                )}
              </section>
            )
          }

          if (section === 'experience' && experiences.length > 0) {
            return (
              <section key="experience" id="experience" className="space-y-16 py-12">
                <SectionHeader title="Professional Experience" icon={<Briefcase />} />
                <div className="space-y-0">
                  {experiences.map((exp: any, i: number) => (
                    <div key={i} className="group grid md:grid-cols-[1.2fr_3fr] gap-6 md:gap-16 py-12 border-b-2 border-zinc-50 last:border-0 hover:bg-zinc-50 -mx-10 px-10 rounded-3xl transition-all duration-500">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 group-hover:text-black transition-colors">{exp.duration}</div>
                        <div className="text-2xl font-black mt-4 uppercase italic">{exp.company}</div>
                      </div>
                      <div className="space-y-6">
                        <h3 className="text-3xl font-bold group-hover:text-zinc-600 transition-colors leading-tight">{exp.role}</h3>
                        <p className="text-xl text-zinc-500 leading-relaxed font-light">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          }

          if (section === 'projects' && projects.length > 0) {
            return (
              <section key="projects" id="projects" className="space-y-16 py-12">
                <SectionHeader title="Selected Projects" icon={<Code />} />
                <div className="grid md:grid-cols-2 gap-8">
                  {projects.map((proj: any, i: number) => (
                    <div key={i} className="group border-2 border-zinc-50 p-10 hover:border-black transition-all duration-700 flex flex-col h-full bg-zinc-50/30 hover:bg-white rounded-[2.5rem] hover:shadow-2xl hover:shadow-zinc-900/5 hover:-translate-y-2">
                      <div className="flex justify-between items-start mb-8">
                        <h3 className="text-3xl font-bold group-hover:text-zinc-500 transition-colors leading-tight">{proj.title}</h3>
                        {proj.link && (
                          <a href={proj.link} target="_blank" className="p-3 text-zinc-300 hover:text-black transition-colors rounded-2xl hover:bg-zinc-100 active:scale-90">
                            <ArrowUpRight size={24} />
                          </a>
                        )}
                      </div>
                      <p className="text-xl text-zinc-500 leading-relaxed flex-grow font-light">{proj.description}</p>
                      <div className="mt-10 pt-8 border-t border-zinc-100 flex flex-wrap gap-3">
                        {proj.tech.split(',').map((t: string, j: number) => (
                          <span key={j} className="text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-white px-4 py-2 rounded-xl border border-zinc-100 group-hover:border-black group-hover:text-black transition-all">{t.trim()}</span>
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
              <section key="certifications" className="space-y-16 py-12">
                <SectionHeader title="Professional Certifications" icon={<Code />} />
                <div className="grid md:grid-cols-2 gap-8">
                   {certifications.map((cert: any, i: number) => (
                     <div key={i} className="flex justify-between items-center p-8 border-b-2 border-zinc-50 hover:border-black transition-all group">
                        <div>
                           <h3 className="text-xl font-bold uppercase tracking-tight group-hover:text-zinc-500 transition-colors">{cert.name}</h3>
                           <p className="text-zinc-400 font-bold uppercase text-xs mt-1">{cert.issuer}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">{cert.date}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </section>
            )
          }

          if (section === 'education' && education.length > 0) {
            return (
              <section key="education" className="space-y-12 py-12">
                <SectionHeader title="Education" icon={<GraduationCap />} />
                <div className="grid md:grid-cols-2 gap-10">
                   {education.map((edu: any, i: number) => (
                     <div key={i} className="group space-y-4 py-6 border-l-4 border-zinc-50 pl-10 hover:border-black transition-all duration-500">
                        <h3 className="text-2xl font-bold group-hover:text-zinc-500 transition-colors leading-tight">{edu.degree}</h3>
                        <p className="text-xl text-zinc-600 font-medium">{edu.college}</p>
                        <div className="text-xs font-black uppercase tracking-[0.2em] text-zinc-300 pt-2 group-hover:text-black transition-colors">
                          Class of {edu.year} • CGPA {edu.cgpa}
                        </div>
                     </div>
                   ))}
                </div>
              </section>
            )
          }

          if (section === 'skills' && skills.length > 0) {
            return (
              <section key="skills" className="space-y-12 py-12">
                <SectionHeader title="Core Competencies" icon={<Wrench />} />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {skills.map((skill: any, i: number) => (
                     <div key={i} className="group flex items-center justify-between p-8 rounded-3xl border-2 border-zinc-50 hover:border-black transition-all duration-500 hover:bg-zinc-50">
                        <span className="text-xl font-bold group-hover:tracking-wider transition-all uppercase italic">{skill.name}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-200 group-hover:text-black">{skill.level}%</span>
                     </div>
                   ))}
                </div>
              </section>
            )
          }

          if (section === 'hobbies' && student.hobbies) {
             return (
               <section key="hobbies" className="py-12 border-t-2 border-zinc-100">
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300">Personal Hobbies</h4>
                     <p className="text-4xl font-black uppercase italic leading-relaxed text-zinc-400 hover:text-black transition-colors duration-500">{student.hobbies}</p>
                  </div>
               </section>
             )
          }

          if (section === 'interests' && student.interests) {
             return (
               <section key="interests" className="py-12 border-t-2 border-zinc-100">
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300">Areas of Interest</h4>
                     <p className="text-4xl font-black uppercase italic leading-relaxed text-zinc-400 hover:text-black transition-colors duration-500">{student.interests}</p>
                  </div>
               </section>
             )
          }

          if (section === 'achievements' && student.achievements) {
             return (
               <section key="achievements" className="py-24 border-t-2 border-black">
                  <SectionHeader title="Key Achievements" icon={<Code />} />
                  <p className="text-5xl md:text-8xl font-black italic uppercase leading-[0.85] tracking-tighter text-zinc-200 hover:text-black transition-colors duration-1000 mt-12">
                     &ldquo;{student.achievements}&rdquo;
                  </p>
               </section>
             )
          }

          return null;
        })}



        {/* Footer */}
        <footer className="pt-24 pb-12 border-t-2 border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-10 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
           <span className="text-black text-xl tracking-tighter italic">{student.name} / {new Date().getFullYear()}</span>
           <div className="flex gap-12">
              {student.email && <a href={`mailto:${student.email}`} className="hover:text-black transition-colors border-b-2 border-transparent hover:border-black">Email</a>}
              {student.linkedin_url && <a href={normalizeUrl(student.linkedin_url, 'linkedin')} target="_blank" className="hover:text-black transition-colors border-b-2 border-transparent hover:border-black">LinkedIn</a>}
           </div>
           {(!student.subscription_status || student.subscription_status === 'free') && (
             <span className="italic opacity-30">Authenticated by Portfolia</span>
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
