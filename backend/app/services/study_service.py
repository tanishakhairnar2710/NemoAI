from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.ai.mnemonics.generator import generate_mnemonic, terms_from_text
from app.ai.spaced_repetition.sm2 import schedule_review
from app.models.entities import Mnemonic
from app.repositories.document_repository import DocumentRepository
from app.repositories.study_repository import StudyRepository


class StudyService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.documents = DocumentRepository(db)
        self.study = StudyRepository(db)

    def flashcards(self, document_id: int, user_id: int):
        self._ensure_document(document_id, user_id)
        return self.study.flashcards_for_document(document_id, user_id)

    def quizzes(self, document_id: int, user_id: int):
        self._ensure_document(document_id, user_id)
        return self.study.quizzes_for_document(document_id, user_id)

    def mnemonics(self, document_id: int, user_id: int):
        self._ensure_document(document_id, user_id)
        return self.study.mnemonics_for_document(document_id, user_id)

    def create_mnemonic_from_text(self, user_id: int, text: str):
        documents = self.documents.list_for_user(user_id)
        if not documents:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Upload a document before saving mnemonics")
        terms = terms_from_text(text)
        mnemonic = Mnemonic(
            document_id=documents[0].id,
            topic="Custom",
            source_terms=terms,
            mnemonic_text=generate_mnemonic(terms),
        )
        return self.study.add_mnemonics([mnemonic])[0]

    def review_flashcard(self, user_id: int, flashcard_id: int, quality: int, response_time_seconds: float):
        card = self.study.get_flashcard(flashcard_id, user_id)
        if card is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Flashcard not found")
        schedule = schedule_review(quality, card.repetition, card.interval, card.ease_factor)
        card.repetition = schedule["repetition"]
        card.interval = schedule["interval"]
        card.ease_factor = schedule["ease_factor"]
        card.due_at = schedule["due_at"]
        return self.study.record_flashcard_review(user_id, card, quality, response_time_seconds, card.due_at)

    def submit_quiz(self, user_id: int, quiz_id: int, selected_answer: str, response_time_seconds: float):
        quiz = self.study.get_quiz(quiz_id, user_id)
        if quiz is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found")
        attempt = self.study.record_quiz_attempt(user_id, quiz, selected_answer, response_time_seconds)
        return {"is_correct": attempt.is_correct, "correct_answer": quiz.correct_answer, "explanation": quiz.explanation}

    def due_review(self, user_id: int):
        return self.study.due_flashcards(user_id)

    def _ensure_document(self, document_id: int, user_id: int) -> None:
        if self.documents.get_for_user(document_id, user_id) is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
