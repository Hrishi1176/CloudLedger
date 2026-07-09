import Link from 'next/link';
import WorkspaceList from './WorkspaceList';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    accent: 'from-indigo-500 to-indigo-700',
    glow: 'bg-indigo-500/10 text-indigo-400',
    title: 'Dedicated Workspaces',
    desc: 'Every organization gets a completely isolated workspace. Your data is private, secure, and accessible from anywhere.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
    accent: 'from-purple-500 to-purple-700',
    glow: 'bg-purple-500/10 text-purple-400',
    title: 'Complete Accounting ERP',
    desc: 'Manage ledgers, trial balances, and double-entry bookkeeping seamlessly with our professional grade accounting engine.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    accent: 'from-emerald-500 to-emerald-700',
    glow: 'bg-emerald-500/10 text-emerald-400',
    title: 'Advanced Inventory Tracking',
    desc: 'Track stock levels, opening balances, and calculate real-time inventory valuation automatically as you record sales.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    accent: 'from-amber-500 to-amber-700',
    glow: 'bg-amber-500/10 text-amber-400',
    title: 'Real-time Financial Dashboards',
    desc: 'Monitor revenue, outstanding receivables, and business growth with live, interactive charts and KPI metrics.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    accent: 'from-cyan-500 to-cyan-700',
    glow: 'bg-cyan-500/10 text-cyan-400',
    title: 'Flexible Vouchers & Invoicing',
    desc: 'Generate sales, purchase, receipt, and journal vouchers instantly. Automate your daily transaction recording.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    accent: 'from-pink-500 to-pink-700',
    glow: 'bg-pink-500/10 text-pink-400',
    title: 'Automated Trial Balance',
    desc: 'Say goodbye to manual reconciliation. Our system automatically balances your books and generates real-time reports.',
  },
];

import { SUBSCRIPTION_PLANS } from '@sales-crm/shared';
import { adminDb } from '@sales-crm/database';

