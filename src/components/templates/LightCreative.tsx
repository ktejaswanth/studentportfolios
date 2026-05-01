import { Code, Link2, ExternalLink, FileText, ChevronRight } from 'lucide-react'

export default function LightCreative({ student, experiences, projects, education, skills }: any) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-outfit selection:bg-primary/20">
      <div className="max-w-4xl mx-auto px-6 py-20 space-y-32">
        
        {/* Hero Section */}
        <header className="relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute top-20 -right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
          
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-slate-900">
              {student.name}
            </h1>
            <h2 className="text-2xl text-primary font-medium flex items-center gap-2">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              {student.role_title}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
              {student.summary}
            </p>
            
            <div className="flex gap-4 pt-4 flex-wrap">
              {student.github_url && <SocialLink href={student.github_url} label="GitHub" />}
              {student.linkedin_url && <SocialLink href={student.linkedin_url} label="LinkedIn" />}
              {student.email && <SocialLink href={`mailto:${student.email}`} label="Email" />}
              {student.resume_url && (
                <a href={student.resume_url} target="_blank" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors shadow-xl shadow-slate-900/10 text-sm">
                  <FileText size={16} /> View Resume
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Experience Section */}
        <section className="space-y-12">
          <SectionTitle title="Experience" />
          <div className="grid gap-8">
            {experiences.map((exp: any, i: number) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{exp.role}</h3>
                    <p className="text-primary font-medium">{exp.company}</p>
                  </div>
                  <span className="text-sm font-medium text-slate-400 bg-slate-100 px-4 py-1.5 rounded-full whitespace-nowrap">{exp.duration}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section className="space-y-12">
          <SectionTitle title="Featured Projects" />
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((proj: any, i: number) => (
              <div key={i} className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{proj.title}</h3>
                  {proj.link && (
                    <a href={proj.link} className="p-2 bg-slate-50 text-slate-600 rounded-full hover:bg-primary hover:text-white transition-colors">
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
                <p className="text-slate-600 leading-relaxed flex-grow">{proj.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {proj.tech.split(',').map((t: string, j: number) => (
                    <span key={j} className="text-xs font-medium bg-slate-50 text-slate-600 px-3 py-1 rounded-full border border-slate-200">
                      {t.trim()}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Edu & Skills grid */}
        <div className="grid md:grid-cols-2 gap-16">
          <section className="space-y-8">
            <SectionTitle title="Education" />
            <div className="space-y-8">
               {education.map((edu: any, i: number) => (
                 <div key={i} className="relative pl-6 border-l-2 border-slate-200">
                    <div className="absolute w-3 h-3 bg-white border-2 border-primary rounded-full -left-[7.5px] top-1.5"></div>
                    <h3 className="text-lg font-bold text-slate-900">{edu.degree}</h3>
                    <p className="text-slate-600 font-medium">{edu.college}</p>
                    <div className="mt-2 flex items-center gap-3 text-sm text-slate-500">
                      <span>{edu.year}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span>CGPA: {edu.cgpa}</span>
                    </div>
                 </div>
               ))}
            </div>
          </section>

          <section className="space-y-8">
            <SectionTitle title="Technical Arsenal" />
            <div className="flex flex-wrap gap-3">
               {skills.map((skill: any, i: number) => (
                 <div key={i} className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-slate-100 font-medium text-slate-700">
                    <ChevronRight size={14} className="text-primary" />
                    {skill.name}
                 </div>
               ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="pt-12 pb-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
           <p>© {new Date().getFullYear()} {student.name}. All rights reserved.</p>
           {(!student.subscription_status || student.subscription_status === 'free') && (
             <p className="flex items-center gap-1 font-medium bg-slate-100 px-3 py-1.5 rounded-full">
               Designed with <span className="text-primary font-bold">Portfolia</span>
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
      <div className="h-px bg-slate-200 flex-1"></div>
    </div>
  )
}

function SocialLink({ href, label }: { href: string, label: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      className="px-6 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 font-medium hover:border-primary hover:text-primary transition-all shadow-sm hover:shadow-md"
    >
      {label}
    </a>
  )
}
