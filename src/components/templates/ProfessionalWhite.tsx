import { Code, Link2, ExternalLink, FileText, Briefcase, GraduationCap, Wrench, ChevronRight } from 'lucide-react'

export default function ProfessionalWhite({ student, experiences, projects, education, skills }: any) {
  return (
    <div className="min-h-screen bg-white text-black font-serif selection:bg-black selection:text-white">
      <div className="max-w-5xl mx-auto px-8 py-24 space-y-24">
        
        {/* Header */}
        <header className="border-b-4 border-black pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase">
              {student.name}
            </h1>
            <h2 className="text-2xl md:text-3xl font-light text-zinc-600 tracking-wide">
              {student.role_title}
            </h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 text-sm font-sans tracking-widest uppercase font-bold text-zinc-500">
              {student.email && <a href={`mailto:${student.email}`} className="hover:text-black transition-colors">{student.email}</a>}
              {student.linkedin_url && <a href={student.linkedin_url} target="_blank" className="hover:text-black transition-colors">LinkedIn</a>}
              {student.github_url && <a href={student.github_url} target="_blank" className="hover:text-black transition-colors">GitHub</a>}
              {student.resume_url && <a href={student.resume_url} target="_blank" className="hover:text-black transition-colors flex items-center gap-1"><FileText size={14}/> Resume</a>}
            </div>
          </div>
        </header>

        {/* Summary */}
        <section className="text-xl md:text-2xl leading-relaxed text-zinc-800 font-light border-l-4 border-black pl-8">
          {student.summary}
        </section>

        {/* Professional Experience */}
        <section className="space-y-12">
          <SectionHeader title="Professional Experience" icon={<Briefcase />} />
          <div className="space-y-16">
            {experiences.map((exp: any, i: number) => (
              <div key={i} className="grid md:grid-cols-[1fr_3fr] gap-4 md:gap-12">
                <div className="font-sans">
                  <div className="text-sm font-bold uppercase tracking-widest text-zinc-500">{exp.duration}</div>
                  <div className="text-lg font-bold mt-1">{exp.company}</div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">{exp.role}</h3>
                  <p className="text-lg text-zinc-700 leading-relaxed font-serif">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Selected Projects */}
        <section className="space-y-12">
          <SectionHeader title="Selected Projects" icon={<Code />} />
          <div className="grid md:grid-cols-2 gap-12">
            {projects.map((proj: any, i: number) => (
              <div key={i} className="group border border-zinc-200 p-8 hover:border-black transition-colors flex flex-col h-full bg-zinc-50 hover:bg-white">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold">{proj.title}</h3>
                  {proj.link && (
                    <a href={proj.link} className="text-zinc-400 hover:text-black transition-colors">
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
                <p className="text-lg text-zinc-700 leading-relaxed flex-grow font-serif">{proj.description}</p>
                <div className="mt-8 pt-6 border-t border-zinc-200 font-sans text-xs font-bold uppercase tracking-widest text-zinc-500">
                  {proj.tech.replace(/,/g, ' • ')}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education & Skills */}
        <div className="grid md:grid-cols-2 gap-16 border-t-4 border-black pt-16">
          <section className="space-y-8">
            <SectionHeader title="Education" icon={<GraduationCap />} />
            <div className="space-y-8">
               {education.map((edu: any, i: number) => (
                 <div key={i} className="space-y-2">
                    <h3 className="text-xl font-bold">{edu.degree}</h3>
                    <p className="text-lg text-zinc-700">{edu.college}</p>
                    <div className="font-sans text-sm font-bold uppercase tracking-widest text-zinc-500">
                      Class of {edu.year} • CGPA: {edu.cgpa}
                    </div>
                 </div>
               ))}
            </div>
          </section>

          <section className="space-y-8">
            <SectionHeader title="Core Competencies" icon={<Wrench />} />
            <ul className="space-y-4">
               {skills.map((skill: any, i: number) => (
                 <li key={i} className="flex items-center gap-3 text-lg font-serif">
                    <ChevronRight size={16} className="text-zinc-400" />
                    {skill.name}
                 </li>
               ))}
            </ul>
          </section>
        </div>

        {/* Footer */}
        <footer className="pt-16 pb-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans font-bold uppercase tracking-widest text-zinc-400">
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
    <div className="flex items-center gap-4 mb-12">
      <div className="text-black">{icon}</div>
      <h2 className="text-3xl font-bold uppercase tracking-widest">{title}</h2>
    </div>
  )
}
