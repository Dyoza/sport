import { FormEvent, useEffect, useState } from 'react';
import { logSession } from '../services';
import { Workout } from '../types';

interface Props {
  workouts: Workout[];
  onLogged?: () => Promise<void> | void;
}

type SessionForm = {
  workout_id: number;
  duration_minutes: number;
  rpe: number;
  energy_level: string;
  notes: string;
  calories_burned: number;
};

function createDefaultFormState(workouts: Workout[]): SessionForm {
  return {
    workout_id: workouts[0]?.id ?? 0,
    duration_minutes: 60,
    rpe: 7,
    energy_level: 'Focus',
    notes: '',
    calories_burned: 450
  };
}

export function SessionLogger({ workouts, onLogged }: Props) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [form, setForm] = useState<SessionForm>(() => createDefaultFormState(workouts));

  useEffect(() => {
    if (!workouts.length) {
      return;
    }
    setForm((prev) => {
      const exists = workouts.some((workout) => workout.id === prev.workout_id);
      if (exists) {
        return prev;
      }
      return { ...prev, workout_id: workouts[0].id };
    });
  }, [workouts]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.workout_id) return;
    setLoading(true);
    setStatus(null);
    try {
      await logSession(form);
      if (onLogged) {
        await onLogged();
      }
      setStatus({ type: 'success', message: 'Séance enregistrée !' });
      setForm(createDefaultFormState(workouts));
    } catch (error) {
      setStatus({ type: 'error', message: "Impossible d'enregistrer la séance" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="glass-panel p-6 lg:p-8">
      <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="flex flex-col gap-1">
          <h2 className="section-title">Enregistrer ta performance</h2>
          <p className="text-sm text-slate-300">
            Archive chaque entraînement pour suivre ton évolution et ajuster la charge.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-slate-200">
            Séance réalisée
            <select
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white focus:border-[var(--accent-color)] focus:outline-none"
              value={form.workout_id}
              onChange={(event) => setForm((prev) => ({ ...prev, workout_id: Number(event.target.value) }))}
            >
              {workouts.map((workout) => (
                <option key={workout.id} value={workout.id} className="bg-slate-900 text-white">
                  {workout.title}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm text-slate-200">
            Durée (minutes)
            <input
              type="number"
              min={15}
              max={180}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white focus:border-[var(--accent-color)] focus:outline-none"
              value={form.duration_minutes}
              onChange={(event) => setForm((prev) => ({ ...prev, duration_minutes: Number(event.target.value) }))}
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-200">
            Intensité perçue (RPE)
            <input
              type="number"
              min={1}
              max={10}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white focus:border-[var(--accent-color)] focus:outline-none"
              value={form.rpe}
              onChange={(event) => setForm((prev) => ({ ...prev, rpe: Number(event.target.value) }))}
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-200">
            Énergie ressentie
            <input
              type="text"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white focus:border-[var(--accent-color)] focus:outline-none"
              value={form.energy_level}
              onChange={(event) => setForm((prev) => ({ ...prev, energy_level: event.target.value }))}
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-200">
            Calories estimées
            <input
              type="number"
              min={0}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white focus:border-[var(--accent-color)] focus:outline-none"
              value={form.calories_burned}
              onChange={(event) => setForm((prev) => ({ ...prev, calories_burned: Number(event.target.value) }))}
            />
          </label>
        </div>
        <label className="grid gap-2 text-sm text-slate-200">
          Notes & ressentis
          <textarea
            rows={3}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white focus:border-[var(--accent-color)] focus:outline-none"
            value={form.notes}
            placeholder="Points à travailler, sensations, feedback mental..."
            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
          />
        </label>
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Enregistrement...' : 'Valider la séance'}
          </button>
          {status && (
            <span
              className={`text-sm font-medium ${
                status.type === 'success' ? 'text-emerald-300' : 'text-red-200'
              }`}
              aria-live="polite"
            >
              {status.message}
            </span>
          )}
        </div>
      </form>
    </section>
  );
}
