'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import themesData from '../config/themes.json';

export interface ThemeColors {
  bg: string;
  surface: string;
  'surface-muted': string;
  border: string;
  'border-hover': string;
  text: string;
  'text-muted': string;
  'text-subtle': string;
  accent: string;
  'accent-hover': string;
  'accent-soft': string;
  'accent-gradient': string;
  success: string;
  error: string;
}

export interface ThemeDefinition {
  id: string;
  name: string;
  requiredPlan: string;
  preview: string[];
  colors: ThemeColors;
}

interface ThemeContextType {
  theme: string;
  setTheme: (themeId: string) => void;
  availableThemes: ThemeDefinition[];
  currentTheme: ThemeDefinition;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const PLAN_HIERARCHY: Record<string, number> = {
  FREE: 0,
  GROWTH: 1,
  ENTERPRISE: 2,
};

export function ThemeProvider({
  children,
  subscriptionPlan = 'FREE',
}: {
  children: React.ReactNode;
  subscriptionPlan?: string;
}) {
  const [theme, setThemeState] = useState<string>('dark');

  // Load from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('cl-theme');
    if (savedTheme) {
      // Validate theme access against plan
      const targetTheme = themesData.find((t) => t.id === savedTheme);
      if (targetTheme) {
        const requiredLevel = PLAN_HIERARCHY[targetTheme.requiredPlan] ?? 0;
        const currentLevel = PLAN_HIERARCHY[subscriptionPlan] ?? 0;
        if (currentLevel >= requiredLevel) {
          setThemeState(savedTheme);
          applyThemeVariables(targetTheme);
          return;
        }
      }
    }
    // Default to dark theme
    const defaultTheme = themesData.find((t) => t.id === 'dark');
    if (defaultTheme) {
      applyThemeVariables(defaultTheme);
    }
  }, [subscriptionPlan]);

  const setTheme = (themeId: string) => {
    const targetTheme = themesData.find((t) => t.id === themeId);
    if (!targetTheme) return;

    // Check plan access
    const requiredLevel = PLAN_HIERARCHY[targetTheme.requiredPlan] ?? 0;
    const currentLevel = PLAN_HIERARCHY[subscriptionPlan] ?? 0;

    if (currentLevel < requiredLevel) {
      console.warn(`Theme ${themeId} requires plan level ${targetTheme.requiredPlan}`);
      return;
    }

    setThemeState(themeId);
    localStorage.setItem('cl-theme', themeId);
    applyThemeVariables(targetTheme);
  };

  const applyThemeVariables = (themeDef: ThemeDefinition) => {
    const root = document.documentElement;
    
    // Set custom data attribute for theme-specific scoping (e.g. for light mode specific overrides)
    root.setAttribute('data-theme', themeDef.id);

    // Apply each color configuration as a CSS custom property
    Object.entries(themeDef.colors).forEach(([key, value]) => {
      root.style.setProperty(`--cl-${key}`, value);
    });
  };

  const availableThemes = themesData as ThemeDefinition[];
  const currentTheme = (themesData.find((t) => t.id === theme) || themesData[0]) as ThemeDefinition;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
