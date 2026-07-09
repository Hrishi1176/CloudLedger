'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export function ErrorToast() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000); // hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!visible || !error) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-red-950/95 backdrop-blur-md border border-red-500/30 text-red-400 py-3 px-5 rounded-full flex items-center gap-3 shadow-2xl shadow-red-900/20 animate-in fade-in slide-in-from-top-8 duration-300">
      <div className="bg-red-500/20 rounded-full p-1">
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <span className="font-medium text-sm">{decodeURIComponent(error)}</span>
    </div>
  );
}
