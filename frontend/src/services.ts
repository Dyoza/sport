import axios from 'axios';
import { CalendarMonth, DashboardSummary, Workout, Exercise, SessionSummary } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

export async function fetchDashboard(): Promise<DashboardSummary> {
  const { data } = await client.get<DashboardSummary>('/dashboard');
  return data;
}

export async function fetchWorkouts(): Promise<Workout[]> {
  const { data } = await client.get<Workout[]>('/workouts');
  return data;
}

export async function fetchCalendar(month: number, year: number): Promise<CalendarMonth> {
  const { data } = await client.get<CalendarMonth>('/calendar', { params: { month, year } });
  return data;
}

export async function logSession(payload: {
  workout_id: number;
  duration_minutes: number;
  rpe: number;
  energy_level: string;
  notes?: string;
  calories_burned?: number;
  performed_at?: string;
}): Promise<void> {
  await client.post('/sessions', payload);
}

export async function fetchExercises(): Promise<Exercise[]> {
  const { data } = await client.get<Exercise[]>('/exercises');
  return data;
}

export async function fetchRecentSessions(limit = 5): Promise<SessionSummary[]> {
  const { data } = await client.get<SessionSummary[]>('/sessions/recent', { params: { limit } });
  return data;
}
