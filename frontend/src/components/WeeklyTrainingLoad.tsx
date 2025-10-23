import dayjs from 'dayjs';
import { CalendarRange, Flame, Timer, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine
} from 'recharts';
import { TrainingLoadPoint } from '../types';

type Props = {
  points?: TrainingLoadPoint[];
};

export function WeeklyTrainingLoad({ points = [] }: Props) {
  if (!points.length) {
    return (
      <section className="glass-panel p-6 lg:p-8">
        <header className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="section-title">Tendance hebdomadaire</h2>
            <p className="text-sm text-slate-300">
              Analyse la charge d'entraînement des 7 derniers jours basée sur tes enregistrements réels.
            </p>
          </div>
        </header>
        <p className="mt-6 rounded-3xl border border-dashed border-white/15 bg-white/5 px-5 py-6 text-sm text-slate-300">
          Aucune séance n'a été enregistrée cette semaine. Valide ta prochaine séance pour faire apparaître la courbe de charge.
        </p>
      </section>
    );
  }

  const prepared = points.map((point) => ({
    ...point,
    label: dayjs(point.day).format('ddd'),
    fullLabel: dayjs(point.day).format('dddd D MMM'),
  }));
  const totalLoad = prepared.reduce((acc, point) => acc + point.training_load, 0);
  const totalDuration = prepared.reduce((acc, point) => acc + point.total_duration, 0);
  const totalSessions = prepared.reduce((acc, point) => acc + point.sessions, 0);
  const activeDays = prepared.filter((point) => point.sessions > 0).length;
  const averageLoad = prepared.length ? Math.round(totalLoad / prepared.length) : 0;
  const averageRpe = totalSessions
    ? (prepared.reduce((acc, point) => acc + point.average_rpe * point.sessions, 0) / totalSessions).toFixed(1)
    : '0.0';

  return (
    <section className="glass-panel flex flex-col gap-6 p-6 lg:p-8">
      <header className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="section-title">Tendance hebdomadaire</h2>
          <p className="text-sm text-slate-300">
            Visualise la charge de travail quotidienne et repère les jours forts ou légers pour mieux équilibrer ton plan.
          </p>
        </div>
        <span className="text-xs uppercase tracking-[0.35em] text-slate-400">{activeDays} jours actifs</span>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="h-64 rounded-3xl border border-white/10 bg-white/5 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={prepared}>
              <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} width={50} />
              <Tooltip
                cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                labelFormatter={(value) => `Charge du ${prepared.find((point) => point.label === value)?.fullLabel ?? value}`}
                formatter={(value: number) => [`${Math.round(value)} u.a.`, 'Charge d\'entraînement']}
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(148, 163, 184, 0.4)',
                  borderRadius: '1rem',
                  color: '#f8fafc',
                }}
              />
              <ReferenceLine y={averageLoad} stroke="var(--accent-gradient-mid)" strokeDasharray="5 5" />
              <Bar dataKey="training_load" radius={[14, 14, 0, 0]} fill="var(--accent-color)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="space-y-3">
            <h3 className="text-sm uppercase tracking-[0.35em] text-slate-400">Synthèse</h3>
            <p className="text-3xl font-display text-white">{totalLoad} u.a.</p>
            <p className="text-sm text-slate-300">Somme des charges (durée x RPE) sur 7 jours.</p>
          </div>
          <div className="space-y-3 text-sm text-slate-200">
            <p className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" style={{ color: 'var(--accent-gradient-mid)' }} /> Charge moyenne : {averageLoad} u.a.
            </p>
            <p className="flex items-center gap-2">
              <Timer className="h-4 w-4" style={{ color: 'var(--accent-gradient-end)' }} /> Volume : {totalDuration} min
            </p>
            <p className="flex items-center gap-2">
              <Flame className="h-4 w-4" style={{ color: 'var(--accent-color)' }} /> Intensité moyenne : {averageRpe}
            </p>
            <p className="flex items-center gap-2">
              <CalendarRange className="h-4 w-4" style={{ color: 'var(--accent-gradient-mid)' }} /> {totalSessions} séances loguées
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
