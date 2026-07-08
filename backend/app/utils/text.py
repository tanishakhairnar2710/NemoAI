import re


def chunk_text(text: str, max_words: int = 220) -> list[str]:
    words = text.split()
    chunks = []
    for start in range(0, len(words), max_words):
        chunk = " ".join(words[start : start + max_words]).strip()
        if chunk:
            chunks.append(chunk)
    return chunks or [text[:2000]]


def title_from_filename(filename: str) -> str:
    title = re.sub(r"\.[^.]+$", "", filename)
    title = re.sub(r"[_-]+", " ", title).strip()
    return title.title() or "Untitled Document"
