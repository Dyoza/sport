import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { Flame, Sparkles, Timer } from 'lucide-react';
import { DashboardSummary, UserPreferences } from '../types';

dayjs.locale('fr');

type Props = {
  dashboard?: DashboardSummary;
  preferences: UserPreferences;
};

export function HeroHeader({ dashboard, preferences }: Props) {
  const today = dayjs();
  const workout = dashboard?.today_workout;
  const greeting = preferences.ownerName ? `Salut ${preferences.ownerName}` : 'Salut athlète';
  const focusTitle = preferences.customFocus.title || dashboard?.focus.title || 'Optimise ta séance';
  const focusSummary = preferences.customFocus.summary || dashboard?.focus.summary;
  const focusEmphasis = preferences.customFocus.emphasis || dashboard?.focus.emphasis || 'technique';

  return (
    <header className="glass-panel relative overflow-hidden p-8 md:p-12 shadow-intense">
      <div className="absolute inset-0 opacity-60 blur-2xl"
        style={{
          background: `linear-gradient(120deg, var(--accent-gradient-start), var(--accent-gradient-end))`
        }}
      />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-4">
          <p className="uppercase tracking-[0.35em] text-sm text-slate-300">{today.format('dddd D MMMM YYYY')}</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold gradient-text">
            {preferences.programName || 'Programme Sportif Ultra'}
          </h1>
          <p className="max-w-xl text-slate-200 text-lg leading-relaxed">
            {preferences.tagline || "Ton copilote d'entraînement quotidien : planifie, exécute et mesure tes performances avec une interface immersive."}
          </p>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-sm text-slate-200">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--accent-color)' }} />
            {greeting}
          </span>
          {workout && (
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-100/90">
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1">
                <Timer className="h-4 w-4" style={{ color: 'var(--accent-color)' }} />
                <span>{workout.estimated_duration} min</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1">
                <Flame className="h-4 w-4" style={{ color: 'var(--accent-gradient-end)' }} />
                <span>{workout.difficulty}</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1">
                <Sparkles className="h-4 w-4" style={{ color: 'var(--accent-gradient-mid)' }} />
                <span>{workout.focus_area}</span>
              </div>
            </div>
          )}
        </div>
        <div className="grid w-full max-w-sm gap-4">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/15 via-white/5 to-white/0 p-6 shadow-glow">
            <p className="text-sm uppercase tracking-wide text-slate-300">Focus du jour</p>
            <div className="mt-2 flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-slate-300">
              <span style={{ color: 'var(--accent-color)' }}>
                {preferences.customFocus.title ? 'Focus personnalisé' : 'Focus automatique'}
              </span>
            </div>
            <h2 className="mt-1 font-display text-2xl text-white">{focusTitle}</h2>
            {focusSummary && <p className="mt-3 text-sm text-slate-200/90">{focusSummary}</p>}
            <p className="mt-4 text-xs uppercase tracking-[0.35em]" style={{ color: 'var(--accent-gradient-mid)' }}>
              {focusEmphasis}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
