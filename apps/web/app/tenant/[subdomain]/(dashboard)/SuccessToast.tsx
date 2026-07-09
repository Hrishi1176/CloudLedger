'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export function SuccessToast() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (success) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 4000); // hide after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (!visible || !success) return null;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-emerald-950/95 backdrop-blur-md border border-emerald-500/30 text-emerald-400 py-3 px-5 rounded-full flex items-center gap-3 shadow-2xl shadow-emerald-900/20 animate-in fade-in slide-in-from-top-8 duration-300">
      <div className="bg-emerald-500/20 rounded-full p-1">
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="font-medium text-sm">Successfully added {success}!</span>
    </div>
  );
}
