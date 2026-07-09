import React from 'react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-20 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 mb-8 transition-colors">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to Home
        </Link>
        <h1 className="text-4xl font-black text-white tracking-tight mb-8">Terms of Service</h1>
        
        <div className="space-y-8 text-slate-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-200 mb-3">1. Acceptance of Terms</h2>
            <p>By creating a CloudLedger account or accessing our services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-slate-200 mb-3">2. Description of Service</h2>
            <p>CloudLedger is a cloud-based CRM and financial management tool designed to integrate with on-premise accounting software such as TallyPrime. We provide tools for data visualization, syncing, and role-based data access.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-slate-200 mb-3">3. Subscription and Billing</h2>
            <p>Subscriptions are billed in advance on a recurring basis as per your selected plan (Growth Pro, Enterprise, etc.). We do not offer refunds for partial months of service. You may cancel your subscription at any time.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-slate-200 mb-3">4. Limitation of Liability</h2>
            <p>CloudLedger shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service, including data synchronization errors.</p>
          </section>
          
          <p className="text-sm mt-12 pt-8 border-t border-slate-800 text-slate-500">Last updated: July 2026</p>
        </div>
      </div>
    </div>
  );
}
