'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider';

const PLAN_HIERARCHY: Record<string, number> = {
  FREE: 0,
  GROWTH: 1,
  ENTERPRISE: 2,
};

export default function ThemeSelector({
  subscriptionPlan = 'FREE',
}: {
  subscriptionPlan?: string;
}) {
  const { theme, setTheme, availableThemes, currentTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userLevel = PLAN_HIERARCHY[subscriptionPlan] ?? 0;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition-all focus:outline-none"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {/* Color preview swatches */}
        <div className="flex -space-x-1">
          {currentTheme.preview.map((color, idx) => (
            <span
              key={idx}
              className="h-3 w-3 rounded-full border border-slate-950 shrink-0"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span className="hidden sm:inline">{currentTheme.name}</span>
        <svg
          className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-800 bg-slate-950 p-2 shadow-2xl z-50">
          <div className="px-3 py-2 border-b border-slate-900 mb-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Theme</p>
          </div>
          <div className="space-y-1">
            {availableThemes.map((t) => {
              const themeLevel = PLAN_HIERARCHY[t.requiredPlan] ?? 0;
              const isLocked = userLevel < themeLevel;

              return (
                <button
                  key={t.id}
                  disabled={isLocked}
                  onClick={() => {
                    setTheme(t.id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isLocked
                      ? 'opacity-40 cursor-not-allowed'
                      : theme === t.id
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Swatches */}
                    <div className="flex -space-x-1.5 shrink-0">
                      {t.preview.map((color, idx) => (
                        <span
                          key={idx}
                          className="h-3 w-3 rounded-full border border-slate-950"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span>{t.name}</span>
                  </div>

                  {isLocked ? (
                    <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      {t.requiredPlan}
                    </div>
                  ) : (
                    theme === t.id && (
                      <svg className="w-4.5 h-4.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
