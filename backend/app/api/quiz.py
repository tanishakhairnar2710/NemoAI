from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.models.entities import User
from app.schemas.learning import QuizRead, QuizSubmitIn, QuizSubmitOut
from app.services.study_service import StudyService

router = APIRouter(tags=["Quiz"])


@router.get("/quiz/{document_id}", response_model=list[QuizRead])
def quiz(document_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return StudyService(db).quizzes(document_id, current_user.id)


@router.post("/quiz/submit", response_model=QuizSubmitOut)
def submit_quiz(payload: QuizSubmitIn, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return StudyService(db).submit_quiz(
        current_user.id,
        payload.quiz_id,
        payload.selected_answer,
        payload.response_time_seconds,
    )
