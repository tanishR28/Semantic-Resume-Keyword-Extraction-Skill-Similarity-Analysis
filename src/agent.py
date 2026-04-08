"""Groq-powered explainability layer for match results."""

from __future__ import annotations

import json
import os

from src.matching import MatchResult, summarize_match_result
from utils.constants import DEFAULT_GROQ_MODEL, MAX_AI_OUTPUT_CHARS


def _as_dict(match_result) -> dict:
    if isinstance(match_result, MatchResult):
        return match_result.to_dict()
    if isinstance(match_result, dict):
        return match_result
    raise TypeError("match_result must be MatchResult or dict")


def _fallback_summary(result_dict: dict) -> str:
    result = MatchResult(**result_dict)
    base = summarize_match_result(result)
    if result.analysis_notes:
        return f"{base} {result.analysis_notes[0]}"
    return base


def generate_ai_insight(
    match_result,
    resume_text: str = "",
    job_description: str = "",
    api_key: str | None = None,
    model: str = DEFAULT_GROQ_MODEL,
) -> str:
    """Generate insight with Groq; fallback to deterministic local summary."""

    result_dict = _as_dict(match_result)
    fallback = _fallback_summary(result_dict)

    key = (api_key or os.getenv("GROQ_API_KEY", "")).strip()
    if not key:
        return fallback

    try:
        from groq import Groq
    except Exception:
        return fallback

    payload = {
        "match_result": result_dict,
        "resume_excerpt": (resume_text or "")[:2000],
        "job_description_excerpt": (job_description or "")[:2000],
    }

    try:
        client = Groq(api_key=key)
        completion = client.chat.completions.create(
            model=model,
            temperature=0.2,
            max_tokens=320,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an ATS and resume-matching expert. "
                        "Respond in exactly three concise bullet points: strengths, gaps, next actions."
                    ),
                },
                {
                    "role": "user",
                    "content": "Analyze this resume vs job description result:\n\n" + json.dumps(payload, indent=2),
                },
            ],
        )
        text = (completion.choices[0].message.content or "").strip()
        return text[:MAX_AI_OUTPUT_CHARS] if text else fallback
    except Exception:
        return fallback
