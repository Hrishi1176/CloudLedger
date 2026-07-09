'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const Icons = {
  Dashboard: () => (
    <svg className="w-4.5 h-4.5 w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Customers: () => (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Products: () => (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  Sales: () => (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
    </svg>
  ),
  Reports: () => (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  Billing: () => (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  Lock: () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  Menu: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Close: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
};

// ─── Nav Items ────────────────────────────────────────────────────────────────

const menuItems = [
  { id: 'dashboard', label: 'Dashboard',        Icon: Icons.Dashboard, isModule: false },
  { id: 'chart-of-accounts', label: 'Chart of Accounts', Icon: Icons.Customers, isModule: true, moduleName: 'chart-of-accounts' },
  { id: 'items',  label: 'Inventory Items',  Icon: Icons.Products,  isModule: true, moduleName: 'items' },
  { id: 'vouchers',     label: 'Vouchers',  Icon: Icons.Sales,     isModule: true, moduleName: 'vouchers' },
  { id: 'reports',     label: 'Financial Reports',        Icon: Icons.Reports,     isModule: true, moduleName: 'reports' },
  { id: 'billing',   label: 'Subscription',      Icon: Icons.Billing,   isModule: false },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface SidebarNavProps {
  subdomain: string;
  role: string;
  subscriptionPlan: string;
  allowedModules: string[];
  userEmail: string;
  activeTab?: string;
  onClose?: () => void;
}

// ─── Sidebar Content (shared between drawer and desktop) ──────────────────────

function SidebarContent({
  subdomain,
  role,
  subscriptionPlan,
  allowedModules,
  userEmail,
  activeTab = 'dashboard',
  onClose,
}: SidebarNavProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo / Workspace Header */}
      <div className="px-5 py-5 border-b border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-lg shadow-indigo-500/20">
            {subdomain.substring(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-sm text-white capitalize truncate leading-tight">{subdomain}</h2>
            <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-widest">{role} Portal</span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all lg:hidden"
            aria-label="Close menu"
          >
            <Icons.Close />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Navigation</p>
        {menuItems.map(({ id, label, Icon, isModule, moduleName }) => {
          const isAllowed = !isModule || allowedModules.includes(moduleName!);
          const isActive = activeTab === id;
          return (
            <Link
              key={id}
              href={`?tab=${id}`}
              onClick={onClose}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className={isActive ? 'text-indigo-200' : 'text-slate-500 group-hover:text-slate-300 transition-colors'}>
                  <Icon />
                </span>
                {label}
              </span>
              {!isAllowed && (
                <span className="text-slate-600" title="Feature locked — upgrade plan">
                  <Icons.Lock />
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-800/60">
        <div className="px-3 py-2 mb-2">
          <p className="text-xs font-semibold text-white truncate">{userEmail.split('@')[0]}</p>
          <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>
        </div>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-800/60 hover:bg-red-500/10 hover:text-red-400 border border-slate-700/60 hover:border-red-500/30 transition-all text-slate-300 cursor-pointer"
          >
            <Icons.Logout />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function SidebarNav(props: SidebarNavProps) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close on resize to desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800/60 shrink-0">
        <SidebarContent {...props} activeTab={activeTab} />
      </aside>

      {/* ── Mobile Hamburger Button (aligned within the top bar) ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-30 h-8 w-8 rounded-lg border border-slate-800/60 bg-slate-900 flex items-center justify-center text-slate-300 shadow-lg transition-all hover:border-slate-700 hover:text-white lg:hidden"
        aria-label="Open menu"
      >
        <Icons.Menu />
      </button>

      {/* ── Mobile Backdrop ── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile Drawer ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] border-r border-slate-800/60 bg-slate-900 shadow-2xl sidebar-drawer lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent
          {...props}
          activeTab={activeTab}
          onClose={() => setMobileOpen(false)}
        />
      </aside>
    </>
  );
}
