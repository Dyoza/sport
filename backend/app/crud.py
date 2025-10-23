"""Data access helpers for the API."""
from __future__ import annotations

from calendar import monthrange
from collections import Counter, defaultdict
from datetime import date, datetime, time, timedelta
from typing import Dict, Iterable, List, Sequence

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


def _exercise_to_schema(exercise: Exercise) -> schemas.ExerciseOut:
    """Convert a SQLModel exercise to its API representation."""

    if exercise.id is None:
        raise ValueError("Exercise must have a persisted identifier")

    return schemas.ExerciseOut(
        id=exercise.id,
        name=exercise.name,
        category=exercise.category,
        primary_muscles=exercise.primary_muscles,
        secondary_muscles=exercise.secondary_muscles,
        equipment=exercise.equipment,
        instructions=exercise.instructions,
        video_url=exercise.video_url,
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
                exercise=_exercise_to_schema(exercise),
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


def _calculate_training_streak(logs: Sequence[SessionLog], today: date) -> int:
    """Return the number of consecutive days with at least one session."""

    log_dates = {log.performed_at.date() for log in logs}
    streak = 0
    cursor = today
    while cursor in log_dates:
        streak += 1
        cursor -= timedelta(days=1)
    return streak


def _calculate_weekly_progress(
    today: date,
    weekday: int,
    schedule_by_day: Dict[int, List[ProgramSchedule]],
    logs: Sequence[SessionLog],
) -> schemas.WeeklyProgress:
    """Compute aggregated statistics for the current training week."""

    week_start = today - timedelta(days=weekday)
    week_end = week_start + timedelta(days=6)
    start_dt = datetime.combine(week_start, time.min)
    end_dt = datetime.combine(week_end + timedelta(days=1), time.min)

    weekly_logs = [
        log
        for log in logs
        if start_dt <= log.performed_at < end_dt
    ]

    total_sessions = len(weekly_logs)
    total_duration = sum(log.duration_minutes for log in weekly_logs)
    average_rpe = (
        round(sum(log.rpe for log in weekly_logs) / total_sessions, 1)
        if total_sessions
        else 0.0
    )
    calories = sum((log.calories_burned or 0) for log in weekly_logs)

    scheduled_days = sum(1 for day in range(7) if schedule_by_day.get(day))
    unique_completed_days = {log.performed_at.date() for log in weekly_logs}
    completion_rate = 100.0
    if scheduled_days:
        completion_rate = min(
            100.0,
            round(len(unique_completed_days) / scheduled_days * 100, 1),
        )

    return schemas.WeeklyProgress(
        total_sessions=total_sessions,
        total_duration=total_duration,
        average_rpe=average_rpe,
        calories_burned=calories,
        completion_rate=completion_rate,
    )


def get_workout(session: Session, workout_id: int) -> schemas.WorkoutOut:
    template = session.get(WorkoutTemplate, workout_id)
    if not template:
        raise ValueError(f"Workout {workout_id} not found")
    return _build_workout(session, template)


def list_workouts(session: Session) -> List[schemas.WorkoutOut]:
    templates = session.exec(select(WorkoutTemplate).order_by(WorkoutTemplate.focus_area)).all()
    return [_build_workout(session, template) for template in templates]


def list_exercises(session: Session) -> List[schemas.ExerciseOut]:
    exercises = session.exec(select(Exercise).order_by(Exercise.primary_muscles)).all()
    return [_exercise_to_schema(exercise) for exercise in exercises]


def log_session(session: Session, payload: schemas.SessionLogIn) -> SessionLog:
    session_log = SessionLog(
        workout_id=payload.workout_id,
        duration_minutes=payload.duration_minutes,
        rpe=payload.rpe,
        energy_level=payload.energy_level,
        notes=payload.notes,
        calories_burned=payload.calories_burned,
    )
    if payload.performed_at is not None:
        session_log.performed_at = payload.performed_at
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

    all_logs = session.exec(select(SessionLog).order_by(SessionLog.performed_at.desc())).all()

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

    lookback_days = [today - timedelta(days=offset) for offset in range(6, -1, -1)]
    weekly_training_load: List[schemas.TrainingLoadPoint] = []
    for current_day in lookback_days:
        day_logs = [log for log in all_logs if log.performed_at.date() == current_day]
        sessions_count = len(day_logs)
        total_duration = sum(log.duration_minutes for log in day_logs)
        average_rpe = round(sum(log.rpe for log in day_logs) / sessions_count, 1) if sessions_count else 0.0
        training_load = int(sum(log.duration_minutes * log.rpe for log in day_logs))
        weekly_training_load.append(
            schemas.TrainingLoadPoint(
                day=current_day,
                sessions=sessions_count,
                total_duration=total_duration,
                average_rpe=average_rpe,
                training_load=training_load,
            )
        )

    week_start = today - timedelta(days=6)
    recent_habits = [habit for habit in habit_logs if habit.day >= week_start]
    habit_days_logged = {habit.day for habit in recent_habits}
    average_sleep = round(
        sum(habit.sleep_hours for habit in recent_habits) / len(recent_habits),
        1,
    ) if recent_habits else 0.0
    average_water = round(
        sum(habit.water_intake_liters for habit in recent_habits) / len(recent_habits),
        1,
    ) if recent_habits else 0.0
    average_readiness = round(
        sum(habit.readiness_score for habit in recent_habits) / len(recent_habits),
        1,
    ) if recent_habits else 0.0
    mood_counts = Counter(habit.mood for habit in recent_habits if habit.mood)
    dominant_mood = mood_counts.most_common(1)[0][0] if mood_counts else None

    recovery_summary = schemas.RecoverySummary(
        average_sleep_hours=average_sleep,
        average_water_intake_liters=average_water,
        average_readiness_score=average_readiness,
        dominant_mood=dominant_mood,
        logged_days=len(habit_days_logged),
        expected_days=7,
    )

    weekly_progress = _calculate_weekly_progress(
        today=today,
        weekday=weekday,
        schedule_by_day=grouped_schedule,
        logs=all_logs,
    )
    training_streak = _calculate_training_streak(all_logs, today)

    return schemas.DashboardSummary(
        today_workout=today_workout,
        upcoming_workouts=upcoming,
        focus=focus_schema,
        habits=habit_schemas,
        metrics=_group_metrics(metric_logs),
        weekly_progress=weekly_progress,
        training_streak_days=training_streak,
        weekly_training_load=weekly_training_load,
        recovery_summary=recovery_summary,
    )


def get_recent_sessions(session: Session, limit: int = 5) -> List[schemas.SessionSummary]:
    logs = session.exec(
        select(SessionLog)
        .order_by(SessionLog.performed_at.desc())
        .limit(limit)
    ).all()

    summaries: List[schemas.SessionSummary] = []
    for log in logs:
        if log.id is None:
            continue
        workout = session.get(WorkoutTemplate, log.workout_id)
        summaries.append(
            schemas.SessionSummary(
                id=log.id,
                workout_title=workout.title if workout else "Séance personnalisée",
                focus_area=workout.focus_area if workout else "Personnalisé",
                difficulty=workout.difficulty if workout else "Libre",
                performed_at=log.performed_at,
                duration_minutes=log.duration_minutes,
                rpe=log.rpe,
                energy_level=log.energy_level,
                calories_burned=log.calories_burned,
                notes=log.notes,
            )
        )

    return summaries


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
