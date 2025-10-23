export interface Exercise {
  id: number;
  name: string;
  category: string;
  primary_muscles: string;
  secondary_muscles?: string | null;
  equipment?: string | null;
  instructions: string;
  video_url?: string | null;
}

export interface WorkoutExercise {
  exercise: Exercise;
  sets: number;
  reps: string;
  rest_seconds: number;
  sequence: number;
  tempo?: string | null;
  notes?: string | null;
}

export interface Workout {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  focus_area: string;
  estimated_duration: number;
  exercises: WorkoutExercise[];
}

export interface FocusArea {
  title: string;
  summary: string;
  action_steps: string;
  emphasis: string;
}

export interface HabitSnapshot {
  day: string;
  sleep_hours: number;
  water_intake_liters: number;
  mood: string;
  readiness_score: number;
}

export interface MetricPoint {
  timestamp: string;
  value: number;
}

export interface TrendMetric {
  name: string;
  unit: string;
  data: MetricPoint[];
}

export interface TrainingLoadPoint {
  day: string;
  sessions: number;
  total_duration: number;
  average_rpe: number;
  training_load: number;
}

export interface RecoverySummary {
  average_sleep_hours: number;
  average_water_intake_liters: number;
  average_readiness_score: number;
  dominant_mood?: string | null;
  logged_days: number;
  expected_days: number;
}

export interface DashboardSummary {
  today_workout: Workout;
  upcoming_workouts: Workout[];
  focus: FocusArea;
  habits: HabitSnapshot[];
  metrics: TrendMetric[];
  weekly_progress: WeeklyProgress;
  training_streak_days: number;
  weekly_training_load: TrainingLoadPoint[];
  recovery_summary: RecoverySummary;
}

export interface CalendarDay {
  date: string;
  workout_title: string;
  focus: string;
  is_today: boolean;
  is_completed: boolean;
}

export interface CalendarMonth {
  month: number;
  year: number;
  days: CalendarDay[];
}

export interface WeeklyProgress {
  total_sessions: number;
  total_duration: number;
  average_rpe: number;
  calories_burned: number;
  completion_rate: number;
}

export interface SessionSummary {
  id: number;
  workout_title: string;
  focus_area: string;
  difficulty: string;
  performed_at: string;
  duration_minutes: number;
  rpe: number;
  energy_level: string;
  calories_burned?: number | null;
  notes?: string | null;
}

export type ThemeId = 'glacier' | 'sunrise' | 'forest' | 'nebula';

export interface CustomFocus {
  title: string;
  summary: string;
  emphasis: string;
}

export interface Goal {
  id: string;
  title: string;
  completed: boolean;
}

export interface UserPreferences {
  ownerName: string;
  programName: string;
  tagline: string;
  theme: ThemeId;
  showSections: {
    progress: boolean;
    recentSessions: boolean;
    metrics: boolean;
    habits: boolean;
    calendar: boolean;
    sessionLogger: boolean;
    exerciseLibrary: boolean;
    personalGoals: boolean;
  };
  customFocus: CustomFocus;
  goals: Goal[];
}
