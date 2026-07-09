'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from './ToastProvider';

interface BillingPanelProps {
  currentPlan: string;
  country: string;
}

const CHECK = (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default function BillingPanel({ currentPlan, country }: BillingPanelProps) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/plans?country=${country}`)
      .then(res => res.json())
      .then(data => setPlans(data))
      .catch(err => console.error(err));
  }, [country]);

  const handleSelectPlan = async (planId: string) => {
    // Temporarily disabled plan upgrades for testing phase
    addToast('Features coming soon for paid plans. Currently in testing phase!', 'info');
    return;

    /*
    setLoading(planId);
    try {
      const res = await fetch('/api/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update plan');

      addToast(`Successfully switched to ${planId} plan!`, 'success');
      setTimeout(() => window.location.reload(), 1200);
    } catch (err: any) {
      addToast(err.message || 'Could not update plan. Please try again.', 'error');
      setLoading(null);
    }
    */
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Subscription & Billing</h2>
        <p className="text-slate-400 text-sm mt-2">
          Manage your plan and unlock ERP features. Current plan:{' '}
          <span className="font-bold text-indigo-400 uppercase">{currentPlan}</span>
        </p>
      </div>

      {/* Plan Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan.toUpperCase();
          const isLoading = loading === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl border bg-slate-900 p-5 transition-all duration-300 sm:p-7 ${
                isCurrent
                  ? `ring-2 ${plan.ring} border-transparent shadow-2xl ${plan.glow}`
                  : 'border-slate-800/60 hover:border-slate-700/60'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute -top-3 right-6 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${plan.accentFrom} ${plan.accentTo} text-white shadow-lg`}>
                  {plan.badge}
                </div>
              )}

              {/* Plan name & desc */}
              <div className="space-y-2 mb-6">
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{plan.description}</p>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-1 mb-7">
                <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                {plan.period && <span className="text-slate-500 text-sm">{plan.period}</span>}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <span className="text-indigo-400 mt-0.5">{CHECK}</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => !isCurrent && handleSelectPlan(plan.id)}
                disabled={isCurrent || !!loading}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all flex justify-center items-center gap-2 cursor-pointer ${
                  isCurrent
                    ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-default'
                    : `bg-gradient-to-r ${plan.accentFrom} ${plan.accentTo} text-white hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] shadow-lg disabled:opacity-50`
                }`}
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Updating…
                  </>
                ) : isCurrent ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Current Plan
                  </>
                ) : (
                  `Switch to ${plan.name}`
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Enterprise CTA banner */}
      <div className="rounded-2xl border border-slate-800/60 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-bold text-white text-sm">Need a custom enterprise contract?</p>
          <p className="text-slate-400 text-xs mt-1">Volume discounts, dedicated support, and custom SLA available.</p>
        </div>
        <a
          href="mailto:sales@cloudledger.io"
          className="shrink-0 px-5 py-2.5 rounded-xl border border-slate-700 hover:border-indigo-500/50 hover:bg-indigo-500/5 text-sm font-semibold text-slate-300 hover:text-white transition-all"
        >
          Contact Sales →
        </a>
      </div>
    </div>
  );
}
