import { ThemeId, UserPreferences } from './types';

export const PREFERENCES_STORAGE_KEY = 'sport-ultra-preferences';

export type ThemePreset = {
  id: ThemeId;
  label: string;
  colors: {
    accent: string;
    accentSoft: string;
    accentStrong: string;
    glow: string;
    gradientStart: string;
    gradientMid: string;
    gradientEnd: string;
    backgroundA: string;
    backgroundB: string;
  };
};

export const THEME_PRESETS: Record<ThemeId, ThemePreset> = {
  glacier: {
    id: 'glacier',
    label: 'Clarté polaire',
    colors: {
      accent: '#38bdf8',
      accentSoft: 'rgba(56, 189, 248, 0.18)',
      accentStrong: '#0ea5e9',
      glow: 'rgba(56, 189, 248, 0.35)',
      gradientStart: '#38bdf8',
      gradientMid: '#34d399',
      gradientEnd: '#f97316',
      backgroundA: 'rgba(56, 189, 248, 0.25)',
      backgroundB: 'rgba(139, 92, 246, 0.25)'
    }
  },
  sunrise: {
    id: 'sunrise',
    label: 'Aube incandescente',
    colors: {
      accent: '#f97316',
      accentSoft: 'rgba(249, 115, 22, 0.18)',
      accentStrong: '#f97316',
      glow: 'rgba(249, 115, 22, 0.35)',
      gradientStart: '#facc15',
      gradientMid: '#f97316',
      gradientEnd: '#ef4444',
      backgroundA: 'rgba(249, 115, 22, 0.22)',
      backgroundB: 'rgba(236, 72, 153, 0.22)'
    }
  },
  forest: {
    id: 'forest',
    label: 'Souffle boréal',
    colors: {
      accent: '#22c55e',
      accentSoft: 'rgba(34, 197, 94, 0.2)',
      accentStrong: '#16a34a',
      glow: 'rgba(34, 197, 94, 0.35)',
      gradientStart: '#22c55e',
      gradientMid: '#0ea5e9',
      gradientEnd: '#6366f1',
      backgroundA: 'rgba(34, 197, 94, 0.2)',
      backgroundB: 'rgba(14, 165, 233, 0.2)'
    }
  },
  nebula: {
    id: 'nebula',
    label: 'Nébuleuse cosmique',
    colors: {
      accent: '#8b5cf6',
      accentSoft: 'rgba(139, 92, 246, 0.2)',
      accentStrong: '#8b5cf6',
      glow: 'rgba(139, 92, 246, 0.4)',
      gradientStart: '#8b5cf6',
      gradientMid: '#38bdf8',
      gradientEnd: '#f472b6',
      backgroundA: 'rgba(139, 92, 246, 0.25)',
      backgroundB: 'rgba(56, 189, 248, 0.25)'
    }
  }
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  ownerName: '',
  programName: 'Programme Sportif Ultra',
  tagline: "Ton copilote d'entraînement quotidien : planifie, exécute et mesure tes performances.",
  theme: 'glacier',
  showSections: {
    metrics: true,
    habits: true,
    calendar: true,
    sessionLogger: true,
    exerciseLibrary: true,
    personalGoals: true
  },
  customFocus: {
    title: '',
    summary: '',
    emphasis: ''
  },
  goals: []
};
