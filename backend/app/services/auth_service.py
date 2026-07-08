from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.auth.security import create_access_token, hash_password, verify_password
from app.repositories.user_repository import UserRepository
from app.schemas.auth import UserCreate


class AuthService:
    def __init__(self, db: Session) -> None:
        self.users = UserRepository(db)

    def signup(self, payload: UserCreate):
        if self.users.get_by_email(payload.email):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
        user = self.users.create(
            email=payload.email,
            full_name=payload.full_name,
            hashed_password=hash_password(payload.password),
            study_goal=payload.study_goal,
        )
        return {"access_token": create_access_token(str(user.id)), "user": user}

    def login(self, email: str, password: str):
        user = self.users.get_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        return {"access_token": create_access_token(str(user.id)), "user": user}
