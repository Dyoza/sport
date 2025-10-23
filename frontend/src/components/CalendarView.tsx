import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { CalendarDays, CheckCircle2 } from 'lucide-react';
import { CalendarMonth } from '../types';

dayjs.locale('fr');

type Props = {
  calendar?: CalendarMonth;
  onChangeMonth: (month: number, year: number) => void;
};

export function CalendarView({ calendar, onChangeMonth }: Props) {
  if (!calendar) {
    return null;
  }

  const date = dayjs().set('month', calendar.month - 1).set('year', calendar.year);

  function changeMonth(delta: number) {
    const newDate = date.add(delta, 'month');
    onChangeMonth(newDate.month() + 1, newDate.year());
  }

  return (
    <section className="glass-panel p-6 lg:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="section-title flex items-center gap-3">
              <CalendarDays className="h-6 w-6 text-neon" />
              Calendrier adaptatif
            </h2>
            <p className="text-sm text-slate-300">Visualise les blocs d'entraînement et valide tes séances.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => changeMonth(-1)}
              className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-100 hover:bg-white/20"
            >
              Mois précédent
            </button>
            <div className="rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-semibold">
              {date.format('MMMM YYYY')}
            </div>
            <button
              onClick={() => changeMonth(1)}
              className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-100 hover:bg-white/20"
            >
              Mois suivant
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-3 text-xs uppercase tracking-[0.35em] text-slate-400">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
            <div key={day} className="text-center">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-3 text-sm">
          {calendar.days.map((day) => {
            const dayDate = dayjs(day.date);
            return (
              <div
                key={day.date}
                className={`group relative flex min-h-[120px] flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-3 transition duration-200 hover:border-neon/60 hover:shadow-glow ${
                  day.is_today ? 'ring-2 ring-emerald/70' : ''
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-100">{dayDate.date()}</span>
                  {day.is_completed && <CheckCircle2 className="h-4 w-4 text-emerald" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{day.workout_title}</p>
                  <p className="text-xs text-slate-300">{day.focus}</p>
                </div>
                <div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <p className="text-[11px] text-neon/90">Prépare ton équipement et hydrate-toi.</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
