import { Dumbbell, Repeat, Timer } from 'lucide-react';
import { Workout } from '../types';

type Props = {
  workout: Workout;
  highlight?: boolean;
};

export function WorkoutCard({ workout, highlight = false }: Props) {
  return (
    <article
      className={`glass-panel relative flex flex-col gap-4 p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-intense ${
        highlight ? 'ring-2 ring-neon/60' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.45em] text-slate-400">{workout.focus_area}</p>
          <h3 className="mt-2 font-display text-2xl text-white">{workout.title}</h3>
        </div>
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase text-slate-200">
          {workout.difficulty}
        </span>
      </div>
      <p className="text-sm text-slate-200/80 leading-relaxed">{workout.description}</p>
      <div className="flex items-center gap-3 text-xs text-slate-200">
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
          <Timer className="h-4 w-4 text-neon" />
          <span>{workout.estimated_duration} min</span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
          <Dumbbell className="h-4 w-4 text-aurora" />
          <span>{workout.exercises.length} exercices</span>
        </div>
      </div>
      <ul className="space-y-3 rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-slate-100/90">
        {workout.exercises.map((item) => (
          <li key={`${workout.id}-${item.exercise.id}-${item.sequence}`} className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neon/15 text-neon">#{item.sequence}</div>
            <div>
              <p className="font-semibold text-white">{item.exercise.name}</p>
              <p className="text-xs text-slate-300">
                {item.sets} séries · {item.reps} répétitions · {item.rest_seconds}s repos
              </p>
              {item.tempo && (
                <p className="mt-1 flex items-center gap-2 text-xs text-emerald/80">
                  <Repeat className="h-3 w-3" /> Tempo {item.tempo}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}
