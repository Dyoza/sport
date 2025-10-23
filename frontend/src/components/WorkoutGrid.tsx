import { Workout } from '../types';
import { WorkoutCard } from './WorkoutCard';

type Props = {
  today?: Workout;
  upcoming: Workout[];
};

export function WorkoutGrid({ today, upcoming }: Props) {
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      {today && (
        <div className="lg:col-span-2">
          <WorkoutCard workout={today} highlight />
        </div>
      )}
      <div className="glass-panel flex h-full flex-col gap-4 p-6">
        <h2 className="section-title">À venir</h2>
        <div className="space-y-4">
          {upcoming.map((workout) => (
            <div key={workout.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{workout.focus_area}</p>
              <h3 className="mt-2 font-semibold text-white">{workout.title}</h3>
              <p className="text-sm text-slate-300">{workout.estimated_duration} min · {workout.difficulty}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
