import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { verifyJWT } from '@sales-crm/auth';
import { redirect } from 'next/navigation';
import { adminDb } from '@sales-crm/database';
import { SUBSCRIPTION_PLANS } from '@sales-crm/shared';
import { ToastProvider } from '../ToastProvider';
import SidebarNav from '../SidebarNav';
import { ThemeProvider } from '../../../components/ThemeProvider';
import ThemeSelector from '../../../components/ThemeSelector';
import AiCopilot from '../AiCopilot';

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;

  const tokenStore = await cookies();
  const token = tokenStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  const payload = await verifyJWT(token);
  if (!payload || payload.subdomain !== subdomain) {
    redirect('/login');
  }

  const org = await adminDb.organization.findUnique({ where: { subdomain } });
  const subscriptionPlanCode = org?.subscriptionPlan || 'FREE';
  const planConfig = SUBSCRIPTION_PLANS.find(p => p.code === subscriptionPlanCode);
  const allowedModules = planConfig?.allowedModules || ['dashboard'];

  return (
    <ThemeProvider subscriptionPlan={subscriptionPlanCode}>
      <ToastProvider>
        <div className="flex min-h-screen w-full bg-slate-950 text-slate-100 overflow-hidden">

          {/* ── Sidebar (desktop persistent, mobile drawer via SidebarNav) ── */}
          <SidebarNav
            subdomain={subdomain}
            role={payload.role}
            subscriptionPlan={subscriptionPlanCode}
            allowedModules={allowedModules}
            userEmail={payload.email}
          />

          {/* ── Main content area ── */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

            {/* Top Navbar */}
            <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-800/60 bg-slate-900/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
              {/* Brand — on mobile shifts right to make room for hamburger */}
              <div className="flex items-center gap-2.5 pl-11 lg:pl-0 min-w-0">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
                  SL
                </div>
                <span className="font-semibold text-sm text-slate-200 capitalize truncate">{subdomain}</span>
              </div>

              {/* Desktop: welcome message */}
              <div className="hidden lg:block text-sm font-medium text-slate-400 truncate px-4">
                Welcome back,{' '}
                <span className="text-white font-semibold">{payload.email.split('@')[0]}</span>
              </div>

              {/* Right: theme selector + status + plan badge */}
              <div className="flex items-center gap-2.5 shrink-0">
                <ThemeSelector subscriptionPlan={subscriptionPlanCode} />
                
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="hidden md:inline">Connected</span>
                </div>
                
                <div className="flex items-center px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-semibold text-indigo-400 uppercase tracking-wide">
                  {subscriptionPlanCode}
                </div>
              </div>
            </header>

            {/* Content Router */}
            <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-5 md:p-6 lg:p-8">
              <div className="mx-auto max-w-7xl">
                {children}
              </div>
            </main>
          </div>
        </div>
        <AiCopilot />
      </ToastProvider>
    </ThemeProvider>
  );
}
