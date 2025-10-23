import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { CalendarMonth, DashboardSummary, Exercise, SessionSummary, Workout } from './types';
import { fetchCalendar, fetchDashboard, fetchExercises, fetchRecentSessions, fetchWorkouts } from './services';
import { HeroHeader } from './components/HeroHeader';
import { WorkoutGrid } from './components/WorkoutGrid';
import { MetricsBoard } from './components/MetricsBoard';
import { HabitBoard } from './components/HabitBoard';
import { CalendarView } from './components/CalendarView';
import { SessionLogger } from './components/SessionLogger';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { CustomizationPanel } from './components/CustomizationPanel';
import { PersonalGoals } from './components/PersonalGoals';
import { ProgressHighlights } from './components/ProgressHighlights';
import { RecentSessions } from './components/RecentSessions';
import { usePreferences } from './hooks/usePreferences';

dayjs.locale('fr');

export default function App() {
  const [dashboard, setDashboard] = useState<DashboardSummary>();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [calendar, setCalendar] = useState<CalendarMonth>();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [recentSessions, setRecentSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { preferences, updatePreferences, resetPreferences } = usePreferences();

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const now = dayjs();
        const [dashboardData, workoutData, calendarData, exerciseData, recentSessionData] = await Promise.all([
          fetchDashboard(),
          fetchWorkouts(),
          fetchCalendar(now.month() + 1, now.year()),
          fetchExercises(),
          fetchRecentSessions()
        ]);
        if (!active) return;
        setDashboard(dashboardData);
        setWorkouts(workoutData);
        setCalendar(calendarData);
        setExercises(exerciseData);
        setRecentSessions(recentSessionData);
      } catch (err) {
        if (active) {
          setError("Impossible de charger les données. Vérifie que l'API est démarrée.");
        }
        console.error(err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const upcomingWorkouts = useMemo(() => dashboard?.upcoming_workouts ?? [], [dashboard]);

  const handleAddGoal = (title: string) => {
    const goalId =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `goal-${Date.now()}`;
    updatePreferences((prev) => ({
      ...prev,
      goals: [...prev.goals, { id: goalId, title, completed: false }]
    }));
  };

  const handleToggleGoal = (id: string) => {
    updatePreferences((prev) => ({
      ...prev,
      goals: prev.goals.map((goal) => (goal.id === id ? { ...goal, completed: !goal.completed } : goal))
    }));
  };

  const handleRemoveGoal = (id: string) => {
    updatePreferences((prev) => ({
      ...prev,
      goals: prev.goals.filter((goal) => goal.id !== id)
    }));
  };

  const handleChangeMonth = async (month: number, year: number) => {
    try {
      const data = await fetchCalendar(month, year);
      setCalendar(data);
      setError(null);
    } catch (err) {
      setError('Calendrier indisponible.');
      console.error(err);
    }
  };

  const refreshAfterLogging = useCallback(async () => {
    try {
      const referenceMonth = calendar?.month ?? dayjs().month() + 1;
      const referenceYear = calendar?.year ?? dayjs().year();
      const [dashboardData, calendarData, recentData] = await Promise.all([
        fetchDashboard(),
        fetchCalendar(referenceMonth, referenceYear),
        fetchRecentSessions()
      ]);
      setDashboard(dashboardData);
      setCalendar(calendarData);
      setRecentSessions(recentData);
    } catch (err) {
      console.error("Impossible de rafraîchir les données après l'enregistrement", err);
    }
  }, [calendar]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-midnight to-slate-950 pb-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 md:px-10">
        <HeroHeader dashboard={dashboard} preferences={preferences} />
        <CustomizationPanel
          preferences={preferences}
          onChange={updatePreferences}
          onReset={resetPreferences}
        />
        {preferences.showSections.personalGoals && (
          <PersonalGoals
            goals={preferences.goals}
            onAdd={handleAddGoal}
            onToggle={handleToggleGoal}
            onRemove={handleRemoveGoal}
          />
        )}
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
            {preferences.showSections.progress && (
              <ProgressHighlights
                progress={dashboard?.weekly_progress}
                trainingStreakDays={dashboard?.training_streak_days ?? 0}
              />
            )}
            {preferences.showSections.metrics && <MetricsBoard metrics={dashboard?.metrics ?? []} />}
            {preferences.showSections.habits && <HabitBoard habits={dashboard?.habits ?? []} />}
            {preferences.showSections.calendar && (
              <CalendarView calendar={calendar} onChangeMonth={handleChangeMonth} />
            )}
            {preferences.showSections.sessionLogger && (
              <SessionLogger workouts={workouts} onLogged={refreshAfterLogging} />
            )}
            {preferences.showSections.recentSessions && (
              <RecentSessions sessions={recentSessions} />
            )}
            {preferences.showSections.exerciseLibrary && <ExerciseLibrary exercises={exercises} />}
          </>
        )}
      </div>
    </div>
  );
}
