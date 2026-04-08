"""Similarity scoring helpers."""

from __future__ import annotations

import numpy as np


def cosine_similarity_score(vector_a, vector_b) -> float:
    a = np.asarray(vector_a, dtype=float).ravel()
    b = np.asarray(vector_b, dtype=float).ravel()

    if a.size == 0 or b.size == 0:
        return 0.0

    denom = np.linalg.norm(a) * np.linalg.norm(b)
    if denom == 0.0:
        return 0.0

    score = float(np.dot(a, b) / denom)
    return float(np.clip(score, 0.0, 1.0))


def similarity_percentage(score: float) -> float:
    return round(max(0.0, min(1.0, float(score))) * 100.0, 2)
