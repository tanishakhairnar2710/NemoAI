from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import analytics, auth, documents, flashcards, mnemonics, quiz, review
from app.core.config import settings
from app.database.session import create_database_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_database_tables()
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description="AI-powered smart learning platform API.",
        version="1.0.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth.router)
    app.include_router(documents.router)
    app.include_router(flashcards.router)
    app.include_router(quiz.router)
    app.include_router(mnemonics.router)
    app.include_router(analytics.router)
    app.include_router(review.router)

    @app.get("/health", tags=["System"])
    def health_check() -> dict[str, str]:
        return {"status": "ok", "service": settings.PROJECT_NAME}

    return app


app = create_app()
