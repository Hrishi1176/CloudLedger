import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-20 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 mb-8 transition-colors">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to Home
        </Link>
        <h1 className="text-4xl font-black text-white tracking-tight mb-8">Privacy Policy</h1>
        
        <div className="space-y-8 text-slate-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-200 mb-3">1. Information We Collect</h2>
            <p>At CloudLedger, we collect the minimum amount of information necessary to provide our CRM and financial synchronization services. This includes your name, email address, company details, and the financial data you choose to sync via our Tally integration.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-slate-200 mb-3">2. How We Use Your Data</h2>
            <p>Your data is used exclusively to provide you with the CloudLedger services. We do not sell your personal or financial data to third parties. Data is isolated using multi-tenant architecture to ensure maximum privacy.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-slate-200 mb-3">3. Security</h2>
            <p>We employ industry-standard security measures including HTTP-only JWT cookies, encrypted data transmission, and strict role-based access control (RBAC) to protect your information.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-slate-200 mb-3">4. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@cloudledger.com.</p>
          </section>
          
          <p className="text-sm mt-12 pt-8 border-t border-slate-800 text-slate-500">Last updated: July 2026</p>
        </div>
      </div>
    </div>
  );
}
