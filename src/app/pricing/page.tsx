'use client'

import { Check, X, Zap, Crown, ShieldCheck, ArrowRight, Sparkles, Palette, FileText, BarChart3, Link2, Layout, Lock, Cloud, ChevronDown, Star } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
  })
}

const freeFeatures = [
  { icon: <FileText size={18} />, title: 'Basic Portfolio Builder', desc: 'Enter your name, skills, projects & more' },
  { icon: <Palette size={18} />, title: '2–3 Starter Templates', desc: 'Simple, clean designs to get started' },
  { icon: <Link2 size={18} />, title: 'Public Portfolio URL', desc: 'yoursite.com/collegeID — share anywhere' },
  { icon: <FileText size={18} />, title: 'Basic Resume Download', desc: '1 format — simple PDF export' },
  { icon: <Layout size={18} />, title: 'Profile Image Upload', desc: 'Basic profile photo upload' },
  { icon: <Palette size={18} />, title: 'Light / Dark Theme', desc: 'Toggle between two themes' },
  { icon: <Cloud size={18} />, title: 'Save & Edit Anytime', desc: 'Your data is stored, edit later' },
]

const premiumFeatures = [
  { icon: <Crown size={18} />, title: 'All Premium Templates', desc: 'Modern, recruiter-ready professional designs' },
  { icon: <Palette size={18} />, title: 'Full Customization', desc: 'Colors, fonts, layout — full control' },
  { icon: <FileText size={18} />, title: 'Multiple Resume Formats', desc: 'Modern, Professional, Creative — 1 click PDF' },
  { icon: <Zap size={18} />, title: 'ATS-Friendly Resume', desc: 'Auto format optimization for job applications' },
  { icon: <Link2 size={18} />, title: 'Custom URL (Coming Soon)', desc: 'yoursite.com/yourname — personal branding' },
  { icon: <Layout size={18} />, title: 'Advanced Profile Design', desc: 'Better layout, rearrange sections freely' },
  { icon: <BarChart3 size={18} />, title: 'Portfolio Analytics (Coming Soon)', desc: 'Track visitors, views & engagement' },
  { icon: <Lock size={18} />, title: 'Priority Access', desc: 'Early features & faster updates' },
  { icon: <ShieldCheck size={18} />, title: 'Secure Storage & Backup', desc: 'Your data is safe and backup-ready' },
]

const comparisonData = [
  { feature: 'Portfolio Builder', free: true, premium: true },
  { feature: 'Templates', free: 'Limited (2-3)', premium: 'All Premium' },
  { feature: 'Resume Download', free: '1 Format', premium: 'Multiple Formats' },
  { feature: 'Customization', free: 'Basic (Theme)', premium: 'Full (Colors, Fonts, Layout)' },
  { feature: 'Profile Design', free: 'Simple', premium: 'Advanced' },
  { feature: 'Analytics', free: false, premium: true },
  { feature: 'Custom URL', free: false, premium: true },
  { feature: 'ATS Resume', free: false, premium: true },
  { feature: 'Priority Support', free: false, premium: true },
  { feature: 'Price', free: '₹0', premium: '₹10/year 🔥' },
]

const faqs = [
  { q: 'Free plan lo emi emi cheyvachu?', a: 'Portfolio create cheyyachu, basic templates use cheyyachu, resume download cheyyachu, and public URL share cheyyachu. Beginners ki perfect ga work avuthundi!' },
  { q: 'Premium entha? Payment ela?', a: 'Just ₹10 per year! UPI QR code scan chesi pay cheyyi, screenshot upload cheyyi — admin verify chesi 1-24 hours lo activate chestharu.' },
  { q: 'Premium lo extra emi vasthundi?', a: 'All premium templates, full customization (colors, fonts, layout), multiple resume formats, ATS-friendly resume, analytics, priority access — everything unlock avuthundi!' },
  { q: 'Refund policy undi aa?', a: 'Just ₹10 kabatti refund policy ledu, but guarantee ga value ki value vasthundi. Try chesi chudandi!' },
]

