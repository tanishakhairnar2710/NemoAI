from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.models.entities import User
from app.schemas.learning import MnemonicCreate, MnemonicRead
from app.services.study_service import StudyService

router = APIRouter(tags=["Mnemonics"])


@router.get("/mnemonics/{document_id}", response_model=list[MnemonicRead])
def mnemonics(document_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return StudyService(db).mnemonics(document_id, current_user.id)


@router.post("/mnemonics", response_model=MnemonicRead)
def create_mnemonic(payload: MnemonicCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return StudyService(db).create_mnemonic_from_text(current_user.id, payload.text)
