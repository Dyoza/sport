import axios from 'axios';
import { CalendarMonth, DashboardSummary, Workout, Exercise } from './types';

const client = axios.create({
  baseURL: '/api'
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
}): Promise<void> {
  await client.post('/sessions', payload);
}

export async function fetchExercises(): Promise<Exercise[]> {
  const { data } = await client.get<Exercise[]>('/exercises');
  return data;
}
