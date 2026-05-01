'use client'

import { Check, X, Zap, Crown, ShieldCheck, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="flex flex-col gap-24 py-12 items-center">
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold font-outfit tracking-tight">
          Simple, Transparent <span className="text-primary italic">Pricing</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Start for free and upgrade when you're ready to stand out. No hidden fees, just professional growth.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        {/* Free Plan */}
        <div className="card-premium flex flex-col gap-8 p-8 relative overflow-hidden group">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold font-outfit uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Free</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold font-outfit">₹0</span>
              <span className="text-muted-foreground">/for 30 days</span>
            </div>
            <p className="text-sm text-muted-foreground italic">Perfect for getting started.</p>
          </div>

          <div className="space-y-4 flex-1">
            <PricingItem active={true} text="1 Public Portfolio URL" />
            <PricingItem active={true} text="Standard Templates" />
            <PricingItem active={true} text="Resume PDF Download" />
            <PricingItem active={false} text="Premium Templates" />
            <PricingItem active={false} text="Advanced Analytics" />
            <PricingItem active={false} text="Priority Support" />
          </div>

          <Link href="/signup" className="btn-secondary w-full text-center flex items-center justify-center gap-2 group-hover:bg-white/5">
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="card-premium flex flex-col gap-8 p-8 border-primary/50 relative overflow-hidden group shadow-2xl shadow-primary/10">
          <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest animate-pulse">
            Popular
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs">
              <Crown size={14} /> Recommended
            </div>
            <h3 className="text-2xl font-bold font-outfit uppercase tracking-widest">Premium Pro</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold font-outfit">₹10</span>
              <span className="text-muted-foreground">/for 120 days</span>
            </div>
            <p className="text-sm text-muted-foreground italic">Unlock your full professional potential.</p>
          </div>

          <div className="space-y-4 flex-1">
            <PricingItem active={true} text="Everything in Free" />
            <PricingItem active={true} text="Exclusive Premium Templates" />
            <PricingItem active={true} text="Advanced Profile Analytics" />
            <PricingItem active={true} text="Remove 'Built with' Badge" />
            <PricingItem active={true} text="Custom Theme Colors" />
            <PricingItem active={true} text="Priority Email Support" />
          </div>

          <Link href="/signup" className="btn-primary w-full text-center flex items-center justify-center gap-2 animate-pulse-glow">
            Unlock Premium <Zap size={18} />
          </Link>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] italic opacity-60">
             <ShieldCheck size={12} /> Secure Manual Verification
          </div>
        </div>
      </div>

      {/* Manual Payment Explanation */}
      <section className="max-w-3xl w-full card-premium p-12 text-center space-y-8 animate-fade-in">
        <h2 className="text-3xl font-bold font-outfit">How the <span className="text-primary italic">Manual System</span> works?</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left">
           <Step number="01" title="Payment" desc="Scan the UPI QR code in your dashboard and pay ₹10." />
           <Step number="02" title="Upload" desc="Upload the screenshot of your payment confirmation." />
           <Step number="03" title="Verify" desc="Our admin verifies it and activates your Pro status." />
        </div>
        <p className="text-sm text-muted-foreground italic bg-white/5 p-4 rounded-xl border border-white/10 inline-block">
          Typical activation time: <span className="text-foreground font-bold">1 to 24 hours</span> after submission.
        </p>
      </section>
    </div>
  )
}

function PricingItem({ active, text }: { active: boolean, text: string }) {
  return (
    <div className={`flex items-center gap-3 text-sm ${active ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}>
      {active ? <Check size={16} className="text-primary" /> : <X size={16} className="text-destructive" />}
      <span>{text}</span>
    </div>
  )
}

function Step({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="space-y-3">
       <div className="text-3xl font-black font-outfit text-primary opacity-20">{number}</div>
       <h4 className="font-bold uppercase tracking-widest text-sm">{title}</h4>
       <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  )
}
