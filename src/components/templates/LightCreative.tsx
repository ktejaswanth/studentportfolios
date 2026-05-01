import { Code, Link2, ExternalLink, FileText, ChevronRight, Sun, Palette } from 'lucide-react'

export default function LightCreative({ student, experiences, projects, education, skills }: any) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 antialiased selection:bg-primary/20">
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
            <div className="flex items-center gap-4">
              {student.profile_pic_url && (
                <img src={student.profile_pic_url} alt={student.name} className="w-20 h-20 rounded-2xl object-cover shadow-xl shadow-primary/10 border-2 border-white ring-4 ring-primary/5" />
              )}
              <div>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900">
                  {student.name}
                </h1>
                <h2 className="text-xl text-primary font-semibold flex items-center gap-2 mt-2">
                  <span className="w-8 h-1 bg-primary rounded-full"></span>
                  {student.role_title}
                </h2>
              </div>
            </div>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
              {student.summary}
            </p>

            <div className="flex gap-3 flex-wrap">
              {student.github_url && <SocialLink href={student.github_url} label="GitHub" />}
              {student.linkedin_url && <SocialLink href={student.linkedin_url} label="LinkedIn" />}
              {student.email && <SocialLink href={`mailto:${student.email}`} label="Email" />}
              {student.resume_url && (
                <a href={student.resume_url} target="_blank" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 text-sm active:scale-95">
                  <FileText size={14} /> View Resume
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Experience Section */}
        <section id="experience" className="space-y-12">
          <SectionTitle title="Experience" />
          <div className="grid gap-4">
            {experiences.map((exp: any, i: number) => (
              <div key={i} className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors duration-300">{exp.role}</h3>
                    <p className="text-primary/70 font-semibold">{exp.company}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100 whitespace-nowrap">{exp.duration}</span>
                </div>
                <p className="text-slate-500 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="space-y-12">
          <SectionTitle title="Featured Projects" />
          <div className="grid md:grid-cols-2 gap-4">
            {projects.map((proj: any, i: number) => (
              <div key={i} className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 flex flex-col h-full hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors duration-300">{proj.title}</h3>
                  {proj.link && (
                    <a href={proj.link} target="_blank" className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-primary hover:text-white transition-all duration-300 shadow-sm">
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
                <p className="text-slate-500 leading-relaxed flex-grow">{proj.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {proj.tech.split(',').map((t: string, j: number) => (
                    <span key={j} className="text-xs font-semibold bg-primary/5 text-primary/70 px-3 py-1 rounded-lg border border-primary/10">
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
            <div className="space-y-6">
              {education.map((edu: any, i: number) => (
                <div key={i} className="relative pl-6 border-l-2 border-primary/20 hover:border-primary transition-colors duration-300 group">
                  <div className="absolute w-3 h-3 bg-white border-2 border-primary rounded-full -left-[7.5px] top-1.5 group-hover:bg-primary transition-colors duration-300"></div>
                  <h3 className="text-lg font-bold text-slate-900">{edu.degree}</h3>
                  <p className="text-slate-500 font-medium">{edu.college}</p>
                  <div className="mt-2 flex items-center gap-3 text-sm text-slate-400">
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
                <div key={i} className="group flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-slate-100 font-semibold text-slate-600 hover:border-primary/30 hover:text-primary hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
                  <Palette size={12} className="text-primary/40 group-hover:text-primary transition-colors" />
                  {skill.name}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="pt-12 pb-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} {student.name}. All rights reserved.</p>
          {(!student.subscription_status || student.subscription_status === 'free') && (
            <p className="flex items-center gap-1 font-medium bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
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
