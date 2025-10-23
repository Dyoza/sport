"""FastAPI application exposing the sport training services."""
from __future__ import annotations

from datetime import date
from typing import List

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from . import crud, schemas
from .database import get_session, init_db
from .models import Exercise

app = FastAPI(title="Programme Sportif Ultra", version="1.0.0")

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


def get_db_session() -> Session:
    with get_session() as session:
        yield session


@app.get("/api/dashboard", response_model=schemas.DashboardSummary)
def read_dashboard(session: Session = Depends(get_db_session)) -> schemas.DashboardSummary:
    return crud.get_dashboard_summary(session)


@app.get("/api/workouts", response_model=List[schemas.WorkoutOut])
def read_workouts(session: Session = Depends(get_db_session)) -> List[schemas.WorkoutOut]:
    return crud.list_workouts(session)


@app.get("/api/workouts/{workout_id}", response_model=schemas.WorkoutOut)
def read_workout(workout_id: int, session: Session = Depends(get_db_session)) -> schemas.WorkoutOut:
    try:
        return crud.get_workout(session, workout_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.post("/api/sessions", status_code=201)
def create_session(
    payload: schemas.SessionLogIn,
    session: Session = Depends(get_db_session),
):
    log = crud.log_session(session, payload)
    return {"id": log.id, "performed_at": log.performed_at}


@app.get("/api/calendar", response_model=schemas.CalendarMonth)
def read_calendar(
    month: int = Query(default=date.today().month, ge=1, le=12),
    year: int = Query(default=date.today().year, ge=2000, le=2100),
    session: Session = Depends(get_db_session),
) -> schemas.CalendarMonth:
    return crud.get_calendar(session, month=month, year=year)


@app.get("/api/exercises", response_model=List[schemas.ExerciseOut])
def read_exercises(session: Session = Depends(get_db_session)) -> List[schemas.ExerciseOut]:
    exercises = session.exec(select(Exercise).order_by(Exercise.primary_muscles)).all()
    return [schemas.ExerciseOut.from_orm(ex) for ex in exercises]
