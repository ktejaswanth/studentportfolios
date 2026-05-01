import { Code, Link2, Mail, ExternalLink, Download, Phone, MapPin } from 'lucide-react'

type PortfolioProps = {
  student: any;
  experiences: any[];
  projects: any[];
  education: any[];
  skills: any[];
}

export default function ModernDark({ student, experiences, projects, education, skills }: PortfolioProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30">
      {/* Navbar Placeholder */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5 py-4 px-8 flex justify-between items-center">
        <span className="font-bold text-xl tracking-tighter">{student.name.split(' ').map((n:string)=>n[0]).join('')}</span>
        <div className="flex gap-6 text-sm font-medium text-muted-foreground">
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#experience" className="hover:text-white transition-colors">Experience</a>
          <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          {student.resume_url && (
            <a href={student.resume_url} target="_blank" className="text-primary hover:underline">Resume</a>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="about" className="pt-40 pb-20 px-8 max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-primary">
            <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            AVAILABLE FOR OPPORTUNITIES
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
             I'm <span className="text-primary">{student.name}</span>
          </h1>
          <p className="text-2xl text-muted-foreground font-medium">
             {student.role_title}
          </p>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
             {student.summary}
          </p>
          
          <div className="flex items-center gap-6 pt-4">
            {student.github_url && <a href={student.github_url} className="text-muted-foreground hover:text-white transition-colors"><Code size={24} /></a>}
            {student.linkedin_url && <a href={student.linkedin_url} className="text-muted-foreground hover:text-white transition-colors"><Link2 size={24} /></a>}
            {student.email && <a href={`mailto:${student.email}`} className="text-muted-foreground hover:text-white transition-colors"><Mail size={24} /></a>}
            {student.phone && <a href={`tel:${student.phone}`} className="text-muted-foreground hover:text-white transition-colors"><Phone size={24} /></a>}
          </div>
        </div>

        {student.profile_pic_url && (
          <div className="w-64 h-64 md:w-80 md:h-80 relative flex-shrink-0">
             <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
             <img 
               src={student.profile_pic_url} 
               alt={student.name} 
               className="w-full h-full object-cover rounded-3xl border border-white/10 relative z-10 scale-100 hover:scale-105 transition-transform duration-500"
             />
          </div>
        )}
      </section>

      {/* Experience */}
      <section id="experience" className="py-20 px-8 max-w-6xl mx-auto space-y-12">
        <h2 className="text-3xl font-bold border-l-4 border-primary pl-4">Experience</h2>
        <div className="space-y-8">
           {experiences.map((exp, i) => (
             <div key={i} className="group relative pl-8 border-l border-white/10 pb-8">
                <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-primary" />
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                   <h3 className="text-xl font-bold">{exp.role} @ {exp.company}</h3>
                   <span className="text-sm font-mono text-muted-foreground">{exp.duration}</span>
                </div>
                <p className="text-muted-foreground max-w-3xl italic">{exp.description}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-20 px-8 max-w-6xl mx-auto space-y-12">
        <h2 className="text-3xl font-bold border-l-4 border-primary pl-4">Featured Projects</h2>
        <div className="grid md:grid-cols-2 gap-8">
           {projects.map((proj, i) => (
             <div key={i} className="group p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/50 transition-all duration-500 hover:bg-white/[0.08]">
                <h3 className="text-2xl font-bold mb-4">{proj.title}</h3>
                <p className="text-muted-foreground mb-6 line-clamp-3">{proj.description}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                   {proj.tech.split(',').map((t:string, idx:number) => (
                     <span key={idx} className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold uppercase tracking-widest text-primary/80 border border-white/5">{t.trim()}</span>
                   ))}
                </div>
                {proj.link && (
                  <a href={proj.link} target="_blank" className="inline-flex items-center gap-2 text-sm font-bold text-white group-hover:text-primary transition-colors">
                    VIEW PROJECT <ExternalLink size={16} />
                  </a>
                )}
             </div>
           ))}
        </div>
      </section>

      {/* Skills & Edu */}
      <section className="py-20 px-8 max-w-6xl mx-auto grid md:grid-cols-2 gap-20">
         <div className="space-y-12">
            <h2 className="text-3xl font-bold border-l-4 border-primary pl-4">Technical Stack</h2>
            <div className="flex flex-wrap gap-4">
               {skills.map((skill, i) => (
                  <div key={i} className="px-6 py-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2 min-w-[140px]">
                     <span className="font-bold text-sm">{skill.name}</span>
                     <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${skill.level}%` }} />
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="space-y-12">
            <h2 className="text-3xl font-bold border-l-4 border-primary pl-4">Education</h2>
            <div className="space-y-6">
               {education.map((edu, i) => (
                  <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/5 flex flex-col gap-2">
                     <h3 className="font-bold">{edu.degree}</h3>
                     <p className="text-muted-foreground text-sm">{edu.college}</p>
                     <div className="flex justify-between text-xs font-mono text-primary/60">
                        <span>{edu.year}</span>
                        <span>CGPA: {edu.cgpa}</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center px-8">
         <div className="max-w-xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold tracking-tight">Let's build something <span className="text-primary italic">extraordinary</span> together.</h2>
            <div className="flex justify-center gap-6">
               <a href={`mailto:${student.email}`} className="btn-primary px-8">Hire Me</a>
               <a href={student.resume_url} target="_blank" className="btn-secondary">Download CV</a>
            </div>
            <p className="text-muted-foreground text-sm pt-8 opacity-50">
               © {new Date().getFullYear()} {student.name}. 
               {(!student.subscription_status || student.subscription_status === 'free') && ' Created with Portfolia.'}
            </p>
         </div>
      </footer>
    </div>
  )
}
