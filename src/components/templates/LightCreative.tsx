import { Code, Link2, ExternalLink, FileText, ChevronRight, Sun, Palette } from 'lucide-react'

export default function LightCreative({ student, experiences, projects, education, skills, certifications }: any) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 antialiased selection:bg-primary/20 font-outfit">
      {/* Ambient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-primary/[0.06] rounded-full blur-[120px]" />
        <div className="absolute top-40 -right-20 w-[400px] h-[400px] bg-blue-400/[0.06] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[300px] bg-violet-400/[0.04] rounded-full blur-[120px]" />
      </div>

      {/* Floating Glass Nav */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl">
        <div className="backdrop-blur-xl bg-white/70 border border-slate-200/60 rounded-2xl px-6 py-3 flex justify-between items-center shadow-xl shadow-slate-900/5">
          <span className="font-bold text-lg tracking-tight text-slate-900 flex items-center gap-2">
            <Sun size={18} className="text-primary" />
            {student.name.split(' ')[0]}
          </span>
          <div className="flex gap-5 text-sm font-medium text-slate-400">
            <a href="#about" className="hover:text-slate-900 transition-colors duration-300">About</a>
            <a href="#experience" className="hover:text-slate-900 transition-colors duration-300">Experience</a>
            <a href="#projects" className="hover:text-slate-900 transition-colors duration-300">Projects</a>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-20 space-y-32">

        {/* Hero Section */}
        <header id="about" className="pt-20 relative animate-fade-in">
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              {student.profile_pic_url && (
                <img src={student.profile_pic_url} alt={student.name} className="w-24 h-24 rounded-3xl object-cover shadow-2xl shadow-primary/20 border-4 border-white ring-8 ring-primary/5 rotate-3" />
              )}
              <div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900">
                  {student.name}
                </h1>
                <h2 className="text-2xl text-primary font-semibold flex items-center gap-2 mt-2">
                  <span className="w-12 h-1 bg-primary rounded-full"></span>
                  {student.role_title}
                </h2>
              </div>
            </div>
            <div className="space-y-6">
               <p className="text-2xl font-bold text-slate-800 leading-snug">
                 {student.introduction || student.summary}
               </p>
               {student.about_me && (
                 <p className="text-lg text-slate-500 max-w-3xl leading-relaxed border-l-4 border-primary/10 pl-8 py-2">
                   {student.about_me}
                 </p>
               )}
            </div>

            <div className="flex gap-3 flex-wrap pt-4">
              {student.github_url && <SocialLink href={student.github_url} label="GitHub" />}
              {student.linkedin_url && <SocialLink href={student.linkedin_url} label="LinkedIn" />}
              {student.email && <SocialLink href={`mailto:${student.email}`} label="Email" />}
              {student.resume_url && (
                <a href={student.resume_url} target="_blank" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/20 text-sm active:scale-95">
                  <FileText size={14} /> View Resume
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Sections */}
        {(student.section_order || ['summary', 'experience', 'projects', 'education', 'skills']).map((section: string) => {
          if (section === 'summary') {
            return (
              <section key="about" id="about-intro" className="space-y-12 animate-fade-in py-12">
                <SectionTitle title="The Story" />
                <div className="space-y-8">
                   <p className="text-3xl font-bold text-slate-800 leading-snug">
                     {student.introduction || student.summary}
                   </p>
                   {student.about_me && (
                     <div className="p-10 rounded-[2.5rem] bg-white shadow-xl shadow-slate-900/[0.02] border border-slate-100 text-slate-500 text-xl leading-relaxed italic border-l-[12px] border-primary/20">
                        {student.about_me}
                     </div>
                   )}
                </div>
              </section>
            )
          }

          if (section === 'experience' && experiences.length > 0) {
            return (
              <section key="experience" id="experience" className="space-y-12 py-12">
                <SectionTitle title="Experience" />
                <div className="grid gap-6">
                  {experiences.map((exp: any, i: number) => (
                    <div key={i} className="group bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-500">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors duration-300">{exp.role}</h3>
                          <p className="text-primary font-bold text-lg mt-1">{exp.company}</p>
                        </div>
                        <span className="text-xs font-bold text-primary bg-primary/5 px-6 py-2 rounded-full border border-primary/10 whitespace-nowrap uppercase tracking-widest">{exp.duration}</span>
                      </div>
                      <p className="text-slate-500 leading-relaxed text-lg">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )
          }

          if (section === 'projects' && projects.length > 0) {
            return (
              <section key="projects" id="projects" className="space-y-12 py-12">
                <SectionTitle title="Featured Work" />
                <div className="grid md:grid-cols-2 gap-6">
                  {projects.map((proj: any, i: number) => (
                    <div key={i} className="group bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col h-full hover:-translate-y-2">
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors duration-300 leading-tight">{proj.title}</h3>
                        {proj.link && (
                          <a href={proj.link} target="_blank" className="p-3.5 bg-slate-50 text-slate-400 rounded-2xl hover:bg-primary hover:text-white transition-all duration-300 shadow-sm active:scale-90">
                            <ExternalLink size={18} />
                          </a>
                        )}
                      </div>
                      <p className="text-slate-500 leading-relaxed text-lg flex-grow">{proj.description}</p>
                      <div className="mt-8 flex flex-wrap gap-2">
                        {proj.tech.split(',').map((t: string, j: number) => (
                          <span key={j} className="text-[10px] font-bold uppercase tracking-widest bg-slate-50 text-slate-400 px-4 py-1.5 rounded-full border border-slate-100 group-hover:border-primary/20 group-hover:text-primary/70 transition-colors">
                            {t.trim()}
                          </span>
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
              <section key="certifications" className="space-y-12 py-12">
                <SectionTitle title="Certifications" />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certifications.map((cert: any, i: number) => (
                    <div key={i} className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-lg transition-all group">
                       <h3 className="font-bold text-lg text-slate-800 group-hover:text-primary transition-colors">{cert.name}</h3>
                       <p className="text-slate-500 mt-2 font-medium">{cert.issuer}</p>
                       <div className="mt-6 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{cert.date}</span>
                          {cert.link && (
                            <a href={cert.link} target="_blank" className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">VERIFY</a>
                          )}
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
                <SectionTitle title="Education" />
                <div className="grid md:grid-cols-2 gap-8">
                   {education.map((edu: any, i: number) => (
                     <div key={i} className="relative pl-8 border-l-4 border-primary/5 hover:border-primary transition-all duration-500 group py-4">
                       <div className="absolute w-4 h-4 bg-white border-4 border-primary/20 rounded-full -left-[10px] top-1/2 -translate-y-1/2 group-hover:border-primary group-hover:scale-125 transition-all duration-500 shadow-sm"></div>
                       <h3 className="text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight">{edu.degree}</h3>
                       <p className="text-primary font-bold mt-1 uppercase text-xs tracking-wider">{edu.college}</p>
                       <p className="text-slate-400 text-sm mt-3 font-medium">Class of {edu.year} • GPA {edu.cgpa}</p>
                     </div>
                   ))}
                </div>
              </section>
            )
          }

          if (section === 'skills' && skills.length > 0) {
            return (
              <section key="skills" className="space-y-12 py-12">
                <SectionTitle title="The Arsenal" />
                <div className="flex flex-wrap gap-4">
                  {skills.map((skill: any, i: number) => (
                    <div key={i} className="px-8 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 flex items-center gap-6 group">
                       <span className="font-bold text-slate-700 group-hover:text-primary transition-colors">{skill.name}</span>
                       <span className="text-[10px] font-black text-slate-200 group-hover:text-primary/40 uppercase tracking-widest">{skill.level}%</span>
                    </div>
                  ))}
                </div>
              </section>
            )
          }

          if (section === 'hobbies' && student.hobbies) {
             return (
               <section key="hobbies" className="py-12">
                  <SectionTitle title="Beyond the screen" />
                  <p className="text-3xl font-bold text-slate-400 italic leading-snug">{student.hobbies}</p>
               </section>
             )
          }

          if (section === 'interests' && student.interests) {
             return (
               <section key="interests" className="py-12">
                  <SectionTitle title="Exploration" />
                  <p className="text-3xl font-bold text-slate-400 italic leading-snug">{student.interests}</p>
               </section>
             )
          }

          if (section === 'achievements' && student.achievements) {
             return (
               <section key="achievements" className="py-20">
                  <SectionTitle title="Hall of Fame" />
                  <div className="p-16 rounded-[3rem] bg-white shadow-2xl shadow-slate-900/[0.02] border border-slate-100 text-center relative overflow-hidden group">
                     <div className="absolute top-0 left-0 w-24 h-24 bg-primary/[0.03] rounded-br-[100%] transition-all duration-700 group-hover:w-full group-hover:h-full" />
                     <p className="text-4xl md:text-5xl font-bold italic tracking-tight leading-tight text-slate-800 relative z-10">
                        &ldquo;{student.achievements}&rdquo;
                     </p>
                  </div>
               </section>
             )
          }

          return null;
        })}



        {/* Footer */}
        <footer className="pt-24 pb-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-slate-400">
          <p className="font-bold text-slate-900 tracking-tight text-lg italic uppercase">{student.name} / {new Date().getFullYear()}</p>
          <div className="flex gap-10 font-bold uppercase tracking-widest text-[10px]">
             {student.email && <a href={`mailto:${student.email}`} className="hover:text-primary transition-colors">Contact</a>}
             {student.linkedin_url && <a href={student.linkedin_url} target="_blank" className="hover:text-primary transition-colors">LinkedIn</a>}
          </div>
          {(!student.subscription_status || student.subscription_status === 'free') && (
            <p className="flex items-center gap-2 font-bold bg-white px-6 py-2.5 rounded-full border border-slate-100 shadow-sm text-[10px] uppercase tracking-[0.2em]">
              Made with <span className="text-primary tracking-tight">Portfolia</span>
            </p>
          )}
        </footer>
      </div>
    </div>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
      <div className="h-px bg-gradient-to-r from-slate-200 to-transparent flex-1"></div>
    </div>
  )
}

function SocialLink({ href, label }: { href: string, label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      className="px-6 py-2.5 rounded-xl bg-white border border-slate-100 text-slate-600 font-semibold hover:border-primary/30 hover:text-primary transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/5 text-sm active:scale-95"
    >
      {label}
    </a>
  )
}
