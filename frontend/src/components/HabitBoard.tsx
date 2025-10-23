import dayjs from 'dayjs';
import { Droplet, MoonStar, SmilePlus } from 'lucide-react';
import { HabitSnapshot } from '../types';

type Props = {
  habits: HabitSnapshot[];
};

export function HabitBoard({ habits }: Props) {
  const recent = habits.slice(0, 7);
  return (
    <section className="glass-panel flex flex-col gap-6 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h2 className="section-title">Rituel de récupération</h2>
        <span className="text-xs uppercase tracking-[0.35em] text-slate-400">7 derniers jours</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {recent.map((habit) => (
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
    </section>
  );
}
