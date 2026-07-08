from datetime import datetime, timedelta, timezone


def schedule_review(quality: int, repetition: int, interval: int, ease_factor: float) -> dict:
    quality = max(0, min(5, quality))
    if quality < 3:
        repetition = 0
        interval = 1
    else:
        repetition += 1
        if repetition == 1:
            interval = 1
        elif repetition == 2:
            interval = 6
        else:
            interval = round(interval * ease_factor)
    ease_factor = max(1.3, ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
    due_at = datetime.now(timezone.utc) + timedelta(days=interval)
    return {
        "repetition": repetition,
        "interval": interval,
        "ease_factor": round(ease_factor, 2),
        "due_at": due_at,
    }
