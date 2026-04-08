"""Text normalization and preprocessing."""

from __future__ import annotations

import re
import unicodedata
from functools import lru_cache

try:
    from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS
except Exception:  # pragma: no cover
    ENGLISH_STOP_WORDS = {
        "a", "an", "the", "and", "or", "but", "in", "on", "at", "for", "to", "of", "with",
        "is", "are", "was", "were", "be", "been", "being", "by", "as", "from", "that", "this",
        "it", "its", "their", "our", "your", "you", "i", "we", "they", "he", "she", "them",
    }

try:
    import spacy
except Exception:  # pragma: no cover
    spacy = None

from utils.pdf_parser import normalize_whitespace

_URL_RE = re.compile(r"https?://\S+|www\.\S+", re.IGNORECASE)
_EMAIL_RE = re.compile(r"\b[\w.+-]+@[\w-]+(?:\.[\w-]+)+\b")
_NON_TEXT_RE = re.compile(r"[^a-z0-9+#./\s]")
_WS_RE = re.compile(r"\s+")


@lru_cache(maxsize=1)
def _get_nlp():
    if spacy is None:
        return None
    try:
        return spacy.load("en_core_web_sm", disable=["ner", "parser"])
    except Exception:
        try:
            return spacy.blank("en")
        except Exception:
            return None


def normalize_text(text: str) -> str:
    if not text:
        return ""
    text = unicodedata.normalize("NFKC", text)
    text = _URL_RE.sub(" ", text)
    text = _EMAIL_RE.sub(" ", text)
    text = text.replace("\x00", " ")
    return normalize_whitespace(text)


def preprocess_text(text: str) -> str:
    if not text:
        return ""

    text = normalize_text(text).lower()
    text = _NON_TEXT_RE.sub(" ", text)
    text = _WS_RE.sub(" ", text).strip()

    nlp = _get_nlp()
    if nlp is None:
        return " ".join(tok for tok in text.split() if tok and tok not in ENGLISH_STOP_WORDS)

    cleaned: list[str] = []
    for token in nlp(text):
        if token.is_space or token.is_punct:
            continue
        lemma = (token.lemma_ or token.text).strip().lower()
        if lemma in {"", "-pron-"}:
            lemma = token.text.lower().strip()
        if not lemma or lemma in ENGLISH_STOP_WORDS:
            continue
        cleaned.append(lemma)

    return " ".join(cleaned)


def tokenize_text(text: str) -> list[str]:
    processed = preprocess_text(text)
    return processed.split() if processed else []
