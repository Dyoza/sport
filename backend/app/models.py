"""SQLModel models used by the backend."""
from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class Exercise(SQLModel, table=True):
    """Catalog of all available exercises."""

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    category: str
    primary_muscles: str
    secondary_muscles: Optional[str] = None
    equipment: Optional[str] = None
    instructions: str
    video_url: Optional[str] = None


class WorkoutTemplate(SQLModel, table=True):
    """High level workout templates composed of multiple exercises."""

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    difficulty: str
    focus_area: str
    estimated_duration: int  # in minutes


class WorkoutExercise(SQLModel, table=True):
    """Association between a workout template and its exercises."""

    id: Optional[int] = Field(default=None, primary_key=True)
    workout_id: int = Field(foreign_key="workouttemplate.id")
    exercise_id: int = Field(foreign_key="exercise.id")
    sequence: int
    sets: int
    reps: str
    rest_seconds: int
    tempo: Optional[str] = None
    notes: Optional[str] = None


class ProgramSchedule(SQLModel, table=True):
    """Weekly program that maps days to workouts."""

    id: Optional[int] = Field(default=None, primary_key=True)
    day_of_week: int  # 0=Monday
    workout_id: int = Field(foreign_key="workouttemplate.id")
    focus: str


class SessionLog(SQLModel, table=True):
    """Log of completed workout sessions."""

    id: Optional[int] = Field(default=None, primary_key=True)
    workout_id: int = Field(foreign_key="workouttemplate.id")
    performed_at: datetime = Field(default_factory=datetime.utcnow)
    duration_minutes: int
    rpe: int
    energy_level: str
    notes: Optional[str] = None
    calories_burned: Optional[int] = None


class MetricLog(SQLModel, table=True):
    """Time series of tracked wellness metrics."""

    id: Optional[int] = Field(default=None, primary_key=True)
    metric: str
    value: float
    unit: str
    logged_at: datetime = Field(default_factory=datetime.utcnow)


class DailyHabitLog(SQLModel, table=True):
    """Daily lifestyle and recovery habits."""

    id: Optional[int] = Field(default=None, primary_key=True)
    day: date = Field(default_factory=date.today, unique=True)
    sleep_hours: float
    water_intake_liters: float
    mood: str
    readiness_score: int


class FocusRecommendation(SQLModel, table=True):
    """Dynamic recommendations for the day's focus."""

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    summary: str
    action_steps: str
    emphasis: str
