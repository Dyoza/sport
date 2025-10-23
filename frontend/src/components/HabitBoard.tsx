import dayjs from 'dayjs';
import { Activity, CalendarCheck2, Droplet, MoonStar, SmilePlus } from 'lucide-react';
import { HabitSnapshot, RecoverySummary } from '../types';

type Props = {
  habits: HabitSnapshot[];
  summary?: RecoverySummary;
};

export function HabitBoard({ habits, summary }: Props) {
  const recent = habits.slice(0, 7);
  const ordered = [...recent].sort((a, b) => dayjs(a.day).valueOf() - dayjs(b.day).valueOf());
  const complianceRate = summary ? Math.round((summary.logged_days / summary.expected_days) * 100) : 0;

  return (
    <section className="glass-panel flex flex-col gap-6 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h2 className="section-title">Rituel de récupération</h2>
        <span className="text-xs uppercase tracking-[0.35em] text-slate-400">7 derniers jours</span>
      </div>

      {summary ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Sommeil moyen</p>
            <h3 className="mt-2 font-display text-3xl text-white">{summary.average_sleep_hours.toFixed(1)} h</h3>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
              <MoonStar className="h-4 w-4" style={{ color: 'var(--accent-gradient-mid)' }} />
              Objectif : 7-9 h
            </p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Hydratation</p>
            <h3 className="mt-2 font-display text-3xl text-white">{summary.average_water_intake_liters.toFixed(1)} L</h3>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
              <Droplet className="h-4 w-4" style={{ color: 'var(--accent-color)' }} />
              Consistance : {complianceRate}%
            </p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Readiness</p>
            <h3 className="mt-2 font-display text-3xl text-white">{summary.average_readiness_score.toFixed(0)}/100</h3>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
              <Activity className="h-4 w-4" style={{ color: 'var(--accent-gradient-end)' }} />
              {summary.dominant_mood ?? 'Humeur à renseigner'}
            </p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Suivi hebdo</p>
            <h3 className="mt-2 font-display text-3xl text-white">{summary.logged_days}/7 jours</h3>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
              <CalendarCheck2 className="h-4 w-4" style={{ color: 'var(--accent-gradient-mid)' }} />
              Pense à valider chaque journée
            </p>
          </article>
        </div>
      ) : (
        <p className="rounded-3xl border border-dashed border-white/15 bg-white/5 px-4 py-6 text-sm text-slate-300">
          Renseigne tes heures de sommeil, ton hydratation et ton humeur pour visualiser ton état de récupération.
        </p>
      )}

      {ordered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ordered.map((habit) => (
            <article key={habit.day} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{dayjs(habit.day).format('ddd D MMM')}</p>
              <h3 className="mt-1 font-display text-xl text-white">Score {habit.readiness_score}/100</h3>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-200">
                <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                  <MoonStar className="h-4 w-4" style={{ color: 'var(--accent-gradient-mid)' }} /> {habit.sleep_hours} h sommeil
                </span>
                <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                  <Droplet className="h-4 w-4" style={{ color: 'var(--accent-color)' }} /> {habit.water_intake_liters} L hydratation
                </span>
              </div>
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                <SmilePlus className="h-4 w-4" style={{ color: 'var(--accent-gradient-end)' }} /> {habit.mood}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-3xl border border-dashed border-white/15 bg-white/5 px-4 py-6 text-sm text-slate-300">
          Aucun suivi de récupération n'a encore été enregistré. Ajoute tes données quotidiennes pour débloquer le bilan.
        </p>
      )}
    </section>
  );
}
