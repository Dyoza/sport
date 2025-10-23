import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_PREFERENCES, PREFERENCES_STORAGE_KEY, THEME_PRESETS } from '../preferences';
import { ThemeId, UserPreferences } from '../types';

const isBrowser = typeof window !== 'undefined';

function mergePreferences(stored: Partial<UserPreferences> | null): UserPreferences {
  if (!stored) {
    return DEFAULT_PREFERENCES;
  }

  const theme =
    stored.theme && stored.theme in THEME_PRESETS ? stored.theme : DEFAULT_PREFERENCES.theme;

  return {
    ...DEFAULT_PREFERENCES,
    ...stored,
    theme,
    showSections: {
      ...DEFAULT_PREFERENCES.showSections,
      ...(stored.showSections ?? {})
    },
    customFocus: {
      ...DEFAULT_PREFERENCES.customFocus,
      ...(stored.customFocus ?? {})
    },
    goals: stored.goals ?? []
  };
}

function applyTheme(theme: ThemeId) {
  if (!isBrowser) return;
  const preset = THEME_PRESETS[theme];
  if (!preset) return;

  const root = document.documentElement;
  root.style.setProperty('--accent-color', preset.colors.accent);
  root.style.setProperty('--accent-soft', preset.colors.accentSoft);
  root.style.setProperty('--accent-strong', preset.colors.accentStrong);
  root.style.setProperty('--accent-glow', preset.colors.glow);
  root.style.setProperty('--accent-gradient-start', preset.colors.gradientStart);
  root.style.setProperty('--accent-gradient-mid', preset.colors.gradientMid);
  root.style.setProperty('--accent-gradient-end', preset.colors.gradientEnd);
  root.style.setProperty('--accent-background-a', preset.colors.backgroundA);
  root.style.setProperty('--accent-background-b', preset.colors.backgroundB);
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    if (!isBrowser) {
      return DEFAULT_PREFERENCES;
    }

    try {
      const raw = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (!raw) {
        return DEFAULT_PREFERENCES;
      }
      const parsed = JSON.parse(raw) as Partial<UserPreferences>;
      return mergePreferences(parsed);
    } catch (error) {
      console.error('Unable to parse stored preferences', error);
      return DEFAULT_PREFERENCES;
    }
  });

  useEffect(() => {
    applyTheme(preferences.theme);
  }, [preferences.theme]);

  useEffect(() => {
    if (!isBrowser) return;
    window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const updatePreferences = useCallback(
    (updater: (prev: UserPreferences) => UserPreferences) => {
      setPreferences((prev) => {
        const next = updater(prev);
        return mergePreferences(next);
      });
    },
    []
  );

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    if (isBrowser) {
      window.localStorage.removeItem(PREFERENCES_STORAGE_KEY);
    }
  }, []);

  const themePreset = useMemo(() => THEME_PRESETS[preferences.theme], [preferences.theme]);

  return { preferences, updatePreferences, resetPreferences, themePreset };
}