export default async function MarketingPage() {
  const plansData = [...SUBSCRIPTION_PLANS];
  
  // Sort plans correctly
  const order = { 'FREE': 1, 'STARTER': 2, 'BASIC': 3, 'PRO': 4, 'PREMIUM': 5, 'ENTERPRISE': 6 };
  plansData.sort((a, b) => (order[a.code as keyof typeof order] || 99) - (order[b.code as keyof typeof order] || 99));

  const pricingPlans = plansData.map((p) => {
    // Default to 'IN' for the marketing page
    const pricing = p.pricing.find((pr) => pr.country === 'IN') || p.pricing[0];
    return {
      name: p.name,
      price: pricing.pricingText,
      period: p.period || '',
      desc: p.description,
      features: p.featuresList,
      cta: p.code === 'FREE' ? 'Start Free' : p.code === 'ENTERPRISE' ? 'Contact Sales' : 'Get Started',
      gradient: `from-${p.accentFrom.split('-')[1]}-600 to-${p.accentTo.split('-')[1]}-700`,
      border: p.marketingHighlight ? `border-${p.accentFrom.split('-')[1]}-500/50` : p.code === 'FREE' ? 'border-slate-800' : `border-${p.accentFrom.split('-')[1]}-500/30`,
      highlight: p.marketingHighlight,
    };
  });

  // Fetch real workspaces from database
  const organizations = await adminDb.organization.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">

      {/* ── Background glows ── */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-0 left-[15%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-indigo-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-[5%] w-[40vw] h-[40vw] max-w-[550px] max-h-[550px] bg-purple-600/8 rounded-full blur-[100px]" />
      </div>

      {/* ── Navbar ── */}
      <header className="relative z-20 w-full border-b border-slate-800/40 bg-slate-950/80 backdrop-blur-xl sticky top-0">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <img src="/logo.png" alt="CloudLedger Logo" className="h-9 w-9 rounded-xl shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform" />
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              CloudLedger
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400 font-medium" aria-label="Main navigation">
            <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
            <a href="#pricing"  className="hover:text-white transition-colors duration-200">Pricing</a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/20 whitespace-nowrap"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">

        {/* ── Hero ── */}
        <section className="w-full px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-28 pb-16 sm:pb-24 md:pb-32 text-center">
          <div className="mx-auto max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-xs font-bold text-indigo-400 tracking-widest uppercase mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Multi-tenant Cloud ERP
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.08] tracking-tight mb-6">
              <span className="bg-gradient-to-b from-white via-white to-slate-400 bg-clip-text text-transparent block">
                The Modern Ledger
              </span>
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block">
                Built for Scale
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
              Empower your business with a professional grade CRM and accounting platform. Secure, lightning-fast, and built for growth.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-14">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-2xl shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Start Free — No Credit Card
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all"
              >
                Explore Features →
              </a>
            </div>

            {/* Live Analytics Dashboard Chart */}
            <div className="relative mx-auto mt-16 mb-20 max-w-5xl group perspective-1000 text-left">
              <div className="transform group-hover:scale-[1.02] transition-transform duration-700 ease-out">
                <WorkspaceList workspaces={organizations} />
              </div>
            </div>

            {/* Animated Stats row */}
            <div className="relative mx-auto mt-14 max-w-4xl p-1 rounded-[2rem] bg-gradient-to-r from-slate-800 via-indigo-500/30 to-purple-500/30 hover:from-indigo-500/40 hover:to-purple-500/40 transition-all duration-700 shadow-2xl overflow-hidden group">
              {/* Moving shine effect background */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out skew-x-12" />
              
              <div className="relative flex flex-row flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 bg-slate-950/80 backdrop-blur-md rounded-[1.8rem] py-8 px-6">
                <div className="text-center transition-transform hover:scale-110 duration-300 cursor-default">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-none">Double Entry</p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 font-semibold tracking-wide uppercase">Accounting</p>
                </div>

                <div className="text-center transition-transform hover:scale-110 duration-300 cursor-default">
                  <div className="flex items-center justify-center gap-3">
                    <span className="relative flex h-3 w-3 md:h-4 md:w-4 -mt-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 duration-1000"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 md:h-4 md:w-4 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                    </span>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-none">Real-time</p>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 font-semibold tracking-wide uppercase">Ledger Sync</p>
                </div>

                <div className="text-center transition-transform hover:scale-110 duration-300 cursor-default">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-none animate-pulse">100%</p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 font-semibold tracking-wide uppercase">Isolated Data</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="w-full px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-14">
              <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">Platform Features</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">Everything your team needs</h2>
              <p className="text-slate-400 text-base mt-4 max-w-xl mx-auto leading-relaxed">
                From multi-tenant isolation to AI Copilot automation — built for scale from day one.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="group p-6 sm:p-7 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-slate-700/60 hover:bg-slate-900/80 transition-all duration-300 space-y-4"
                >
                  <div className={`h-12 w-12 rounded-2xl ${f.glow} flex items-center justify-center shrink-0`}>
                    {f.icon}
                  </div>
                  <h3 className="text-base font-bold text-white">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ── Pricing ── */}
        <section id="pricing" className="w-full px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-14">
              <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">Simple Pricing</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">Choose your plan</h2>
              <p className="text-slate-400 text-base mt-4">Start free, upgrade when you need more power.</p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3 items-start">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative flex flex-col rounded-3xl border p-7 sm:p-8 bg-slate-900 transition-all duration-300 ${
                    plan.highlight
                      ? 'border-indigo-500/50 ring-1 ring-indigo-500/30 shadow-2xl shadow-indigo-500/10 md:scale-[1.03]'
                      : plan.border + ' hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg whitespace-nowrap">
                      Most Popular
                    </div>
                  )}
                  <div className="space-y-2 mb-6">
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">{plan.desc}</p>
                  </div>
                  <div className="flex items-baseline gap-1 mb-7">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-slate-500 text-sm">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                        <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className={`block text-center py-3.5 rounded-2xl font-bold text-sm transition-all ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:scale-[1.01]'
                        : 'border border-slate-700 hover:border-slate-600 hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Footer CTA ── */}
        <section className="w-full px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24">
          <div className="mx-auto max-w-4xl">
            <div className="space-y-6 rounded-3xl border border-indigo-500/15 bg-gradient-to-br from-indigo-950/60 to-slate-900 px-6 py-12 text-center sm:px-10 sm:py-16 md:py-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">Ready to get started?</h2>
              <p className="text-slate-400 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                Create your organization in under 60 seconds. No credit card required.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all hover:scale-[1.02] shadow-2xl shadow-indigo-500/20"
              >
                Create Free Workspace
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-slate-800/50 py-16 px-4 sm:px-6 lg:px-8 mt-12 bg-slate-950">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-6">
                <img src="/logo.png" alt="CloudLedger Logo" className="h-8 w-8 rounded-lg" />
                <span className="font-bold text-lg text-slate-200">CloudLedger</span>
              </div>
              <p className="text-slate-400 text-sm max-w-sm leading-relaxed mb-6">
                The modern layer for your financial data. Seamlessly connecting multi-tenant isolation, real-time analytics, and AI automation.
              </p>
              <div className="flex gap-4">
                {/* Social icons placeholders */}
                <a href="#" className="text-slate-500 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>
                </a>
                <a href="#" className="text-slate-500 hover:text-white transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Product</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-sm text-slate-400 hover:text-white transition-colors">Pricing</a></li>
                <li><Link href="/register" className="text-sm text-slate-400 hover:text-white transition-colors">Register</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Company</h3>
              <ul className="space-y-3">
                <li><Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Legal</h3>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-sm text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-slate-400 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">© {new Date().getFullYear()} CloudLedger. All rights reserved.</p>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> All systems operational
              </span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
