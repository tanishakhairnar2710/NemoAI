from datetime import datetime

from pydantic import BaseModel, Field


class DocumentRead(BaseModel):
    id: int
    title: str
    filename: str
    category: str
    summary: str
    keywords: list[str]
    page_count: int
    word_count: int
    created_at: datetime
    flashcard_count: int = 0
    quiz_count: int = 0
    mnemonic_count: int = 0

    model_config = {"from_attributes": True}


class ChunkRead(BaseModel):
    id: int
    order_index: int
    text: str
    keywords: list[str]

    model_config = {"from_attributes": True}


class DocumentDetail(DocumentRead):
    chunks: list[ChunkRead] = []


class FlashcardRead(BaseModel):
    id: int
    document_id: int
    topic: str
    front: str
    back: str
    difficulty: str
    due_at: datetime

    model_config = {"from_attributes": True}


class FlashcardReviewIn(BaseModel):
    flashcard_id: int
    quality: int = Field(ge=0, le=5)
    response_time_seconds: float = Field(default=0, ge=0)


class QuizOption(BaseModel):
    id: str
    text: str


class QuizRead(BaseModel):
    id: int
    document_id: int
    question: str
    options: list[QuizOption]
    correct_answer: str
    explanation: str
    topic: str
    difficulty: str

    model_config = {"from_attributes": True}


class QuizSubmitIn(BaseModel):
    quiz_id: int
    selected_answer: str
    response_time_seconds: float = Field(default=0, ge=0)


class QuizSubmitOut(BaseModel):
    is_correct: bool
    correct_answer: str
    explanation: str


class MnemonicRead(BaseModel):
    id: int
    document_id: int
    topic: str
    source_terms: list[str]
    mnemonic_text: str

    model_config = {"from_attributes": True}


class MnemonicCreate(BaseModel):
    text: str = Field(min_length=2)


class AnalyticsRead(BaseModel):
    stats: dict
    progress: list[dict]
    subjects: list[dict]
    recent_activity: list[dict]
    weak_topics: list[dict]
    strong_topics: list[dict]
    review: dict


class ReviewUpdateIn(FlashcardReviewIn):
    pass
