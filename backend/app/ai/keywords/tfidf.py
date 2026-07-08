import re

from sklearn.feature_extraction.text import TfidfVectorizer


def extract_keywords(text: str, limit: int = 12) -> list[str]:
    sentences = [sentence.strip() for sentence in re.split(r"(?<=[.!?])\s+", text) if len(sentence.split()) > 3]
    if not sentences:
        return []
    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), max_features=80)
    matrix = vectorizer.fit_transform(sentences)
    scores = matrix.sum(axis=0).A1
    terms = vectorizer.get_feature_names_out()
    ranked = sorted(zip(terms, scores, strict=True), key=lambda item: item[1], reverse=True)
    return [term.title() for term, _ in ranked[:limit]]
