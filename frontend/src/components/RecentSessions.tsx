import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { Activity, BarChart3, CalendarClock, Clock3, Flame, Sparkles } from 'lucide-react';
import { SessionSummary } from '../types';

dayjs.locale('fr');

interface Props {
  sessions: SessionSummary[];
}

export function RecentSessions({ sessions }: Props) {
  const totalSessions = sessions.length;
  const totalLoad = sessions.reduce((acc, session) => acc + session.duration_minutes * session.rpe, 0);
  const averageRpe = totalSessions
    ? (sessions.reduce((acc, session) => acc + session.rpe, 0) / totalSessions).toFixed(1)
    : '0.0';
  const averageDuration = totalSessions
    ? Math.round(sessions.reduce((acc, session) => acc + session.duration_minutes, 0) / totalSessions)
    : 0;

  return (
    <section className="glass-panel flex flex-col gap-6 p-6 lg:p-8">
      <header className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="section-title">Journal des dernières séances</h2>
          <p className="text-sm text-slate-300">
            Retrouve tes ressentis et valide l'évolution de ton effort sur les derniers entraînements.
          </p>
        </div>
        <span className="text-xs uppercase tracking-[0.35em] text-slate-400">
          {sessions.length === 0 ? 'Enregistre une séance pour démarrer' : `${sessions.length} entrées`}
        </span>
      </header>

      {sessions.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Charge cumulée</p>
            <p className="mt-2 font-display text-2xl text-white">{totalLoad} u.a.</p>
            <p className="mt-1 text-xs text-slate-400">Somme durée x RPE</p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Durée moyenne</p>
            <p className="mt-2 font-display text-2xl text-white">{averageDuration} min</p>
            <p className="mt-1 text-xs text-slate-400">Sur les {totalSessions} dernières séances</p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Intensité moyenne</p>
            <p className="mt-2 font-display text-2xl text-white">RPE {averageRpe}</p>
            <p className="mt-1 text-xs text-slate-400">Ressenti moyen</p>
          </article>
        </div>
      )}

      {sessions.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-white/15 bg-white/5 px-5 py-10 text-center text-sm text-slate-300">
          Tu n'as pas encore enregistré de séance. Utilise le journal pour garder une trace de chaque entraînement.
        </p>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => {
            const performedAt = dayjs(session.performed_at);
            const trainingLoad = session.duration_minutes * session.rpe;
            return (
              <article key={session.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                      <CalendarClock className="h-4 w-4" style={{ color: 'var(--accent-gradient-mid)' }} />
                      {performedAt.format('ddd D MMM · HH:mm')}
                    </p>
                    <h3 className="mt-2 font-semibold text-white">{session.workout_title}</h3>
                    <p className="text-xs text-slate-400">
                      {session.focus_area} · {session.difficulty}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
                    <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                      <Clock3 className="h-4 w-4" /> {session.duration_minutes} min
                    </span>
                    <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                      <Activity className="h-4 w-4" /> RPE {session.rpe}
                    </span>
                    <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                      <BarChart3 className="h-4 w-4" /> {trainingLoad} u.a.
                    </span>
                    {session.calories_burned ? (
                      <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                        <Flame className="h-4 w-4" /> {session.calories_burned} kcal
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                  <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-slate-200">
                    <Sparkles className="h-4 w-4" style={{ color: 'var(--accent-gradient-end)' }} /> {session.energy_level}
                  </span>
                  {session.notes && (
                    <p className="w-full rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-3 text-sm text-slate-200">
                      {session.notes}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
