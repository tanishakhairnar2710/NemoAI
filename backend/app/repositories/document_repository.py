from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.entities import Chunk, Document, DocumentProgress


class DocumentRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_for_user(self, user_id: int) -> list[Document]:
        statement = (
            select(Document)
            .where(Document.user_id == user_id)
            .options(selectinload(Document.flashcards), selectinload(Document.quizzes), selectinload(Document.mnemonics))
            .order_by(Document.created_at.desc())
        )
        return list(self.db.scalars(statement).all())

    def get_for_user(self, document_id: int, user_id: int) -> Document | None:
        statement = (
            select(Document)
            .where(Document.id == document_id, Document.user_id == user_id)
            .options(
                selectinload(Document.chunks),
                selectinload(Document.flashcards),
                selectinload(Document.quizzes),
                selectinload(Document.mnemonics),
            )
        )
        return self.db.scalar(statement)

    def create_with_chunks(
        self,
        user_id: int,
        title: str,
        filename: str,
        file_type: str,
        summary: str,
        keywords: list[str],
        page_count: int,
        word_count: int,
        chunks: list[dict],
    ) -> Document:
        document = Document(
            user_id=user_id,
            title=title,
            filename=filename,
            file_type=file_type,
            summary=summary,
            keywords=keywords,
            page_count=page_count,
            word_count=word_count,
        )
        document.chunks = [
            Chunk(order_index=index, text=chunk["text"], keywords=chunk.get("keywords", []))
            for index, chunk in enumerate(chunks)
        ]
        document.progress = [DocumentProgress(user_id=user_id, completion_percent=0, last_opened_at=datetime.now(timezone.utc))]
        self.db.add(document)
        self.db.commit()
        self.db.refresh(document)
        return document

    def delete(self, document: Document) -> None:
        self.db.delete(document)
        self.db.commit()
