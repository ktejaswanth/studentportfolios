import { Code, Link2, Mail, ExternalLink, Download, Phone, MapPin, ArrowDown } from 'lucide-react'

type PortfolioProps = {
  student: any;
  experiences: any[];
  projects: any[];
  education: any[];
  skills: any[];
}

export default function ModernDark({ student, experiences, projects, education, skills }: PortfolioProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 overflow-x-hidden">
      {/* Ambient Background Orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/8 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/6 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Floating Glass Navbar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl">
        <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-2xl px-6 py-3 flex justify-between items-center shadow-2xl shadow-black/20">
          <span className="font-bold text-lg tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            {student.name.split(' ').map((n:string)=>n[0]).join('')}
          </span>
          <div className="flex gap-6 text-sm font-medium text-white/50">
            <a href="#about" className="hover:text-white transition-colors duration-300">About</a>
            <a href="#experience" className="hover:text-white transition-colors duration-300">Experience</a>
            <a href="#projects" className="hover:text-white transition-colors duration-300">Projects</a>
            <a href="#skills" className="hover:text-white transition-colors duration-300">Skills</a>
            {student.resume_url && (
              <a href={student.resume_url} target="_blank" className="text-primary hover:text-primary/80 transition-colors duration-300">Resume</a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="about" className="pt-40 pb-24 px-8 max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center min-h-screen">
        <div className="flex-1 space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary tracking-wide">
            <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            AVAILABLE FOR OPPORTUNITIES
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.9]">
             I&apos;m <br/>
             <span className="bg-gradient-to-r from-primary via-red-400 to-orange-400 bg-clip-text text-transparent">{student.name}</span>
          </h1>
          <p className="text-2xl text-white/40 font-medium">
             {student.role_title}
          </p>
          <p className="text-lg text-white/30 max-w-xl leading-relaxed">
             {student.summary}
          </p>
          
          <div className="flex items-center gap-4 pt-4">
            {student.github_url && (
              <a href={student.github_url} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <Code size={20} />
              </a>
            )}
            {student.linkedin_url && (
              <a href={student.linkedin_url} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <Link2 size={20} />
              </a>
            )}
            {student.email && (
              <a href={`mailto:${student.email}`} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <Mail size={20} />
              </a>
            )}
            {student.phone && (
              <a href={`tel:${student.phone}`} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <Phone size={20} />
              </a>
            )}
          </div>
        </div>

        {student.profile_pic_url && (
          <div className="w-64 h-64 md:w-80 md:h-80 relative flex-shrink-0 animate-slide-up">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-500/20 blur-[80px] rounded-full scale-110" />
             <div className="absolute inset-0 border-2 border-white/5 rounded-3xl rotate-6 scale-105" />
             <img 
               src={student.profile_pic_url} 
               alt={student.name} 
               className="w-full h-full object-cover rounded-3xl border border-white/10 relative z-10 hover:scale-[1.03] transition-transform duration-700 shadow-2xl shadow-primary/10"
             />
          </div>
        )}
      </section>

      {/* Experience - Timeline */}
      <section id="experience" className="py-24 px-8 max-w-6xl mx-auto space-y-16">
        <div className="flex items-center gap-6">
          <h2 className="text-4xl font-bold tracking-tight">Experience</h2>
          <div className="h-px bg-gradient-to-r from-primary/50 to-transparent flex-1" />
        </div>
        <div className="relative">
          {/* Timeline vertical line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/60 via-white/10 to-transparent" />
          <div className="space-y-12">
             {experiences.map((exp, i) => (
               <div key={i} className="group relative pl-12 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1.5 z-10">
                    <div className="w-6 h-6 rounded-full bg-[#050505] border-2 border-primary flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
                      <div className="w-2 h-2 rounded-full bg-primary group-hover:bg-white transition-colors duration-500" />
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-500">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                       <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">{exp.role} <span className="text-white/30 font-normal">@ {exp.company}</span></h3>
                       <span className="text-xs font-mono text-primary/60 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">{exp.duration}</span>
                    </div>
                    <p className="text-white/40 leading-relaxed">{exp.description}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-24 px-8 max-w-6xl mx-auto space-y-16">
        <div className="flex items-center gap-6">
          <h2 className="text-4xl font-bold tracking-tight">Featured Projects</h2>
          <div className="h-px bg-gradient-to-r from-primary/50 to-transparent flex-1" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
           {projects.map((proj, i) => (
             <div key={i} className="group p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-primary/30 transition-all duration-500 hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">{proj.title}</h3>
                <p className="text-white/35 mb-6 line-clamp-3 leading-relaxed">{proj.description}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                   {proj.tech.split(',').map((t:string, idx:number) => (
                     <span key={idx} className="px-3 py-1 rounded-full bg-primary/5 text-[10px] font-bold uppercase tracking-widest text-primary/70 border border-primary/10">{t.trim()}</span>
                   ))}
                </div>
                {proj.link && (
                  <a href={proj.link} target="_blank" className="inline-flex items-center gap-2 text-sm font-bold text-white/40 group-hover:text-primary transition-all duration-300">
                    VIEW PROJECT <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                )}
             </div>
           ))}
        </div>
      </section>

      {/* Skills & Edu */}
      <section id="skills" className="py-24 px-8 max-w-6xl mx-auto grid md:grid-cols-2 gap-20">
         <div className="space-y-12">
            <div className="flex items-center gap-6">
              <h2 className="text-4xl font-bold tracking-tight">Tech Stack</h2>
              <div className="h-px bg-gradient-to-r from-primary/50 to-transparent flex-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               {skills.map((skill, i) => (
                  <div key={i} className="group p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-500 space-y-3">
                     <div className="flex justify-between items-center">
                       <span className="font-bold text-sm group-hover:text-primary transition-colors duration-300">{skill.name}</span>
                       <span className="text-[10px] font-mono text-white/20">{skill.level}%</span>
                     </div>
                     <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-primary/50 rounded-full transition-all duration-1000" style={{ width: `${skill.level}%` }} />
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="space-y-12">
            <div className="flex items-center gap-6">
              <h2 className="text-4xl font-bold tracking-tight">Education</h2>
              <div className="h-px bg-gradient-to-r from-primary/50 to-transparent flex-1" />
            </div>
            <div className="space-y-6">
               {education.map((edu, i) => (
                  <div key={i} className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-500 space-y-2">
                     <h3 className="font-bold text-lg group-hover:text-primary transition-colors duration-300">{edu.degree}</h3>
                     <p className="text-white/40 text-sm">{edu.college}</p>
                     <div className="flex gap-4 text-xs font-mono text-primary/40">
                        <span>{edu.year}</span>
                        <span>CGPA: {edu.cgpa}</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-white/[0.06] text-center px-8 relative">
         <div className="absolute inset-0 bg-gradient-to-t from-primary/[0.03] to-transparent pointer-events-none" />
         <div className="max-w-xl mx-auto space-y-10 relative z-10">
            <h2 className="text-5xl font-bold tracking-tight">
              Let&apos;s build something <br/>
              <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent italic">extraordinary</span> together.
            </h2>
            <div className="flex justify-center gap-4">
               <a href={`mailto:${student.email}`} className="px-10 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 active:scale-95 transition-all duration-300 shadow-xl shadow-primary/20">Hire Me</a>
               {student.resume_url && (
                 <a href={student.resume_url} target="_blank" className="px-10 py-4 bg-white/5 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 active:scale-95 transition-all duration-300">Download CV</a>
               )}
            </div>
            <p className="text-white/20 text-sm pt-8">
               © {new Date().getFullYear()} {student.name}. 
               {(!student.subscription_status || student.subscription_status === 'free') && ' Created with Portfolia.'}
            </p>
         </div>
      </footer>
    </div>
  )
}
