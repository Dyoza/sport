"""Data access helpers for the API."""
from __future__ import annotations

from calendar import monthrange
from collections import defaultdict
from datetime import date, datetime, timedelta
from typing import Dict, Iterable, List

from sqlmodel import Session, select

from . import schemas
from .models import (
    DailyHabitLog,
    Exercise,
    FocusRecommendation,
    MetricLog,
    ProgramSchedule,
    SessionLog,
    WorkoutExercise,
    WorkoutTemplate,
)


def _build_workout(session: Session, template: WorkoutTemplate) -> schemas.WorkoutOut:
    exercise_links = session.exec(
        select(WorkoutExercise)
        .where(WorkoutExercise.workout_id == template.id)
        .order_by(WorkoutExercise.sequence)
    ).all()
    exercises: List[schemas.WorkoutExerciseOut] = []
    for link in exercise_links:
        exercise = session.get(Exercise, link.exercise_id)
        if not exercise:
            continue
        exercises.append(
            schemas.WorkoutExerciseOut(
                exercise=schemas.ExerciseOut.from_orm(exercise),
                sets=link.sets,
                reps=link.reps,
                rest_seconds=link.rest_seconds,
                sequence=link.sequence,
                tempo=link.tempo,
                notes=link.notes,
            )
        )
    return schemas.WorkoutOut(
        id=template.id,
        title=template.title,
        description=template.description,
        difficulty=template.difficulty,
        focus_area=template.focus_area,
        estimated_duration=template.estimated_duration,
        exercises=exercises,
    )


def get_workout(session: Session, workout_id: int) -> schemas.WorkoutOut:
    template = session.get(WorkoutTemplate, workout_id)
    if not template:
        raise ValueError(f"Workout {workout_id} not found")
    return _build_workout(session, template)


def list_workouts(session: Session) -> List[schemas.WorkoutOut]:
    templates = session.exec(select(WorkoutTemplate).order_by(WorkoutTemplate.focus_area)).all()
    return [_build_workout(session, template) for template in templates]


def log_session(session: Session, payload: schemas.SessionLogIn) -> SessionLog:
    session_log = SessionLog(
        workout_id=payload.workout_id,
        duration_minutes=payload.duration_minutes,
        rpe=payload.rpe,
        energy_level=payload.energy_level,
        notes=payload.notes,
        calories_burned=payload.calories_burned,
    )
    session.add(session_log)
    session.commit()
    session.refresh(session_log)
    return session_log


def _group_metrics(metric_logs: Iterable[MetricLog]) -> List[schemas.TrendMetric]:
    grouped: Dict[str, List[MetricLog]] = defaultdict(list)
    for log in metric_logs:
        grouped[log.metric].append(log)
    trends: List[schemas.TrendMetric] = []
    for metric, rows in grouped.items():
        if not rows:
            continue
        rows.sort(key=lambda row: row.logged_at)
        trends.append(
            schemas.TrendMetric(
                name=metric,
                unit=rows[0].unit,
                data=[
                    schemas.MetricPoint(timestamp=row.logged_at, value=row.value)
                    for row in rows[-21:]
                ],
            )
        )
    return trends


def get_dashboard_summary(session: Session) -> schemas.DashboardSummary:
    today = date.today()
    weekday = today.weekday()

    schedule_entries = session.exec(
        select(ProgramSchedule).order_by(ProgramSchedule.day_of_week)
    ).all()
    grouped_schedule: Dict[int, List[ProgramSchedule]] = defaultdict(list)
    for entry in schedule_entries:
        grouped_schedule[entry.day_of_week].append(entry)

    def workout_from_schedule(day_index: int) -> List[schemas.WorkoutOut]:
        templates = [session.get(WorkoutTemplate, entry.workout_id) for entry in grouped_schedule.get(day_index, [])]
        return [_build_workout(session, template) for template in templates if template]

    todays_workouts = workout_from_schedule(weekday)
    if not todays_workouts:
        # fallback to first available workout
        all_templates = session.exec(select(WorkoutTemplate)).all()
        todays_workouts = [_build_workout(session, all_templates[0])] if all_templates else []

    today_workout = todays_workouts[0] if todays_workouts else schemas.WorkoutOut(
        id=0,
        title="Repos actif",
        description="Journée de récupération active avec mobilité et respiration",
        difficulty="Facile",
        focus_area="Mobilité",
        estimated_duration=30,
        exercises=[],
    )

    upcoming: List[schemas.WorkoutOut] = []
    for offset in range(1, 6):
        future_day = (weekday + offset) % 7
        workouts = workout_from_schedule(future_day)
        if workouts:
            upcoming.append(workouts[0])

    focus = session.exec(select(FocusRecommendation).order_by(FocusRecommendation.id.desc())).first()
    focus_schema = (
        schemas.FocusArea(
            title=focus.title,
            summary=focus.summary,
            action_steps=focus.action_steps,
            emphasis=focus.emphasis,
        )
        if focus
        else schemas.FocusArea(
            title="Optimise ta séance",
            summary="Concentre-toi sur la qualité des mouvements et la respiration",
            action_steps="Échauffement soigné, amplitude complète, respiration contrôlée",
            emphasis="technique",
        )
    )

    habit_logs = session.exec(
        select(DailyHabitLog)
        .where(DailyHabitLog.day >= today - timedelta(days=14))
        .order_by(DailyHabitLog.day.desc())
    ).all()
    habit_schemas = [
        schemas.HabitSnapshot(
            day=habit.day,
            sleep_hours=habit.sleep_hours,
            water_intake_liters=habit.water_intake_liters,
            mood=habit.mood,
            readiness_score=habit.readiness_score,
        )
        for habit in habit_logs
    ]

    metric_logs = session.exec(
        select(MetricLog).where(MetricLog.logged_at >= datetime.utcnow() - timedelta(days=30))
    ).all()

    return schemas.DashboardSummary(
        today_workout=today_workout,
        upcoming_workouts=upcoming,
        focus=focus_schema,
        habits=habit_schemas,
        metrics=_group_metrics(metric_logs),
    )


def get_calendar(session: Session, month: int, year: int) -> schemas.CalendarMonth:
    total_days = monthrange(year, month)[1]
    schedule_by_day: Dict[int, List[ProgramSchedule]] = defaultdict(list)
    for entry in session.exec(select(ProgramSchedule)).all():
        schedule_by_day[entry.day_of_week].append(entry)

    logs = session.exec(select(SessionLog)).all()
    completed_by_day: Dict[date, List[int]] = defaultdict(list)
    for log in logs:
        completed_by_day[log.performed_at.date()].append(log.workout_id)

    days: List[schemas.CalendarDay] = []
    for day in range(1, total_days + 1):
        current_date = date(year, month, day)
        dow = current_date.weekday()
        scheduled = schedule_by_day.get(dow, [])
        titles = []
        focuses = []
        for item in scheduled:
            workout = session.get(WorkoutTemplate, item.workout_id)
            if workout:
                titles.append(workout.title)
                focuses.append(item.focus)
        workout_title = " / ".join(titles) if titles else "Repos ou mobilité"
        focus = " & ".join(sorted(set(focuses))) if focuses else "recovery"
        completed = current_date in completed_by_day
        days.append(
            schemas.CalendarDay(
                date=current_date,
                workout_title=workout_title,
                focus=focus,
                is_today=current_date == date.today(),
                is_completed=completed,
            )
        )

    return schemas.CalendarMonth(month=month, year=year, days=days)
