import os
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.ai.flashcards.generator import generate_flashcards
from app.ai.keywords.tfidf import extract_keywords
from app.ai.mnemonics.generator import generate_mnemonic
from app.ai.pdf.extractor import extract_text_from_pdf, read_plain_text
from app.ai.quizzes.generator import generate_quizzes
from app.ai.summarizer.textrank import summarize_text
from app.core.config import settings
from app.models.entities import Flashcard, Mnemonic, Quiz
from app.repositories.document_repository import DocumentRepository
from app.repositories.study_repository import StudyRepository
from app.utils.text import chunk_text, title_from_filename


class DocumentService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.documents = DocumentRepository(db)
        self.study = StudyRepository(db)

    def list_documents(self, user_id: int):
        return self.documents.list_for_user(user_id)

    def get_document(self, document_id: int, user_id: int):
        document = self.documents.get_for_user(document_id, user_id)
        if document is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
        return document

    def delete_document(self, document_id: int, user_id: int) -> None:
        document = self.get_document(document_id, user_id)
        self.documents.delete(document)

    async def upload_document(self, user_id: int, file: UploadFile):
        suffix = Path(file.filename or "upload.pdf").suffix.lower()
        if suffix not in {".pdf", ".txt"}:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only PDF and TXT files are supported")

        upload_dir = Path(settings.UPLOAD_DIR)
        upload_dir.mkdir(parents=True, exist_ok=True)
        safe_name = f"{uuid4().hex}{suffix}"
        path = upload_dir / safe_name
        content = await file.read()
        path.write_bytes(content)

        if suffix == ".pdf":
            text, page_count = extract_text_from_pdf(path)
        else:
            text, page_count = read_plain_text(path)
        if not text.strip():
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="No readable text found")

        chunks = []
        for index, chunk in enumerate(chunk_text(text)):
            chunks.append({"order_index": index, "text": chunk, "keywords": extract_keywords(chunk, limit=6)})

        document = self.documents.create_with_chunks(
            user_id=user_id,
            title=title_from_filename(file.filename or safe_name),
            filename=file.filename or safe_name,
            file_type=suffix.replace(".", ""),
            summary=summarize_text(text),
            keywords=extract_keywords(text, limit=12),
            page_count=page_count,
            word_count=len(text.split()),
            chunks=chunks,
        )

        flashcard_payloads = generate_flashcards(chunks)
        card_models = [
            Flashcard(
                document_id=document.id,
                chunk_id=document.chunks[item["chunk_order"]].id if document.chunks else None,
                topic=item["topic"],
                front=item["front"],
                back=item["back"],
                difficulty=item["difficulty"],
            )
            for item in flashcard_payloads
        ]
        self.study.add_flashcards(card_models)

        quiz_payloads = generate_quizzes(chunks)
        quiz_models = [
            Quiz(
                document_id=document.id,
                chunk_id=document.chunks[item["chunk_order"]].id if document.chunks else None,
                question=item["question"],
                options=item["options"],
                correct_answer=item["correct_answer"],
                explanation=item["explanation"],
                topic=item["topic"],
                difficulty=item["difficulty"],
            )
            for item in quiz_payloads
        ]
        self.study.add_quizzes(quiz_models)

        terms = document.keywords[:7]
        if terms:
            self.study.add_mnemonics(
                [Mnemonic(document_id=document.id, topic="Key Terms", source_terms=terms, mnemonic_text=generate_mnemonic(terms))]
            )

        return self.get_document(document.id, user_id)
