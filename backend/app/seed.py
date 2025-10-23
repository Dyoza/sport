"""Utility to populate the database with realistic demo data."""
from __future__ import annotations

from datetime import date, datetime, timedelta
import random

from sqlmodel import Session, select

from .database import get_session, init_db
from .models import (
    DailyHabitLog,
    Exercise,
    FocusRecommendation,
    MetricLog,
    ProgramSchedule,
    WorkoutExercise,
    WorkoutTemplate,
)


EXERCISES = [
    dict(
        name="Squat arrière",
        category="Force",
        primary_muscles="Quadriceps, fessiers",
        secondary_muscles="Ischio-jambiers, tronc",
        equipment="Barre olympique",
        instructions="Garde le dos neutre, descend jusqu'à ce que les cuisses soient parallèles.",
        video_url="https://www.youtube.com/watch?v=ultWZbUMPL8",
    ),
    dict(
        name="Pompes déclinées",
        category="Hypertrophie",
        primary_muscles="Pectoraux supérieurs",
        secondary_muscles="Épaules, triceps",
        equipment="Poids du corps",
        instructions="Gaine le tronc et descend lentement jusqu'à frôler le sol.",
        video_url="https://www.youtube.com/watch?v=4t4fO-Jm87Y",
    ),
    dict(
        name="Tractions pronation",
        category="Force",
        primary_muscles="Dos, dorsaux",
        secondary_muscles="Biceps, avant-bras",
        equipment="Barre de traction",
        instructions="Tire la poitrine vers la barre en contrôlant la descente.",
        video_url="https://www.youtube.com/watch?v=eGo4IYlbE5g",
    ),
    dict(
        name="Fentes bulgares",
        category="Hypertrophie",
        primary_muscles="Fessiers, quadriceps",
        secondary_muscles="Mollets",
        equipment="Haltères",
        instructions="Descend verticalement en gardant le genou avant au-dessus de la cheville.",
        video_url="https://www.youtube.com/watch?v=2C-uNgKwPLE",
    ),
    dict(
        name="Planche dynamique",
        category="Core",
        primary_muscles="Abdominaux profonds",
        secondary_muscles="Épaules, lombaires",
        equipment="Tapis",
        instructions="Alterner appuis sur les coudes et mains sans bouger le bassin.",
        video_url="https://www.youtube.com/watch?v=2z8JmcrW-As",
    ),
    dict(
        name="Sauts à la corde",
        category="Cardio",
        primary_muscles="Conditionnement",
        secondary_muscles="Mollets",
        equipment="Corde",
        instructions="Gardes des sauts courts et réguliers, reste sur la pointe des pieds.",
        video_url="https://www.youtube.com/watch?v=1BZMwd7ywLI",
    ),
]


WORKOUTS = [
    dict(
        title="Force bas du corps",
        description="Un bloc intensif pour renforcer les jambes et le gainage.",
        difficulty="Avancé",
        focus_area="Force",
        estimated_duration=70,
        exercises=[
            dict(name="Squat arrière", sets=5, reps="5", rest_seconds=150, tempo="3-1-1", sequence=1),
            dict(name="Fentes bulgares", sets=4, reps="8 par jambe", rest_seconds=90, tempo="2-1-2", sequence=2),
            dict(name="Planche dynamique", sets=4, reps="45 sec", rest_seconds=60, tempo=None, sequence=3),
        ],
    ),
    dict(
        title="Push-Pull upper",
        description="Travail équilibré du haut du corps avec volume modéré.",
        difficulty="Intermédiaire",
        focus_area="Hypertrophie",
        estimated_duration=60,
        exercises=[
            dict(name="Pompes déclinées", sets=4, reps="12", rest_seconds=90, tempo="2-0-2", sequence=1),
            dict(name="Tractions pronation", sets=4, reps="8", rest_seconds=120, tempo="2-1-2", sequence=2),
            dict(name="Planche dynamique", sets=3, reps="60 sec", rest_seconds=60, tempo=None, sequence=3),
        ],
    ),
    dict(
        title="Conditionnement explosif",
        description="Séance cardio haute intensité pour booster l'endurance.",
        difficulty="Intermédiaire",
        focus_area="Cardio",
        estimated_duration=40,
        exercises=[
            dict(name="Sauts à la corde", sets=6, reps="60 sec", rest_seconds=30, tempo=None, sequence=1),
            dict(name="Tractions pronation", sets=3, reps="max", rest_seconds=90, tempo="1-0-1", sequence=2),
            dict(name="Fentes bulgares", sets=3, reps="12", rest_seconds=75, tempo="2-0-2", sequence=3),
        ],
    ),
]


