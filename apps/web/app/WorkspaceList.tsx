import React from 'react';

export default function WorkspaceList({ workspaces }: { workspaces: any[] }) {
  if (!workspaces || workspaces.length === 0) {
    return (
      <div className="w-full min-h-[300px] bg-slate-900/50 rounded-[2rem] border border-slate-800 flex items-center justify-center">
        <p className="text-slate-500">No workspaces found. Be the first to create one!</p>
      </div>
    );
  }

  // Get domain suffix dynamically if possible, or fallback
  const domainSuffix = typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
    ? `.${window.location.hostname.split('.').slice(-2).join('.')}` 
    : '.localhost:3000';

  return (
    <div className="w-full bg-slate-950 p-6 sm:p-8 rounded-[2rem] border border-slate-800/80 shadow-[0_0_80px_rgba(99,102,241,0.15)] relative group text-left">
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Active Workspaces</h3>
          <p className="text-sm text-slate-500">Real-time tenant list</p>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800/80 shadow-inner">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 duration-1000"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
             </span>
             <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Live</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10 max-h-[400px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 transparent' }}>
        {workspaces.map((org) => (
          <a key={org.id} href={`http://${org.subdomain}${domainSuffix}/login`} target="_blank" rel="noreferrer" className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all hover:shadow-xl hover:shadow-indigo-500/10 group/card block cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 group-hover/card:scale-110 transition-transform">
                {org.name.substring(0, 2).toUpperCase()}
              </div>
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${org.subscriptionPlan === 'FREE' ? 'bg-slate-800 text-slate-400' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'}`}>
                {org.subscriptionPlan}
              </span>
            </div>
            <h4 className="text-white font-bold text-lg truncate group-hover/card:text-indigo-400 transition-colors">{org.name}</h4>
            <p className="text-slate-500 group-hover/card:text-indigo-300/80 text-sm font-mono mt-1 truncate transition-colors">
              {org.subdomain}{domainSuffix}
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
               <span>{new Date(org.createdAt).toLocaleDateString()}</span>
               <span className="flex items-center gap-1">
                 <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 {org.country}
               </span>
            </div>
          </a>
        ))}
      </div>
      
      {/* Decorative Glows */}
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
    </div>
  );
}
