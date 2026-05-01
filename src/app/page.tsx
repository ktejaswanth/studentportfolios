import Link from 'next/link'
import { ArrowRight, CheckCircle2, Sparkles, Zap, Shield, Globe } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col gap-24 py-12">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center gap-8 max-w-4xl mx-auto py-12">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 blur-[120px] -z-10 rounded-full" />
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-semibold text-primary uppercase tracking-wider animate-fade-in opacity-0 [animation-delay:200ms]">
          <Sparkles size={14} />
          <span>Built for the next generation of pros</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold font-outfit tracking-tight animate-fade-in opacity-0 [animation-delay:400ms]">
          Build your <span className="text-primary italic">dream</span> portfolio in minutes.
        </h1>

        <p className="text-xl text-muted-foreground animate-fade-in opacity-0 [animation-delay:600ms] max-w-2xl">
          The ultimate portfolio maker for students. Stunning templates, easy management, and instant deployment. Show the world what you can do.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-fade-in opacity-0 [animation-delay:800ms]">
          <Link href="/signup" className="btn-primary flex items-center gap-2 text-lg px-8 shadow-2xl shadow-primary/20">
            Start Building Free <ArrowRight size={20} />
          </Link>
          <Link href="/pricing" className="btn-secondary text-lg px-8">
            View Pricing
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Zap className="text-primary" />}
          title="Instant Deploy"
          description="Your portfolio is live the second you save. No hosting complexities, just share your link."
        />
        <FeatureCard 
          icon={<Shield className="text-primary" />}
          title="Secure & Reliable"
          description="Powered by Supabase and Next.js, your data is safe and your site is lightning fast."
        />
        <FeatureCard 
          icon={<Globe className="text-primary" />}
          title="Shareable Link"
          description="Get a professional public link with your college ID that looks great on resumes and LinkedIn."
        />
      </section>

      {/* Pricing Teaser */}
      <section className="flex flex-col items-center gap-12 py-12 border-y border-white/5 bg-white/[0.01]">
         <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold font-outfit">Unlock <span className="text-primary italic">Premium</span> Features</h2>
            <p className="text-muted-foreground">Everything you need to land your dream job, starting at just ₹10.</p>
         </div>
         <div className="grid md:grid-cols-2 gap-8 max-w-3xl w-full px-4">
            <div className="card-premium p-8 flex flex-col gap-6">
               <h3 className="text-xl font-bold font-outfit">Free Plan</h3>
               <ul className="space-y-3 text-sm text-muted-foreground flex-1">
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> 1 Portfolio URL</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Standard Templates</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Resume Generator</li>
               </ul>
               <Link href="/signup" className="btn-secondary text-center py-2 text-sm">Join Free</Link>
            </div>
            <div className="card-premium p-8 flex flex-col gap-6 border-primary/30 relative overflow-hidden">
               <div className="absolute top-4 right-4 bg-primary text-[8px] font-black px-1.5 py-0.5 rounded text-white uppercase tracking-widest">Recommended</div>
               <h3 className="text-xl font-bold font-outfit">Premium Pro</h3>
               <ul className="space-y-3 text-sm text-muted-foreground flex-1">
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Exclusive Templates</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Advanced Analytics</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Priority Support</li>
               </ul>
               <Link href="/signup" className="btn-primary text-center py-2 text-sm shadow-xl shadow-primary/20">Upgrade Now</Link>
            </div>
         </div>
      </section>

      {/* Steps Section */}
      <section className="flex flex-col gap-16 py-12">

        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold font-outfit">How it works</h2>
          <p className="text-muted-foreground">Three simple steps to professional success.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          <Step 
            number="01"
            title="Create Account"
            description="Sign up with your email and college ID. We use your ID as your unique primary key."
          />
          <Step 
            number="02"
            title="Fill Details"
            description="Add your experience, projects, skills, and more using our intuitive editor."
          />
          <Step 
            number="03"
            title="Choose Template"
            description="Pick a premium template that matches your style and share your link with the world."
          />
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="card-premium flex flex-col gap-4 text-left group">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center transition-colors group-hover:bg-white/10">
        {icon}
      </div>
      <h3 className="text-xl font-bold font-outfit">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function Step({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="flex flex-col gap-4 relative">
      <div className="text-8xl font-black font-outfit text-white/5 absolute -top-12 -left-4 select-none">
        {number}
      </div>
      <h3 className="text-2xl font-bold font-outfit relative z-10">{title}</h3>
      <p className="text-muted-foreground leading-relaxed relative z-10">
        {description}
      </p>
      <CheckCircle2 className="text-primary w-6 h-6 mt-2" />
    </div>
  )
}
