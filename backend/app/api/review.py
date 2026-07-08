from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.models.entities import User
from app.schemas.learning import FlashcardRead, ReviewUpdateIn
from app.services.study_service import StudyService

router = APIRouter(tags=["Review"])


@router.get("/review", response_model=list[FlashcardRead])
def due_review(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return StudyService(db).due_review(current_user.id)


@router.post("/review/update")
def update_review(payload: ReviewUpdateIn, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    review = StudyService(db).review_flashcard(
        current_user.id,
        payload.flashcard_id,
        payload.quality,
        payload.response_time_seconds,
    )
    return {"review_id": review.id, "next_due_at": review.next_due_at}
