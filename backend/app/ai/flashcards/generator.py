import re


def estimate_difficulty(text: str) -> str:
    words = text.split()
    if len(words) > 45:
        return "hard"
    if len(words) < 22:
        return "easy"
    return "medium"


def generate_flashcards(chunks: list[dict], max_cards: int = 24) -> list[dict]:
    cards: list[dict] = []
    for chunk in chunks:
        keywords = chunk.get("keywords", [])[:4]
        sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", chunk["text"]) if len(s.split()) > 7]
        for keyword in keywords:
            supporting = next((sentence for sentence in sentences if keyword.split()[0].lower() in sentence.lower()), None)
            if not supporting:
                continue
            cards.append(
                {
                    "topic": keyword,
                    "front": f"What should you remember about {keyword}?",
                    "back": supporting,
                    "difficulty": estimate_difficulty(supporting),
                    "chunk_order": chunk["order_index"],
                }
            )
            if len(cards) >= max_cards:
                return cards

    # Fallback: create a generic flashcard per chunk if no cards were generated
    if not cards:
        for chunk in chunks[:max_cards]:
            snippet = chunk["text"][:250].rstrip()
            cards.append(
                {
                    "topic": "Key Concept",
                    "front": "Summarize the most important idea from this passage.",
                    "back": snippet,
                    "difficulty": estimate_difficulty(snippet),
                    "chunk_order": chunk["order_index"],
                }
            )
    return cards
