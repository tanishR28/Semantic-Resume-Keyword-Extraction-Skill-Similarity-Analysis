"""PDF text extraction helpers."""

from __future__ import annotations

import importlib
from io import BytesIO
from pathlib import Path

try:
    from PyPDF2 import PdfReader
except Exception:  # pragma: no cover
    try:
        PdfReader = importlib.import_module("pypdf").PdfReader
    except Exception:  # pragma: no cover
        PdfReader = None

try:
    import pdfplumber
except Exception:  # pragma: no cover
    pdfplumber = None

try:
    from pdfminer.high_level import extract_text as pdfminer_extract_text
except Exception:  # pragma: no cover
    pdfminer_extract_text = None


def normalize_whitespace(text: str) -> str:
    return " ".join((text or "").split())


def _read_pdf_bytes(file_obj) -> bytes:
    if file_obj is None:
        return b""

    if isinstance(file_obj, (str, Path)):
        try:
            return Path(file_obj).read_bytes()
        except Exception:
            return b""

    try:
        if hasattr(file_obj, "seek"):
            file_obj.seek(0)
        if hasattr(file_obj, "read"):
            data = file_obj.read()
            if hasattr(file_obj, "seek"):
                file_obj.seek(0)
            return data if isinstance(data, bytes) else bytes(data)
        if isinstance(file_obj, (bytes, bytearray)):
            return bytes(file_obj)
    except Exception:
        return b""

    return b""


def _extract_with_pypdf(raw_bytes: bytes) -> str:
    if PdfReader is None:
        return ""
    try:
        reader = PdfReader(BytesIO(raw_bytes))
    except Exception:
        return ""

    chunks: list[str] = []
    for page in reader.pages:
        try:
            text = page.extract_text() or ""
        except Exception:
            text = ""
        if text.strip():
            chunks.append(text)
    return "\n".join(chunks).strip()


def _extract_with_pdfplumber(raw_bytes: bytes) -> str:
    if pdfplumber is None:
        return ""
    try:
        with pdfplumber.open(BytesIO(raw_bytes)) as pdf:
            chunks = [(page.extract_text() or "").strip() for page in pdf.pages]
    except Exception:
        return ""
    return "\n".join([item for item in chunks if item]).strip()


def _extract_with_pdfminer(raw_bytes: bytes) -> str:
    if pdfminer_extract_text is None:
        return ""
    try:
        return (pdfminer_extract_text(BytesIO(raw_bytes)) or "").strip()
    except Exception:
        return ""


def extract_text_from_pdf(file_obj) -> str:
    """Extract text using multiple parsers for better compatibility."""

    raw_bytes = _read_pdf_bytes(file_obj)
    if not raw_bytes:
        return ""

    for extractor in (_extract_with_pypdf, _extract_with_pdfplumber, _extract_with_pdfminer):
        text = extractor(raw_bytes)
        if text:
            return normalize_whitespace(text)

    return ""
