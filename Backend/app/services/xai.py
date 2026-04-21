import json
import re

from app.core.config import settings
from app.models.schemas import Breakdown, XAIInsights


def _heuristic_xai(breakdown: Breakdown) -> XAIInsights:
    strengths = []
    gaps = []

    if breakdown.skills >= 70:
        strengths.append("Strong skills overlap with JD requirements.")
    if breakdown.semantic >= 65:
        strengths.append("High semantic similarity with the selected job context.")
    if breakdown.alignment >= 60:
        strengths.append("Classification alignment indicates role consistency.")

    if breakdown.experience < 45:
        gaps.append("Experience signal appears lower than expected for this role.")
    if breakdown.projects < 50:
        gaps.append("Project evidence is limited or weakly described.")

    if not strengths:
        strengths.append("Baseline fit found; requires manual review.")
    if not gaps:
        gaps.append("No major gaps detected by heuristic checks.")

    verdict = "Resume demonstrates a workable fit; verify details with full backend parsers."
    return XAIInsights(strengths=strengths, gaps=gaps, verdict=verdict)


def _parse_llm_json(content: str) -> dict | None:
    text = (content or "").strip()
    if not text:
        return None

    fenced = re.match(r"^```(?:json)?\s*(.*?)\s*```$", text, flags=re.DOTALL | re.IGNORECASE)
    if fenced:
        text = fenced.group(1).strip()

    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict):
            return parsed
    except Exception:
        return None

    return None


def build_xai_with_groq(
    breakdown: Breakdown,
    resume_text: str,
    jd_text: str,
    role_label: str,
    score: int,
    top_skills: list[str],
) -> XAIInsights:
    if not settings.groq_api_key.strip():
        return _heuristic_xai(breakdown)

    try:
        from groq import Groq
    except Exception:
        return _heuristic_xai(breakdown)

    prompt_payload = {
        "role_label": role_label,
        "score": score,
        "breakdown": {
            "semantic": breakdown.semantic,
            "skills": breakdown.skills,
            "experience": breakdown.experience,
            "education": breakdown.education,
            "projects": breakdown.projects,
            "alignment": breakdown.alignment,
        },
        "detected_resume_skills": top_skills,
        "resume_excerpt": resume_text[:2500],
        "jd_excerpt": jd_text[:2500],
    }

    system_prompt = (
        "You are an ATS explanation assistant. Return ONLY valid JSON with keys: "
        "strengths (array of 2-4 strings), gaps (array of 2-4 strings), verdict (string). "
        "Keep output grounded in given signals. Do not invent qualifications."
    )
    user_prompt = (
        "Generate recruiter-facing explainable AI summary based on provided data. "
        "No markdown, no extra keys, JSON only.\n\n"
        f"Signals JSON:\n{json.dumps(prompt_payload, ensure_ascii=False)}"
    )

    try:
        client = Groq(api_key=settings.groq_api_key)
        completion = client.chat.completions.create(
            model=settings.groq_model,
            temperature=0.2,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        )
        content = completion.choices[0].message.content if completion.choices else ""
    except Exception:
        return _heuristic_xai(breakdown)

    parsed = _parse_llm_json(content or "")
    if not parsed:
        return _heuristic_xai(breakdown)

    strengths = [str(x).strip() for x in parsed.get("strengths", []) if str(x).strip()]
    gaps = [str(x).strip() for x in parsed.get("gaps", []) if str(x).strip()]
    verdict = str(parsed.get("verdict", "")).strip()

    if not strengths:
        strengths = _heuristic_xai(breakdown).strengths
    if not gaps:
        gaps = _heuristic_xai(breakdown).gaps
    if not verdict:
        verdict = _heuristic_xai(breakdown).verdict

    return XAIInsights(strengths=strengths[:4], gaps=gaps[:4], verdict=verdict)
