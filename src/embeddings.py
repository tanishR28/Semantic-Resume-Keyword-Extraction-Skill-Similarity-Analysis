"""Text embedding utilities with Sentence-BERT primary backend."""

from __future__ import annotations

from functools import lru_cache
from typing import Sequence

import numpy as np

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
except Exception:  # pragma: no cover
    TfidfVectorizer = None

from utils.constants import DEFAULT_EMBEDDING_MODEL

try:
    from sentence_transformers import SentenceTransformer
except Exception:  # pragma: no cover
    SentenceTransformer = None


@lru_cache(maxsize=1)
def _load_model():
    if SentenceTransformer is None:
        return None
    try:
        return SentenceTransformer(DEFAULT_EMBEDDING_MODEL)
    except Exception:
        return None


def embedding_backend() -> str:
    return "sentence-transformers" if _load_model() is not None else "tf-idf-fallback"


def build_embeddings(texts: Sequence[str]) -> np.ndarray:
    docs = [t or "" for t in texts]
    if not docs:
        return np.zeros((0, 0), dtype=float)

    if not any(d.strip() for d in docs):
        return np.zeros((len(docs), 1), dtype=float)

    model = _load_model()
    if model is not None:
        try:
            vectors = model.encode(docs, convert_to_numpy=True, show_progress_bar=False)
            return np.asarray(vectors, dtype=float)
        except Exception:
            pass

    if TfidfVectorizer is not None:
        vectorizer = TfidfVectorizer(ngram_range=(1, 2), min_df=1)
        try:
            return vectorizer.fit_transform(docs).toarray().astype(float, copy=False)
        except Exception:
            pass

    # Lightweight no-dependency fallback based on token frequencies.
    vocab: dict[str, int] = {}
    tokenized: list[list[str]] = []
    for doc in docs:
        tokens = doc.lower().split()
        tokenized.append(tokens)
        for token in tokens:
            if token not in vocab:
                vocab[token] = len(vocab)

    if not vocab:
        return np.zeros((len(docs), 1), dtype=float)

    matrix = np.zeros((len(docs), len(vocab)), dtype=float)
    for row, tokens in enumerate(tokenized):
        for token in tokens:
            matrix[row, vocab[token]] += 1.0

    norms = np.linalg.norm(matrix, axis=1, keepdims=True)
    norms[norms == 0] = 1.0
    return matrix / norms
