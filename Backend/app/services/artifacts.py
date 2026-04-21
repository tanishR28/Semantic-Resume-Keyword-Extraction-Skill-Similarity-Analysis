import os
import pickle
from functools import lru_cache
from urllib.request import urlretrieve

from app.core.config import settings


def _ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)


def _download_if_missing(filename: str) -> str:
    _ensure_dir(settings.models_dir)
    target = os.path.join(settings.models_dir, filename)
    if os.path.exists(target):
        return target
    url = f"{settings.hf_repo_base}/{filename}"
    urlretrieve(url, target)
    return target


@lru_cache(maxsize=1)
def load_classifier_stack():
    candidates = [
        ("resume_classifier.pkl", "clfLR.pkl"),
        ("tfidf_vectorizer.pkl", "tfIDF.pkl"),
        ("label_encoder.pkl", "encoderLabel.pkl"),
    ]
    loaded = []
    for primary, fallback in candidates:
        obj = None
        for name in (primary, fallback):
            try:
                with open(_download_if_missing(name), "rb") as fp:
                    obj = pickle.load(fp)
                break
            except Exception:
                obj = None
        if obj is None:
            raise RuntimeError(f"Failed to load model artifact: {primary}/{fallback}")
        loaded.append(obj)
    model, vectorizer, encoder = loaded
    return model, vectorizer, encoder
