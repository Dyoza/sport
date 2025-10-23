"""Pydantic schemas for API responses."""
from __future__ import annotations

from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel


class OrmBaseModel(BaseModel):
    """Base schema class enabling ORM compatibility."""

    class Config:
        orm_mode = True


class ExerciseOut(OrmBaseModel):
    id: int
    name: str
    category: str
    primary_muscles: str
    secondary_muscles: Optional[str]
    equipment: Optional[str]
    instructions: str
    video_url: Optional[str]


class WorkoutExerciseOut(OrmBaseModel):
    exercise: ExerciseOut
    sets: int
    reps: str
    rest_seconds: int
    sequence: int
    tempo: Optional[str]
    notes: Optional[str]


class WorkoutOut(OrmBaseModel):
    id: int
    title: str
    description: str
    difficulty: str
    focus_area: str
    estimated_duration: int
    exercises: List[WorkoutExerciseOut]


class SessionLogIn(BaseModel):
    workout_id: int
    duration_minutes: int
    rpe: int
    energy_level: str
    notes: Optional[str] = None
    calories_burned: Optional[int] = None


class MetricPoint(BaseModel):
    timestamp: datetime
    value: float


class TrendMetric(BaseModel):
    name: str
    unit: str
    data: List[MetricPoint]


class HabitSnapshot(BaseModel):
    day: date
    sleep_hours: float
    water_intake_liters: float
    mood: str
    readiness_score: int


class FocusArea(BaseModel):
    title: str
    summary: str
    action_steps: str
    emphasis: str


class DashboardSummary(BaseModel):
    today_workout: WorkoutOut
    upcoming_workouts: List[WorkoutOut]
    focus: FocusArea
    habits: List[HabitSnapshot]
    metrics: List[TrendMetric]


class CalendarDay(BaseModel):
    date: date
    workout_title: str
    focus: str
    is_today: bool
    is_completed: bool


class CalendarMonth(BaseModel):
    month: int
    year: int
    days: List[CalendarDay]
