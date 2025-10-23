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

export interface DashboardSummary {
  today_workout: Workout;
  upcoming_workouts: Workout[];
  focus: FocusArea;
  habits: HabitSnapshot[];
  metrics: TrendMetric[];
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
