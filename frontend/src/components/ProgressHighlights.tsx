import { Activity, CalendarCheck2, Flame, GaugeCircle, Timer, Trophy } from 'lucide-react';
import { WeeklyProgress } from '../types';

interface Props {
  progress?: WeeklyProgress;
  trainingStreakDays: number;
}

function formatDuration(totalMinutes: number): string {
  if (totalMinutes <= 0) {
    return '0 min';
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) {
    return `${minutes} min`;
  }
  if (minutes === 0) {
    return `${hours} h`;
  }
  return `${hours} h ${minutes} min`;
}

export function ProgressHighlights({ progress, trainingStreakDays }: Props) {
  if (!progress) {
    return null;
  }

  const completionLabel = `${Math.round(progress.completion_rate)}% du plan complété`;
  const streakLabel =
    trainingStreakDays > 1
      ? `${trainingStreakDays} jours d'affilée`
      : trainingStreakDays === 1
      ? '1 jour d\'élan'
      : 'Aucun streak en cours';
  const streakMessage =
    trainingStreakDays > 0
      ? 'Continue sur ta lancée et récompense-toi par une récupération active.'
      : 'Planifie ta prochaine séance pour lancer une nouvelle série.';

  return (
    <section className="glass-panel flex flex-col gap-6 p-6 lg:p-8">
      <header className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="section-title">Bilan de la semaine</h2>
          <p className="text-sm text-slate-300">
            Visualise ton volume d'entraînement et l'adhérence au plan depuis lundi.
          </p>
        </div>
        <span className="text-xs uppercase tracking-[0.35em] text-slate-400">{completionLabel}</span>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[var(--accent-soft)] p-2 text-[var(--accent-strong)]">
              <Activity className="h-5 w-5" />
            </span>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Séances réalisées</p>
          </div>
          <p className="mt-3 font-display text-3xl text-white">{progress.total_sessions}</p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[var(--accent-soft)] p-2 text-[var(--accent-strong)]">
              <Timer className="h-5 w-5" />
            </span>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Temps cumulé</p>
          </div>
          <p className="mt-3 font-display text-3xl text-white">{formatDuration(progress.total_duration)}</p>
          <p className="text-xs text-slate-400">{progress.total_duration} minutes</p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[var(--accent-soft)] p-2 text-[var(--accent-strong)]">
              <GaugeCircle className="h-5 w-5" />
            </span>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Intensité moyenne</p>
          </div>
          <p className="mt-3 font-display text-3xl text-white">{progress.average_rpe.toFixed(1)}</p>
          <p className="text-xs text-slate-400">RPE perçue sur la semaine</p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[var(--accent-soft)] p-2 text-[var(--accent-strong)]">
              <Flame className="h-5 w-5" />
            </span>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Calories brûlées</p>
          </div>
          <p className="mt-3 font-display text-3xl text-white">{progress.calories_burned}</p>
          <p className="text-xs text-slate-400">Estimation sur la période</p>
        </article>
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[var(--accent-soft)] p-2 text-[var(--accent-strong)]">
            <Trophy className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">{streakLabel}</p>
            <p className="text-xs text-slate-400">{streakMessage}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs text-slate-200">
          <CalendarCheck2 className="h-4 w-4" style={{ color: 'var(--accent-gradient-mid)' }} />
          {completionLabel}
        </div>
      </div>
      {progress.total_sessions === 0 && (
        <p className="rounded-3xl border border-dashed border-white/15 bg-white/5 px-4 py-5 text-sm text-slate-300">
          Enregistre au moins une séance pour activer le bilan hebdomadaire : chaque log met à jour automatiquement ces indicateurs.
        </p>
      )}
    </section>
  );
}
