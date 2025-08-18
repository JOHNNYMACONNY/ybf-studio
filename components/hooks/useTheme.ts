import { useState, useEffect, useCallback } from 'react';

type ThemeMode = 'light' | 'dark' | 'auto';
type ThemeVariant = 'default' | 'warm' | 'cool' | 'premium';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  shadow: string;
}

interface ThemeConfig {
  mode: ThemeMode;
  variant: ThemeVariant;
  colors: ThemeColors;
}

// Mathematical harmony color schemes
const THEME_COLORS: Record<ThemeMode, Record<ThemeVariant, ThemeColors>> = {
  light: {
    default: {
      primary: '#14b8a6', // Teal
      secondary: '#3b82f6', // Blue
      accent: '#FCA311', // Amber
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#0f172a',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    warm: {
      primary: '#FCA311', // Amber
      secondary: '#f59e0b', // Amber-600
      accent: '#14b8a6', // Teal
      background: '#ffffff',
      surface: '#fef3c7', // Amber-50
      text: '#0f172a',
      textSecondary: '#92400e', // Amber-800
      border: '#fde68a', // Amber-200
      shadow: 'rgba(251, 191, 36, 0.2)',
    },
    cool: {
      primary: '#14b8a6', // Teal
      secondary: '#0d9488', // Teal-600
      accent: '#3b82f6', // Blue
      background: '#ffffff',
      surface: '#ccfbf1', // Teal-50
      text: '#0f172a',
      textSecondary: '#134e4a', // Teal-800
      border: '#99f6e4', // Teal-200
      shadow: 'rgba(20, 184, 166, 0.2)',
    },
    premium: {
      primary: '#14b8a6', // Teal
      secondary: '#3b82f6', // Blue
      accent: '#FCA311', // Amber
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#0f172a',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      shadow: 'rgba(20, 184, 166, 0.15)',
    },
  },
  dark: {
    default: {
      primary: '#14b8a6', // Teal
      secondary: '#3b82f6', // Blue
      accent: '#FCA311', // Amber
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f8fafc',
      textSecondary: '#94a3b8',
      border: '#334155',
      shadow: 'rgba(0, 0, 0, 0.3)',
    },
    warm: {
      primary: '#FCA311', // Amber
      secondary: '#f59e0b', // Amber-600
      accent: '#14b8a6', // Teal
      background: '#0f172a',
      surface: '#451a03', // Amber-900
      text: '#f8fafc',
      textSecondary: '#fbbf24', // Amber-300
      border: '#78350f', // Amber-700
      shadow: 'rgba(251, 191, 36, 0.2)',
    },
    cool: {
      primary: '#14b8a6', // Teal
      secondary: '#0d9488', // Teal-600
      accent: '#3b82f6', // Blue
      background: '#0f172a',
      surface: '#042f2e', // Teal-900
      text: '#f8fafc',
      textSecondary: '#5eead4', // Teal-300
      border: '#134e4a', // Teal-700
      shadow: 'rgba(20, 184, 166, 0.2)',
    },
    premium: {
      primary: '#14b8a6', // Teal
      secondary: '#3b82f6', // Blue
      accent: '#FCA311', // Amber
      background: '#14151a',
      surface: '#191b22',
      text: '#f8fafc',
      textSecondary: '#94a3b8',
      border: '#334155',
      shadow: 'rgba(20, 184, 166, 0.2)',
    },
  },
  auto: {
    default: {
      primary: '#14b8a6',
      secondary: '#3b82f6',
      accent: '#FCA311',
      background: 'var(--background)',
      surface: 'var(--surface)',
      text: 'var(--text)',
      textSecondary: 'var(--text-secondary)',
      border: 'var(--border)',
      shadow: 'var(--shadow)',
    },
    warm: {
      primary: '#FCA311',
      secondary: '#f59e0b',
      accent: '#14b8a6',
      background: 'var(--background)',
      surface: 'var(--surface-warm)',
      text: 'var(--text)',
      textSecondary: 'var(--text-secondary-warm)',
      border: 'var(--border-warm)',
      shadow: 'var(--shadow-warm)',
    },
    cool: {
      primary: '#14b8a6',
      secondary: '#0d9488',
      accent: '#3b82f6',
      background: 'var(--background)',
      surface: 'var(--surface-cool)',
      text: 'var(--text)',
      textSecondary: 'var(--text-secondary-cool)',
      border: 'var(--border-cool)',
      shadow: 'var(--shadow-cool)',
    },
    premium: {
      primary: '#14b8a6',
      secondary: '#3b82f6',
      accent: '#FCA311',
      background: 'var(--background)',
      surface: 'var(--surface)',
      text: 'var(--text)',
      textSecondary: 'var(--text-secondary)',
      border: 'var(--border)',
      shadow: 'var(--shadow)',
    },
  },
};

const THEME_STORAGE_KEY = 'audioservice-theme';

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    // Initialize from localStorage or default
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // Fallback to default if parsing fails
        }
      }
    }
    
    return {
      mode: 'auto',
      variant: 'default',
      colors: THEME_COLORS.auto.default,
    };
  });

  // Get current effective theme mode (auto resolves to light/dark)
  const getEffectiveMode = useCallback((): 'light' | 'dark' => {
    if (theme.mode === 'auto') {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return 'light';
    }
    return theme.mode;
  }, [theme.mode]);

  // Get current theme colors
  const getCurrentColors = useCallback((): ThemeColors => {
    const effectiveMode = getEffectiveMode();
    return THEME_COLORS[effectiveMode][theme.variant];
  }, [theme.variant, getEffectiveMode]);

  // Update theme
  const updateTheme = useCallback((updates: Partial<ThemeConfig>) => {
    const newTheme = { ...theme, ...updates };
    setTheme(newTheme);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newTheme));
    }
  }, [theme]);

  // Set theme mode
  const setMode = useCallback((mode: ThemeMode) => {
    updateTheme({ mode });
  }, [updateTheme]);

  // Set theme variant
  const setVariant = useCallback((variant: ThemeVariant) => {
    updateTheme({ variant });
  }, [updateTheme]);

  // Toggle between light and dark
  const toggleMode = useCallback(() => {
    const currentMode = getEffectiveMode();
    const newMode = currentMode === 'light' ? 'dark' : 'light';
    setMode(newMode);
  }, [getEffectiveMode, setMode]);

  // Apply theme to document
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const colors = getCurrentColors();
    const root = document.documentElement;

    // Apply CSS custom properties
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply theme class
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(`theme-${getEffectiveMode()}`);

    // Apply variant class
    root.classList.remove('variant-default', 'variant-warm', 'variant-cool', 'variant-premium');
    root.classList.add(`variant-${theme.variant}`);

  }, [theme, getCurrentColors, getEffectiveMode]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || theme.mode !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Force re-render by updating theme
      setTheme(prev => ({ ...prev }));
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme.mode]);

  return {
    theme,
    colors: getCurrentColors(),
    mode: theme.mode,
    variant: theme.variant,
    effectiveMode: getEffectiveMode(),
    setMode,
    setVariant,
    updateTheme,
    toggleMode,
    isDark: getEffectiveMode() === 'dark',
    isLight: getEffectiveMode() === 'light',
  };
};

// Theme context for global access
export const useThemeContext = () => {
  return useTheme();
}; 