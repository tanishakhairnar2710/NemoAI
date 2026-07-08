from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.models.entities import User
from app.schemas.auth import Token, UserCreate, UserLogin, UserRead
from app.services.auth_service import AuthService

router = APIRouter(tags=["Auth"])


@router.post("/signup", response_model=Token)
def signup(payload: UserCreate, db: Session = Depends(get_db)):
    return AuthService(db).signup(payload)


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    return AuthService(db).login(payload.email, payload.password)


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)):
    return current_user
