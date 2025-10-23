import { ChangeEvent } from 'react';
import { THEME_PRESETS } from '../preferences';
import { ThemeId, UserPreferences } from '../types';

interface Props {
  preferences: UserPreferences;
  onChange: (updater: (prev: UserPreferences) => UserPreferences) => void;
  onReset: () => void;
}

const sectionLabels: Record<keyof UserPreferences['showSections'], string> = {
  progress: 'Bilan hebdomadaire',
  recentSessions: 'Historique de séances',
  metrics: 'Tendances de performance',
  habits: 'Rituel de récupération',
  calendar: 'Calendrier adaptatif',
  sessionLogger: 'Journal de séance',
  exerciseLibrary: 'Bibliothèque d\'exercices',
  personalGoals: 'Objectifs personnels'
};

export function CustomizationPanel({ preferences, onChange, onReset }: Props) {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (name.startsWith('customFocus.')) {
      const key = name.split('.')[1] as keyof UserPreferences['customFocus'];
      onChange((prev) => ({
        ...prev,
        customFocus: {
          ...prev.customFocus,
          [key]: value
        }
      }));
      return;
    }

    onChange((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThemeChange = (theme: ThemeId) => {
    onChange((prev) => ({
      ...prev,
      theme
    }));
  };

  const handleToggleSection = (section: keyof UserPreferences['showSections']) => {
    onChange((prev) => ({
      ...prev,
      showSections: {
        ...prev.showSections,
        [section]: !prev.showSections[section]
      }
    }));
  };

  return (
    <section className="glass-panel flex flex-col gap-8 p-6 lg:p-8">
      <header className="flex flex-col gap-2">
        <h2 className="section-title">Personnalise ton cockpit</h2>
        <p className="text-sm text-slate-300">
          Ajuste l\'esthétique, les sections affichées et ton focus pour transformer l\'application en assistant personnel.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-100">Identité</h3>
          <label className="grid gap-2 text-sm text-slate-200">
            Nom affiché
            <input
              name="ownerName"
              value={preferences.ownerName}
              onChange={handleInputChange}
              placeholder="Ex : Alex"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white focus:border-[var(--accent-color)] focus:outline-none"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-200">
            Nom du programme
            <input
              name="programName"
              value={preferences.programName}
              onChange={handleInputChange}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white focus:border-[var(--accent-color)] focus:outline-none"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-200">
            Tagline
            <textarea
              name="tagline"
              value={preferences.tagline}
              rows={3}
              onChange={handleInputChange}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white focus:border-[var(--accent-color)] focus:outline-none"
            />
          </label>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-slate-100">Thème</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.values(THEME_PRESETS).map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleThemeChange(preset.id)}
                className={`relative overflow-hidden rounded-3xl border ${
                  preferences.theme === preset.id ? 'border-[var(--accent-color)] ring-2 ring-[var(--accent-color)]/40' : 'border-white/10'
                } bg-white/5 p-4 text-left transition-transform hover:-translate-y-0.5`}
              >
                <span
                  className="absolute inset-0 opacity-60"
                  style={{
                    background: `linear-gradient(135deg, ${preset.colors.gradientStart}, ${preset.colors.gradientEnd})`
                  }}
                />
                <span className="relative block font-semibold text-white">{preset.label}</span>
                <span className="relative mt-1 block text-xs uppercase tracking-[0.35em] text-slate-200/80">
                  {preset.id}
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-slate-100">Focus personnalisé</h3>
            <p className="text-xs text-slate-300">
              Tu veux piloter toi-même la priorité du moment ? Écris ton propre focus, sinon celui généré par l\'API sera utilisé.
            </p>
            <label className="grid gap-2 text-sm text-slate-200">
              Titre
              <input
                name="customFocus.title"
                value={preferences.customFocus.title}
                onChange={handleInputChange}
                placeholder="Préparer le semi-marathon"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white focus:border-[var(--accent-color)] focus:outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm text-slate-200">
              Synthèse
              <textarea
                name="customFocus.summary"
                value={preferences.customFocus.summary}
                rows={3}
                onChange={handleInputChange}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white focus:border-[var(--accent-color)] focus:outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm text-slate-200">
              Accent
              <input
                name="customFocus.emphasis"
                value={preferences.customFocus.emphasis}
                onChange={handleInputChange}
                placeholder="Allure spécifique"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white focus:border-[var(--accent-color)] focus:outline-none"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-slate-100">Sections visibles</h3>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(sectionLabels).map(([key, label]) => (
            <label
              key={key}
              className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
            >
              <span>{label}</span>
              <input
                type="checkbox"
                checked={preferences.showSections[key as keyof UserPreferences['showSections']]}
                onChange={() => handleToggleSection(key as keyof UserPreferences['showSections'])}
                className="h-4 w-4 rounded border-white/20 bg-slate-900 text-[var(--accent-color)] focus:ring-[var(--accent-color)]"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-slate-100 transition-colors hover:border-[var(--accent-color)] hover:text-white"
        >
          Réinitialiser les préférences
        </button>
        <span className="text-xs uppercase tracking-[0.35em] text-slate-400">Sauvegarde locale automatique</span>
      </div>
    </section>
  );
}
