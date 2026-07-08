from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.models.entities import User
from app.schemas.learning import AnalyticsRead
from app.services.analytics_service import AnalyticsService

router = APIRouter(tags=["Analytics"])


@router.get("/analytics", response_model=AnalyticsRead)
def analytics(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return AnalyticsService(db).dashboard(current_user)
