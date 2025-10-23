import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { Flame, Sparkles, Timer } from 'lucide-react';
import { DashboardSummary } from '../types';

dayjs.locale('fr');

type Props = {
  dashboard?: DashboardSummary;
};

export function HeroHeader({ dashboard }: Props) {
  const today = dayjs();
  const workout = dashboard?.today_workout;
  return (
    <header className="glass-panel relative overflow-hidden p-8 md:p-12 shadow-intense">
      <div className="absolute inset-0 bg-gradient-to-r from-neon/40 via-aurora/30 to-flame/30 opacity-60 blur-2xl" />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-4">
          <p className="uppercase tracking-[0.35em] text-sm text-slate-300">{today.format('dddd D MMMM YYYY')}</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold gradient-text">
            Programme Sportif Ultra
          </h1>
          <p className="max-w-xl text-slate-200 text-lg leading-relaxed">
            Ton copilote d'entraînement quotidien : planifie, exécute et mesure tes performances avec une interface immersive.
          </p>
          {workout && (
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-100/90">
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1">
                <Timer className="h-4 w-4 text-neon" />
                <span>{workout.estimated_duration} min</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1">
                <Flame className="h-4 w-4 text-flame" />
                <span>{workout.difficulty}</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1">
                <Sparkles className="h-4 w-4 text-emerald" />
                <span>{workout.focus_area}</span>
              </div>
            </div>
          )}
        </div>
        <div className="grid w-full max-w-sm gap-4">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/15 via-white/5 to-white/0 p-6 shadow-glow">
            <p className="text-sm uppercase tracking-wide text-slate-300">Focus du jour</p>
            <h2 className="mt-2 font-display text-2xl text-white">{dashboard?.focus.title ?? 'Optimise ta séance'}</h2>
            <p className="mt-3 text-sm text-slate-200/90">{dashboard?.focus.summary}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.35em] text-neon">
              {dashboard?.focus.emphasis ?? 'technique'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
