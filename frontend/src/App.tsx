import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { CalendarMonth, DashboardSummary, Exercise, Workout } from './types';
import { fetchCalendar, fetchDashboard, fetchExercises, fetchWorkouts } from './services';
import { HeroHeader } from './components/HeroHeader';
import { WorkoutGrid } from './components/WorkoutGrid';
import { MetricsBoard } from './components/MetricsBoard';
import { HabitBoard } from './components/HabitBoard';
import { CalendarView } from './components/CalendarView';
import { SessionLogger } from './components/SessionLogger';
import { ExerciseLibrary } from './components/ExerciseLibrary';

dayjs.locale('fr');

export default function App() {
  const [dashboard, setDashboard] = useState<DashboardSummary>();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [calendar, setCalendar] = useState<CalendarMonth>();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const now = dayjs();
        const [dashboardData, workoutData, calendarData, exerciseData] = await Promise.all([
          fetchDashboard(),
          fetchWorkouts(),
          fetchCalendar(now.month() + 1, now.year()),
          fetchExercises()
        ]);
        setDashboard(dashboardData);
        setWorkouts(workoutData);
        setCalendar(calendarData);
        setExercises(exerciseData);
      } catch (err) {
        setError("Impossible de charger les données. Vérifie que l'API est démarrée.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const upcomingWorkouts = useMemo(() => dashboard?.upcoming_workouts ?? [], [dashboard]);

  const handleChangeMonth = async (month: number, year: number) => {
    try {
      const data = await fetchCalendar(month, year);
      setCalendar(data);
    } catch (err) {
      setError('Calendrier indisponible.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-midnight to-slate-950 pb-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 md:px-10">
        <HeroHeader dashboard={dashboard} />
        {loading && (
          <div className="glass-panel flex items-center justify-center p-12 text-lg text-slate-200">
            Chargement des performances...
          </div>
        )}
        {error && (
          <div className="glass-panel border border-red-500/40 bg-red-500/10 p-6 text-red-200">{error}</div>
        )}
        {!loading && !error && (
          <>
            <WorkoutGrid today={dashboard?.today_workout} upcoming={upcomingWorkouts} />
            <MetricsBoard metrics={dashboard?.metrics ?? []} />
            <HabitBoard habits={dashboard?.habits ?? []} />
            <CalendarView calendar={calendar} onChangeMonth={handleChangeMonth} />
            <SessionLogger workouts={workouts} />
            <ExerciseLibrary exercises={exercises} />
          </>
        )}
      </div>
    </div>
  );
}