export default function PricingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setIsLoggedIn(true)
    })
  }, [])

  return (
    <div className="flex flex-col gap-28 py-12 items-center">
      {/* Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/15 blur-[180px] -z-10 rounded-full pointer-events-none" />

      {/* Hero Section */}
      <motion.section
        className="text-center space-y-6 max-w-3xl"
        initial="hidden" animate="visible"
      >
        <motion.div variants={fadeUp} custom={0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-semibold text-primary uppercase tracking-wider"
        >
          <Sparkles size={14} /> Simple & Transparent Pricing
        </motion.div>

        <motion.h1 variants={fadeUp} custom={1}
          className="text-5xl md:text-7xl font-bold font-outfit tracking-tight leading-tight"
        >
          Free ga <span className="text-primary italic">start</span> cheyyi,
          <br />Premium tho <span className="text-primary italic">standout</span> avvu
        </motion.h1>

        <motion.p variants={fadeUp} custom={2}
          className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto"
        >
          No hidden fees. Start building for free, upgrade when you&apos;re ready to go professional. Just ₹10/year — cheaper than a coffee ☕
        </motion.p>
      </motion.section>

      {/* ═══════════════ PRICING CARDS ═══════════════ */}
      <section className="grid md:grid-cols-2 gap-8 w-full max-w-5xl px-4">

        {/* ── FREE PLAN ── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="card-premium flex flex-col gap-8 p-8 relative overflow-hidden group"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <Zap size={20} className="text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold font-outfit uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Free</h3>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold font-outfit">₹0</span>
              <span className="text-muted-foreground">/forever</span>
            </div>
            <p className="text-sm text-muted-foreground italic">Perfect for beginners — portfolio create cheskovadaniki enough 👌</p>
          </div>

          <div className="space-y-4 flex-1">
            {freeFeatures.map((f, i) => (
              <div key={i} className="flex items-start gap-3 text-sm group/item">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 text-primary group-hover/item:bg-primary/10 transition-colors">
                  {f.icon}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{f.title}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* What you WON'T get */}
          <div className="border-t border-white/5 pt-4 space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Not included</p>
            {['Premium Templates', 'Advanced Customization', 'Multiple Resume Styles', 'Analytics'].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground/50">
                <X size={12} className="text-destructive/50" /> {item}
              </div>
            ))}
          </div>

          <Link href={isLoggedIn ? "/dashboard" : "/signup"} className="btn-secondary w-full text-center flex items-center justify-center gap-2 group-hover:bg-white/5">
            {isLoggedIn ? "Go to Dashboard" : "Start Building Free"} <ArrowRight size={18} />
          </Link>
        </motion.div>

        {/* ── PREMIUM PLAN ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="card-premium flex flex-col gap-8 p-8 border-primary/50 relative overflow-hidden group shadow-2xl shadow-primary/10"
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 shimmer opacity-30 pointer-events-none" />

          {/* Popular Badge */}
          <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
            <Star size={10} fill="white" /> Popular
          </div>

          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Crown size={20} className="text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                  <Sparkles size={10} /> Recommended
                </div>
                <h3 className="text-2xl font-bold font-outfit uppercase tracking-widest">Premium Pro</h3>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold font-outfit">₹10</span>
              <span className="text-muted-foreground">/year</span>
            </div>
            <p className="text-sm text-muted-foreground italic">Full power unlock — professionally standout avvu 🔥</p>
          </div>

          <div className="space-y-4 flex-1 relative z-10">
            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest mb-2">
              <Check size={14} /> Everything in Free, plus:
            </div>
            {premiumFeatures.map((f, i) => (
              <div key={i} className="flex items-start gap-3 text-sm group/item">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary group-hover/item:bg-primary/20 transition-colors">
                  {f.icon}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{f.title}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href={isLoggedIn ? "/dashboard/payments/upgrade" : "/signup"} className="btn-primary w-full text-center flex items-center justify-center gap-2 animate-pulse-glow relative z-10">
            {isLoggedIn ? "Upgrade Now" : "Unlock Premium"} <Zap size={18} />
          </Link>

          <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] italic opacity-60 relative z-10">
            <ShieldCheck size={12} /> Secure Manual Verification
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ COMPARISON TABLE ═══════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.7 }}
        className="w-full max-w-4xl px-4"
      >
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold font-outfit">
            Feature <span className="text-primary italic">Comparison</span>
          </h2>
          <p className="text-muted-foreground">Side-by-side chudandi — meeku edi bestో decide cheyyandi</p>
        </div>

        <div className="card-premium p-0 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-white/5 border-b border-white/10 font-bold text-sm uppercase tracking-widest">
            <span className="text-muted-foreground">Feature</span>
            <span className="text-center">Free</span>
            <span className="text-center text-primary">Premium</span>
          </div>

          {/* Table Rows */}
          {comparisonData.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className={`grid grid-cols-3 gap-4 px-6 py-4 text-sm items-center ${i !== comparisonData.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/[0.02] transition-colors`}
            >
              <span className="font-medium">{row.feature}</span>
              <span className="text-center">
                {row.free === true ? <Check size={18} className="text-green-400 mx-auto" /> :
                 row.free === false ? <X size={18} className="text-destructive/50 mx-auto" /> :
                 <span className="text-muted-foreground text-xs">{row.free}</span>}
              </span>
              <span className="text-center">
                {row.premium === true ? <Check size={18} className="text-primary mx-auto" /> :
                 row.premium === false ? <X size={18} className="text-destructive/50 mx-auto" /> :
                 <span className="text-primary font-semibold text-xs">{row.premium}</span>}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════ HOW MANUAL PAYMENT WORKS ═══════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.7 }}
        className="max-w-4xl w-full card-premium p-12 text-center space-y-10"
      >
        <div className="space-y-3">
          <h2 className="text-3xl font-bold font-outfit">
            How <span className="text-primary italic">Upgrade</span> works?
          </h2>
          <p className="text-sm text-muted-foreground">Simple 3-step manual process — 5 minutes lo done!</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          <PaymentStep number="01" title="Pay ₹10" desc="Dashboard lo UPI QR code scan chesi ₹10 pay cheyyi." icon={<CreditCardIcon />} />
          <PaymentStep number="02" title="Screenshot Upload" desc="Payment confirmation screenshot upload cheyyi." icon={<UploadIcon />} />
          <PaymentStep number="03" title="Get Verified" desc="Admin verify chesi 1-24 hours lo Premium activate chestharu." icon={<ShieldCheck size={24} />} />
        </div>

        <div className="text-sm text-muted-foreground italic bg-white/5 p-4 rounded-xl border border-white/10 inline-block">
          Typical activation time: <span className="text-foreground font-bold">1 to 24 hours</span> after submission.
        </div>
      </motion.section>

      {/* ═══════════════ FUTURE ADD-ONS TEASER ═══════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.7 }}
        className="w-full max-w-4xl px-4 text-center space-y-8"
      >
        <div className="space-y-3">
          <h2 className="text-3xl font-bold font-outfit">
            Coming <span className="text-primary italic">Soon</span> 🚀
          </h2>
          <p className="text-muted-foreground text-sm">Premium users ki first access vasthundi</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🤖', label: 'AI Resume Suggestions' },
            { icon: '🐙', label: 'GitHub Auto Import' },
            { icon: '📱', label: 'QR Code Share' },
            { icon: '🤝', label: 'Recruiter Connect' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="card-premium p-6 flex flex-col items-center gap-3 text-center group cursor-default"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.7 }}
        className="w-full max-w-3xl px-4 space-y-8"
      >
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold font-outfit">
            Frequently Asked <span className="text-primary italic">Questions</span>
          </h2>
          <p className="text-muted-foreground text-sm">Common doubts — clear answers</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-premium p-0 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="font-semibold text-sm pr-4">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-muted-foreground flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-primary' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-white/5 pt-4">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════ BOTTOM CTA ═══════════════ */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }} transition={{ duration: 0.7 }}
        className="w-full max-w-3xl px-4 text-center"
      >
        <div className="card-premium p-12 border-primary/20 relative overflow-hidden">
          <div className="absolute inset-0 shimmer opacity-20 pointer-events-none" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold font-outfit">
              Ready to <span className="text-primary italic">stand out</span>?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Free ga start cheyyi, Premium tho professionally standout avvu. Nee career ki first step ikkade start avuthundi 🚀
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={isLoggedIn ? "/dashboard" : "/signup"} className="btn-primary flex items-center justify-center gap-2 px-8 shadow-2xl shadow-primary/20">
                {isLoggedIn ? "Go to Dashboard" : "Start Free"} <ArrowRight size={18} />
              </Link>
              <Link href={isLoggedIn ? "/dashboard/payments/upgrade" : "/signup"} className="btn-secondary flex items-center justify-center gap-2 px-8">
                Upgrade to Premium <Crown size={18} />
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

/* ═══════════════ SUB COMPONENTS ═══════════════ */

function PaymentStep({ number, title, desc, icon }: { number: string; title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="space-y-4 group">
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors mx-auto md:mx-0">
        {icon}
      </div>
      <div className="text-3xl font-black font-outfit text-primary opacity-20">{number}</div>
      <h4 className="font-bold uppercase tracking-widest text-sm">{title}</h4>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  )
}

function CreditCardIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}
