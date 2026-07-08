import re

import networkx as nx
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def split_sentences(text: str) -> list[str]:
    return [sentence.strip() for sentence in re.split(r"(?<=[.!?])\s+", text) if len(sentence.split()) >= 6]


def summarize_text(text: str, sentence_count: int = 5) -> str:
    sentences = split_sentences(text)
    if len(sentences) <= sentence_count:
        return " ".join(sentences) if sentences else text[:1200]

    vectors = TfidfVectorizer(stop_words="english").fit_transform(sentences)
    similarity = cosine_similarity(vectors)
    np.fill_diagonal(similarity, 0)
    graph = nx.from_numpy_array(similarity)
    scores = nx.pagerank(graph, max_iter=200)
    selected = sorted(scores, key=scores.get, reverse=True)[:sentence_count]
    selected.sort()
    return " ".join(sentences[index] for index in selected)
