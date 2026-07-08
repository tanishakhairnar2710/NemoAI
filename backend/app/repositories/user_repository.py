from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.entities import User


class UserRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_by_email(self, email: str) -> User | None:
        return self.db.scalar(select(User).where(User.email == email.lower()))

    def get_by_id(self, user_id: int) -> User | None:
        return self.db.get(User, user_id)

    def create(self, email: str, full_name: str, hashed_password: str, study_goal: str | None = None) -> User:
        user = User(
            email=email.lower(),
            full_name=full_name,
            hashed_password=hashed_password,
            study_goal=study_goal,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
