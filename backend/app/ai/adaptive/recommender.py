import random


def weighted_flashcards(cards, weak_topics: list[dict], limit: int = 20):
    weights = {item["topic"]: max(1, 100 - item["accuracy"]) for item in weak_topics}
    ordered = sorted(cards, key=lambda card: weights.get(card.topic, random.randint(1, 20)), reverse=True)
    return ordered[:limit]
