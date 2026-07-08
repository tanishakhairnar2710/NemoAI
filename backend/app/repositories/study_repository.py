from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.entities import (
    Flashcard,
    FlashcardReview,
    Mnemonic,
    MistakeLog,
    Quiz,
    QuizAttempt,
    UserProgress,
)


class StudyRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def add_flashcards(self, flashcards: list[Flashcard]) -> list[Flashcard]:
        self.db.add_all(flashcards)
        self.db.commit()
        for card in flashcards:
            self.db.refresh(card)
        return flashcards

    def add_quizzes(self, quizzes: list[Quiz]) -> list[Quiz]:
        self.db.add_all(quizzes)
        self.db.commit()
        for quiz in quizzes:
            self.db.refresh(quiz)
        return quizzes

    def add_mnemonics(self, mnemonics: list[Mnemonic]) -> list[Mnemonic]:
        self.db.add_all(mnemonics)
        self.db.commit()
        for mnemonic in mnemonics:
            self.db.refresh(mnemonic)
        return mnemonics

    def flashcards_for_document(self, document_id: int, user_id: int) -> list[Flashcard]:
        statement = (
            select(Flashcard)
            .join(Flashcard.document)
            .where(Flashcard.document_id == document_id, Flashcard.document.has(user_id=user_id))
            .order_by(Flashcard.due_at.asc())
        )
        return list(self.db.scalars(statement).all())

    def quizzes_for_document(self, document_id: int, user_id: int) -> list[Quiz]:
        statement = (
            select(Quiz)
            .join(Quiz.document)
            .where(Quiz.document_id == document_id, Quiz.document.has(user_id=user_id))
            .order_by(Quiz.id.asc())
        )
        return list(self.db.scalars(statement).all())

    def mnemonics_for_document(self, document_id: int, user_id: int) -> list[Mnemonic]:
        statement = (
            select(Mnemonic)
            .join(Mnemonic.document)
            .where(Mnemonic.document_id == document_id, Mnemonic.document.has(user_id=user_id))
            .order_by(Mnemonic.id.asc())
        )
        return list(self.db.scalars(statement).all())

    def due_flashcards(self, user_id: int) -> list[Flashcard]:
        statement = (
            select(Flashcard)
            .join(Flashcard.document)
            .where(Flashcard.document.has(user_id=user_id), Flashcard.due_at <= datetime.now(timezone.utc))
            .order_by(Flashcard.due_at.asc())
        )
        return list(self.db.scalars(statement).all())

    def get_flashcard(self, flashcard_id: int, user_id: int) -> Flashcard | None:
        statement = select(Flashcard).join(Flashcard.document).where(
            Flashcard.id == flashcard_id,
            Flashcard.document.has(user_id=user_id),
        )
        return self.db.scalar(statement)

    def record_flashcard_review(
        self,
        user_id: int,
        card: Flashcard,
        quality: int,
        response_time_seconds: float,
        next_due_at: datetime,
    ) -> FlashcardReview:
        review = FlashcardReview(
            user_id=user_id,
            flashcard_id=card.id,
            quality=quality,
            response_time_seconds=response_time_seconds,
            next_due_at=next_due_at,
        )
        progress = self.db.scalar(
            select(UserProgress).where(UserProgress.user_id == user_id, UserProgress.flashcard_id == card.id)
        )
        if progress is None:
            progress = UserProgress(user_id=user_id, flashcard_id=card.id)
            self.db.add(progress)
        progress.attempts += 1
        if quality >= 3:
            progress.correct_attempts += 1
        progress.mastery_score = round((progress.correct_attempts / progress.attempts) * 100, 2)
        self.db.add(review)
        self.db.commit()
        self.db.refresh(review)
        return review

    def get_quiz(self, quiz_id: int, user_id: int) -> Quiz | None:
        statement = select(Quiz).join(Quiz.document).where(Quiz.id == quiz_id, Quiz.document.has(user_id=user_id))
        return self.db.scalar(statement)

    def record_quiz_attempt(
        self,
        user_id: int,
        quiz: Quiz,
        selected_answer: str,
        response_time_seconds: float,
    ) -> QuizAttempt:
        is_correct = selected_answer == quiz.correct_answer
        attempt = QuizAttempt(
            user_id=user_id,
            quiz_id=quiz.id,
            selected_answer=selected_answer,
            is_correct=is_correct,
            response_time_seconds=response_time_seconds,
        )
        self.db.add(attempt)
        if not is_correct:
            self.db.add(
                MistakeLog(
                    user_id=user_id,
                    document_id=quiz.document_id,
                    topic=quiz.topic,
                    source="quiz",
                    details=f"Selected {selected_answer}; expected {quiz.correct_answer}",
                )
            )
        self.db.commit()
        self.db.refresh(attempt)
        return attempt
