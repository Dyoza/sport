import { FormEvent, useState } from 'react';
import { CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import { Goal } from '../types';

interface Props {
  goals: Goal[];
  onAdd: (title: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export function PersonalGoals({ goals, onAdd, onToggle, onRemove }: Props) {
  const [title, setTitle] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = title.trim();
    if (!value) return;
    onAdd(value);
    setTitle('');
  };

  const remaining = goals.filter((goal) => !goal.completed).length;

  return (
    <section className="glass-panel flex flex-col gap-6 p-6 lg:p-8">
      <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="section-title">Objectifs personnalisés</h2>
          <p className="text-sm text-slate-300">
            Définis tes propres jalons pour la semaine et coche-les au fur et à mesure.
          </p>
        </div>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
          {remaining === 0 ? 'Objectifs atteints' : `${remaining} restant${remaining > 1 ? 's' : ''}`}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Ajouter un objectif d'entraînement ou d'habitude"
          className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white focus:border-[var(--accent-color)] focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent-color)] px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-[var(--accent-color)]/30 transition-transform hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </button>
      </form>

      <div className="grid gap-3">
        {goals.length === 0 && (
          <p className="rounded-3xl border border-dashed border-white/20 bg-white/5 px-4 py-6 text-center text-sm text-slate-300">
            Aucune cible définie pour l'instant. Fixe-toi un objectif concret pour personnaliser ta progression.
          </p>
        )}
        {goals.map((goal) => (
          <article
            key={goal.id}
            className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-100"
          >
            <button
              type="button"
              onClick={() => onToggle(goal.id)}
              className="flex items-center gap-3 text-left"
            >
              {goal.completed ? (
                <CheckCircle2 className="h-6 w-6 text-[var(--accent-color)]" />
              ) : (
                <Circle className="h-6 w-6 text-slate-500" />
              )}
              <span className={goal.completed ? 'text-slate-400 line-through' : ''}>{goal.title}</span>
            </button>
            <button
              type="button"
              onClick={() => onRemove(goal.id)}
              className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:border-red-400/60 hover:text-red-200"
              aria-label="Supprimer l'objectif"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