SCHEDULE = [
    dict(day_of_week=0, workout_title="Force bas du corps", focus="Force"),
    dict(day_of_week=1, workout_title="Push-Pull upper", focus="Upper"),
    dict(day_of_week=2, workout_title="Conditionnement explosif", focus="Cardio"),
    dict(day_of_week=4, workout_title="Force bas du corps", focus="Force"),
    dict(day_of_week=5, workout_title="Push-Pull upper", focus="Upper"),
]


FOCUS = FocusRecommendation(
    title="Semaine progressive",
    summary="Accent sur la force fonctionnelle et le contrôle postural.",
    action_steps="Priorise les charges contrôlées, respiration diaphragmatique et récupération active.",
    emphasis="progression",
)


def seed() -> None:
    init_db()
    with get_session() as session:
        if session.exec(select(Exercise)).first():
            return

        exercise_map = {}
        for payload in EXERCISES:
            exercise = Exercise(**payload)
            session.add(exercise)
            session.commit()
            session.refresh(exercise)
            exercise_map[payload["name"]] = exercise

        workout_map = {}
        for payload in WORKOUTS:
            exercises = payload.pop("exercises")
            workout = WorkoutTemplate(**payload)
            session.add(workout)
            session.commit()
            session.refresh(workout)
            workout_map[workout.title] = workout
            for exercise_cfg in exercises:
                exercise = exercise_map[exercise_cfg["name"]]
                link = WorkoutExercise(
                    workout_id=workout.id,
                    exercise_id=exercise.id,
                    sets=exercise_cfg["sets"],
                    reps=exercise_cfg["reps"],
                    rest_seconds=exercise_cfg["rest_seconds"],
                    tempo=exercise_cfg.get("tempo"),
                    sequence=exercise_cfg["sequence"],
                    notes=None,
                )
                session.add(link)

        for item in SCHEDULE:
            template = workout_map[item["workout_title"]]
            schedule = ProgramSchedule(
                day_of_week=item["day_of_week"],
                workout_id=template.id,
                focus=item["focus"],
            )
            session.add(schedule)

        session.add(FOCUS)

        today = date.today()
        for delta in range(0, 21):
            day = today - timedelta(days=delta)
            session.add(
                DailyHabitLog(
                    day=day,
                    sleep_hours=round(random.uniform(6.2, 8.3), 1),
                    water_intake_liters=round(random.uniform(2.0, 3.5), 1),
                    mood=random.choice(["Motivé", "Concentré", "Fatigué mais présent", "Explosif"]),
                    readiness_score=random.randint(70, 95),
                )
            )

        metrics = [
            ("Charge tonnage", "kg"),
            ("Fréquence cardiaque au repos", "bpm"),
            ("Variabilité HRV", "ms"),
        ]
        for name, unit in metrics:
            for delta in range(0, 30):
                timestamp = datetime.utcnow() - timedelta(days=delta)
                base = 0
                if name == "Charge tonnage":
                    base = 12000
                    value = base + random.uniform(-1000, 1400)
                elif name == "Fréquence cardiaque au repos":
                    base = 52
                    value = base + random.uniform(-4, 3)
                else:
                    base = 78
                    value = base + random.uniform(-6, 8)
                session.add(MetricLog(metric=name, value=round(value, 2), unit=unit, logged_at=timestamp))

        session.commit()


if __name__ == "__main__":
    seed()
    print("Base de données initialisée avec succès !")
