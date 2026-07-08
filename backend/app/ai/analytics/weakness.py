from collections import defaultdict


def classify_topics(topic_stats: dict[str, dict]) -> tuple[list[dict], list[dict]]:
    weak: list[dict] = []
    strong: list[dict] = []
    for topic, stats in topic_stats.items():
        attempts = max(1, stats.get("attempts", 0))
        accuracy = round((stats.get("correct", 0) / attempts) * 100)
        item = {"topic": topic, "accuracy": accuracy, "attempts": attempts}
        if accuracy < 70:
            weak.append(item)
        elif accuracy >= 85:
            strong.append(item)
    weak.sort(key=lambda item: item["accuracy"])
    strong.sort(key=lambda item: item["accuracy"], reverse=True)
    return weak[:6], strong[:6]


def topic_stats_from_attempts(attempts) -> dict[str, dict]:
    stats = defaultdict(lambda: {"attempts": 0, "correct": 0})
    for attempt in attempts:
        topic = attempt.quiz.topic if attempt.quiz else "General"
        stats[topic]["attempts"] += 1
        stats[topic]["correct"] += int(attempt.is_correct)
    return dict(stats)
