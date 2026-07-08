from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.ai.analytics.weakness import classify_topics, topic_stats_from_attempts
from app.models.entities import Document, FlashcardReview, QuizAttempt, User
from app.repositories.study_repository import StudyRepository


class AnalyticsService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.study = StudyRepository(db)

    def dashboard(self, user: User) -> dict:
        documents = list(self.db.scalars(select(Document).where(Document.user_id == user.id)).all())
        attempts = list(
            self.db.scalars(
                select(QuizAttempt).where(QuizAttempt.user_id == user.id).options(selectinload(QuizAttempt.quiz))
            ).all()
        )
        reviews = list(self.db.scalars(select(FlashcardReview).where(FlashcardReview.user_id == user.id)).all())
        due_cards = self.study.due_flashcards(user.id)
        quiz_total = len(attempts)
        quiz_correct = sum(1 for attempt in attempts if attempt.is_correct)
        mastery = round((quiz_correct / quiz_total) * 100) if quiz_total else 0

        topic_stats = topic_stats_from_attempts(attempts)
        weak_topics, strong_topics = classify_topics(topic_stats)
        recent_activity = self._recent_activity(documents, attempts, reviews)

        return {
            "stats": {
                "documents": len(documents),
                "mastery": mastery,
                "current_streak": self._review_streak(reviews),
                "study_time_hours": round(sum(a.response_time_seconds for a in attempts) / 3600, 1),
                "cards_reviewed": len(reviews),
                "average_quiz_score": mastery,
                "due_cards": len(due_cards),
            },
            "progress": self._progress_series(attempts, reviews),
            "subjects": self._subject_series(documents, attempts),
            "recent_activity": recent_activity,
            "weak_topics": weak_topics,
            "strong_topics": strong_topics,
            "review": {
                "due_count": len(due_cards),
                "cards": [
                    {
                        "id": card.id,
                        "document_id": card.document_id,
                        "topic": card.topic,
                        "front": card.front,
                        "back": card.back,
                        "difficulty": card.difficulty,
                        "due_at": card.due_at.isoformat(),
                    }
                    for card in due_cards[:20]
                ],
            },
        }

    def _recent_activity(self, documents, attempts, reviews) -> list[dict]:
        activity = []
        for document in documents[:5]:
            activity.append({"id": f"doc-{document.id}", "title": document.title, "type": "Document Upload", "time": document.created_at.isoformat(), "score": None})
        for attempt in attempts[-5:]:
            activity.append({"id": f"quiz-{attempt.id}", "title": attempt.quiz.topic, "type": "Quiz", "time": attempt.attempted_at.isoformat(), "score": 100 if attempt.is_correct else 0})
        for review in reviews[-5:]:
            activity.append({"id": f"review-{review.id}", "title": "Flashcard Review", "type": "Review", "time": review.reviewed_at.isoformat(), "score": review.quality * 20})
        return sorted(activity, key=lambda item: item["time"], reverse=True)[:8]

    def _progress_series(self, attempts, reviews) -> list[dict]:
        today = datetime.now(timezone.utc).date()
        series = []
        for offset in range(6, -1, -1):
            day = today - timedelta(days=offset)
            day_attempts = [attempt for attempt in attempts if attempt.attempted_at.date() == day]
            day_reviews = [review for review in reviews if review.reviewed_at.date() == day]
            correct = sum(1 for attempt in day_attempts if attempt.is_correct)
            total = len(day_attempts)
            score = round((correct / total) * 100) if total else min(100, len(day_reviews) * 10)
            series.append({"name": day.strftime("%a"), "score": score})
        return series

    def _subject_series(self, documents, attempts) -> list[dict]:
        categories = Counter(document.category for document in documents)
        by_topic = defaultdict(lambda: {"total": 0, "correct": 0})
        for attempt in attempts:
            topic = attempt.quiz.topic if attempt.quiz else "General"
            by_topic[topic]["total"] += 1
            by_topic[topic]["correct"] += int(attempt.is_correct)
        if by_topic:
            return [
                {"name": topic[:12], "score": round((values["correct"] / max(1, values["total"])) * 100)}
                for topic, values in list(by_topic.items())[:8]
            ]
        return [{"name": name, "score": min(100, count * 20)} for name, count in categories.items()]

    def _review_streak(self, reviews) -> int:
        days = {review.reviewed_at.date() for review in reviews}
        streak = 0
        cursor = datetime.now(timezone.utc).date()
        while cursor in days:
            streak += 1
            cursor -= timedelta(days=1)
        return streak
