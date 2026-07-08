from fastapi import APIRouter, Depends, UploadFile
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.models.entities import User
from app.schemas.learning import DocumentDetail, DocumentRead
from app.services.document_service import DocumentService

router = APIRouter(tags=["Documents"])


def enrich_document(document):
    document.flashcard_count = len(getattr(document, "flashcards", []))
    document.quiz_count = len(getattr(document, "quizzes", []))
    document.mnemonic_count = len(getattr(document, "mnemonics", []))
    return document


@router.post("/upload", response_model=DocumentDetail)
async def upload(file: UploadFile, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return enrich_document(await DocumentService(db).upload_document(current_user.id, file))


@router.get("/documents", response_model=list[DocumentRead])
def documents(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return [enrich_document(document) for document in DocumentService(db).list_documents(current_user.id)]


@router.get("/documents/{document_id}", response_model=DocumentDetail)
def document_detail(document_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return enrich_document(DocumentService(db).get_document(document_id, current_user.id))


@router.delete("/documents/{document_id}", status_code=204)
def delete_document(document_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    DocumentService(db).delete_document(document_id, current_user.id)


@router.get("/documents/{document_id}/summary")
def document_summary(document_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    document = DocumentService(db).get_document(document_id, current_user.id)
    return {"document_id": document.id, "summary": document.summary, "keywords": document.keywords}
