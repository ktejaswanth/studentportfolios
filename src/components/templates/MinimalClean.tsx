import { Code, Link2, Mail, ExternalLink, Download, FileText } from 'lucide-react'

export default function MinimalClean({ student, experiences, projects, education, skills }: any) {
  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-200 font-inter">
      <div className="max-w-3xl mx-auto px-6 py-24 space-y-24">
        {/* Header */}
        <header className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900">{student.name}</h1>
            <p className="text-xl text-zinc-500">{student.role_title}</p>
          </div>
          
          <div className="flex gap-4 items-center flex-wrap">
            {student.github_url && <SocialLink href={student.github_url} label="GitHub" />}
            {student.linkedin_url && <SocialLink href={student.linkedin_url} label="LinkedIn" />}
            {student.email && <SocialLink href={`mailto:${student.email}`} label="Email" />}
            {student.resume_url && (
              <a href={student.resume_url} target="_blank" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 hover:text-zinc-500 transition-colors">
                <FileText size={16} /> Resume
              </a>
            )}
          </div>
        </header>

        {/* About */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">About</h2>
          <p className="text-lg leading-relaxed text-zinc-600">
            {student.summary}
          </p>
        </section>

        {/* Experience */}
        <section className="space-y-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Experience</h2>
          <div className="space-y-12">
            {experiences.map((exp: any, i: number) => (
              <div key={i} className="group flex flex-col md:flex-row md:items-start gap-2 md:gap-12">
                <span className="text-sm text-zinc-400 min-w-[120px] pt-1">{exp.duration}</span>
                <div className="space-y-2">
                  <h3 className="font-bold text-zinc-900">{exp.role} · {exp.company}</h3>
                  <p className="text-zinc-600 leading-relaxed text-sm">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="space-y-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Projects</h2>
          <div className="grid gap-8">
            {projects.map((proj: any, i: number) => (
              <div key={i} className="group space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-zinc-900 group-hover:text-zinc-500 transition-colors">{proj.title}</h3>
                  {proj.link && <a href={proj.link} className="text-zinc-400 hover:text-zinc-900"><ExternalLink size={16} /></a>}
                </div>
                <p className="text-zinc-600 text-sm leading-relaxed">{proj.description}</p>
                <div className="text-xs font-mono text-zinc-400 pt-2">{proj.tech}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Education & Skills */}
        <div className="grid md:grid-cols-2 gap-24">
          <section className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Education</h2>
            <div className="space-y-6">
               {education.map((edu: any, i: number) => (
                 <div key={i} className="space-y-1">
                    <h3 className="font-bold text-zinc-900 text-sm">{edu.college}</h3>
                    <p className="text-zinc-600 text-sm">{edu.degree}</p>
                    <p className="text-zinc-400 text-xs">{edu.year} · {edu.cgpa}</p>
                 </div>
               ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Skills</h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
               {skills.map((skill: any, i: number) => (
                 <span key={i} className="text-sm text-zinc-600 font-medium">/ {skill.name}</span>
               ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="pt-24 pb-8 border-t border-zinc-100 flex justify-between items-center text-xs text-zinc-400">
           <span>{student.name} / {new Date().getFullYear()}</span>
           {(!student.subscription_status || student.subscription_status === 'free') && (
             <span className="italic">Built with Portfolia</span>
           )}
        </footer>
      </div>
    </div>
  )
}

function SocialLink({ href, label }: { href: string, label: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
    >
      {label}
    </a>
  )
}
