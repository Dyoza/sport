import { Dumbbell, Play } from 'lucide-react';
import { Exercise } from '../types';

type Props = {
  exercises: Exercise[];
};

export function ExerciseLibrary({ exercises }: Props) {
  return (
    <section className="glass-panel flex flex-col gap-6 p-6 lg:p-8">
      <div className="flex flex-col gap-2">
        <h2 className="section-title flex items-center gap-3">
          <Dumbbell className="h-6 w-6 text-aurora" />
          Bibliothèque de mouvements
        </h2>
        <p className="text-sm text-slate-300">
          Comprends l'exécution et les points clés de chaque exercice pour gagner en efficacité et sécurité.
        </p>
      </div>
      <div className="grid grid-auto-fit gap-4">
        {exercises.map((exercise) => (
          <article key={exercise.id} className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-white">{exercise.name}</h3>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{exercise.category}</p>
              </div>
              {exercise.video_url && (
                <a
                  href={exercise.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 rounded-full border border-neon/40 bg-neon/10 px-3 py-1 text-xs text-neon hover:bg-neon/20"
                >
                  <Play className="h-3 w-3" /> Vidéo
                </a>
              )}
            </div>
            <p className="mt-3 text-sm text-slate-200/90">{exercise.instructions}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-300">
              <span className="rounded-full bg-white/10 px-3 py-1">Muscles : {exercise.primary_muscles}</span>
              {exercise.secondary_muscles && (
                <span className="rounded-full bg-white/10 px-3 py-1">Synergie : {exercise.secondary_muscles}</span>
              )}
              {exercise.equipment && <span className="rounded-full bg-white/10 px-3 py-1">Matériel : {exercise.equipment}</span>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
