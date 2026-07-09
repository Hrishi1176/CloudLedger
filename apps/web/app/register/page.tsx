'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Mini toast for the register page
function useLocalToast() {
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const show = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4500);
  };
  return { toast, show };
}

const TOAST_STYLES = {
  success: { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-300', icon: '✓' },
  error:   { bg: 'bg-red-500/10 border-red-500/30',         text: 'text-red-300',     icon: '✕' },
  info:    { bg: 'bg-indigo-500/10 border-indigo-500/30',   text: 'text-indigo-300',  icon: 'ℹ' },
};

function getDomainSuffix() {
  if (typeof window === 'undefined') return '.localhost';
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
    return '.localhost';
  }
  const parts = hostname.split('.');
  if (parts.length >= 2) {
    return `.${parts.slice(-2).join('.')}`;
  }
  return '.localhost';
}

export default function RegisterPage() {
  const { toast, show } = useLocalToast();
  const [form, setForm] = useState({ name: '', email: '', password: '', companyName: '', subdomain: '', country: 'IN', plan: 'FREE' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [createdSubdomain, setCreatedSubdomain] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      setCreatedSubdomain(form.subdomain);
      setStatus('success');
      show('Organization created successfully!', 'success');
    } catch (err: any) {
      setStatus('idle');
      show(err.message || 'Something went wrong. Please try again.', 'error');
    }
  };

  const getSubdomainUrl = () => {
    if (typeof window === 'undefined') return '#';
    const port = window.location.port ? `:${window.location.port}` : '';
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
      return `http://${createdSubdomain}.localhost${port}/login`;
    }
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      const mainDomain = parts.slice(-2).join('.');
      const protocol = window.location.protocol;
      return `${protocol}//${createdSubdomain}.${mainDomain}${port}/login`;
    }
    return `http://${createdSubdomain}.localhost${port}/login`;
  };

  // ── Success Screen ─────────────────────────────────────────────────────────

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden"
           style={{ fontFamily: 'var(--font-sans, Inter, sans-serif)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[5%]  w-[400px] h-[400px] bg-indigo-600/10  rounded-full blur-[100px]" />
        </div>

        <div className="relative w-full max-w-md space-y-6 text-center sm:max-w-lg">
          <div className="h-24 w-24 mx-auto rounded-[2rem] bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.2)] animate-[bounce_2s_infinite]">
            <svg className="w-12 h-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="rounded-[2rem] border border-slate-800/60 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/50 backdrop-blur-xl space-y-6">
            <div>
              <h2 className="text-3xl font-black text-white">Workspace Ready!</h2>
              <p className="text-slate-400 text-base mt-3 leading-relaxed">
                Your CloudLedger instance for <span className="font-bold text-white">{form.companyName}</span> has been securely provisioned.
              </p>
            </div>

            <div className="p-5 bg-slate-950/80 rounded-2xl border border-indigo-500/30 font-mono text-sm text-indigo-400 select-all text-center break-all shadow-inner">
              {createdSubdomain}{getDomainSuffix()}
            </div>

            <a
              href={getSubdomainUrl()}
              className="block w-full py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/25 text-center text-white"
            >
              Sign In to Portal →
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── Split Screen Registration Layout ───────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row relative overflow-hidden"
         style={{ fontFamily: 'var(--font-sans, Inter, sans-serif)' }}>

      {/* Floating Toast */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:max-w-sm flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl toast-enter-right ${TOAST_STYLES[toast.type].bg} ${TOAST_STYLES[toast.type].text}`}
             style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <span className="font-bold text-sm shrink-0">{TOAST_STYLES[toast.type].icon}</span>
          <span className="text-sm font-medium">{toast.msg}</span>
        </div>
      )}

      {/* ── Left Side: Form ── */}
      <div className="w-full md:w-[50%] lg:w-[45%] xl:w-[40%] flex flex-col justify-center px-6 py-12 sm:px-12 md:px-16 z-10 relative bg-slate-950 shadow-2xl shadow-indigo-500/10 border-r border-slate-800/50">
        
        {/* Subtle glow behind form */}
        <div className="absolute top-0 left-0 w-full h-full bg-indigo-500/5 blur-[150px] pointer-events-none" />

        <div className="w-full max-w-md mx-auto space-y-10 relative z-10">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
              <img src="/logo.png" alt="CloudLedger Logo" className="h-10 w-10 rounded-xl shadow-lg shadow-indigo-500/25 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-black text-xl text-white tracking-tight">CloudLedger</span>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Create your <br/> <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">secure workspace</span>
            </h1>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed font-medium">
              Join thousands of businesses scaling their financial operations on CloudLedger. No credit card required.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div className="space-y-2 group">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest group-focus-within:text-indigo-400 transition-colors">Full Name</label>
                <input
                  type="text" name="name" required value={form.name} onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3.5 bg-slate-900/50 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all outline-none"
                />
              </div>

              {/* Email */}
              <div className="space-y-2 group">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest group-focus-within:text-indigo-400 transition-colors">Work Email</label>
                <input
                  type="email" name="email" required value={form.email} onChange={handleChange}
                  placeholder="you@company.com"
                  className="w-full px-4 py-3.5 bg-slate-900/50 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2 group">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest group-focus-within:text-indigo-400 transition-colors">Secure Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} name="password" required value={form.password} onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  className="w-full pr-12 px-4 py-3.5 bg-slate-900/50 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all outline-none"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute inset-y-0 right-0 px-4 text-slate-500 hover:text-indigo-400 transition-colors flex items-center justify-center">
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent my-2" />

            {/* Company Name */}
            <div className="space-y-2 group">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest group-focus-within:text-indigo-400 transition-colors">Company Name</label>
              <input
                type="text" name="companyName" required value={form.companyName} onChange={handleChange}
                placeholder="Acme Corp"
                className="w-full px-4 py-3.5 bg-slate-900/50 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all outline-none"
              />
            </div>

            {/* Subdomain */}
            <div className="space-y-2 group">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest group-focus-within:text-indigo-400 transition-colors">Workspace URL</label>
              <div className="flex rounded-xl bg-slate-900/50 border border-slate-800 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all overflow-hidden">
                <input
                  type="text" name="subdomain" required value={form.subdomain} onChange={handleSubdomainChange}
                  placeholder="acme"
                  className="flex-1 px-4 py-3.5 bg-transparent border-0 focus:ring-0 text-sm text-white placeholder-slate-600 outline-none"
                />
                <span className="flex items-center px-5 bg-slate-800/30 border-l border-slate-800 text-[13px] font-bold text-slate-400 select-none tracking-wide">
                  {getDomainSuffix()}
                </span>
              </div>
            </div>
            
            {/* Country and Plan side-by-side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Country */}
              <div className="space-y-2 group">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest group-focus-within:text-indigo-400 transition-colors">Operating Country</label>
                <select name="country" value={form.country} onChange={(e: any) => handleChange(e)} className="w-full px-4 py-3.5 bg-slate-900/50 border border-slate-800 rounded-xl text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all outline-none appearance-none cursor-pointer">
                  <option value="IN">India (INR ₹)</option>
                  <option value="US">United States (USD $)</option>
                </select>
              </div>

              {/* Plan Selection */}
              <div className="space-y-2 group">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest group-focus-within:text-indigo-400 transition-colors">Subscription Plan</label>
                <select name="plan" value={form.plan} onChange={(e: any) => handleChange(e)} className="w-full px-4 py-3.5 bg-slate-900/50 border border-slate-800 rounded-xl text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all outline-none appearance-none cursor-pointer">
                  <option value="FREE">Free Tier ($0/mo)</option>
                  <option value="STARTER">Starter ($29/mo)</option>
                  <option value="BASIC">Basic ($49/mo)</option>
                  <option value="PRO">Professional ($99/mo)</option>
                  <option value="PREMIUM">Premium ($199/mo)</option>
                  <option value="ENTERPRISE">Enterprise (Custom)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-4 mt-4 rounded-xl font-black text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-70 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-500/25 flex justify-center items-center gap-2.5 cursor-pointer text-white"
            >
              {status === 'loading' ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Provisioning Workspace...
                </>
              ) : (
                'Create Workspace →'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 font-medium">
            Already have an account?{' '}
            <span className="text-slate-400">Go to </span>
            <code className="text-indigo-400 font-mono bg-indigo-500/10 px-1.5 py-0.5 rounded">your-workspace{getDomainSuffix()}</code>
          </p>
        </div>
      </div>

      {/* ── Right Side: Visual Presentation ── */}
      <div className="hidden md:flex flex-1 relative bg-slate-900 border-l border-slate-800/60 items-center justify-center p-12 overflow-hidden">
        
        {/* Dynamic Glows */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
        
        <div className="relative max-w-2xl text-center space-y-8 z-10">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-5xl font-black text-white leading-[1.1] tracking-tight">
              The Modern Layer for <br/>
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Financial Data</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">
              Experience lightning-fast accounting with real-time sync, multi-tenant isolation, and complete data security.
            </p>
          </div>
          
          {/* Mockup Floating Container */}
          <div className="relative mx-auto mt-12 rounded-[2rem] overflow-hidden shadow-[0_30px_100px_rgba(99,102,241,0.3)] border border-slate-700/50 transform group transition-transform duration-700 ease-out hover:scale-105"
               style={{ perspective: '1000px' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 pointer-events-none" />
            <img src="/analytics.png" alt="Dashboard Mockup" className="w-full h-auto object-cover transform" />
            
            {/* Overlay Badges */}
            <div className="absolute top-6 left-6 z-20 flex flex-col gap-3">
              <div className="px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700 shadow-xl flex items-center gap-2 animate-bounce" style={{ animationDuration: '3s' }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Live Sync</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-6 pt-6">
             <div className="flex items-center gap-2">
               <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
               <span className="text-sm font-semibold text-slate-300">SOC2 Certified</span>
             </div>
             <div className="flex items-center gap-2">
               <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
               <span className="text-sm font-semibold text-slate-300">99.9% Uptime</span>
             </div>
             <div className="flex items-center gap-2">
               <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
               <span className="text-sm font-semibold text-slate-300">Isolated Data</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
