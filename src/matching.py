"""Core matching logic for resume and job description."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Iterable

from src.embeddings import build_embeddings, embedding_backend
from src.preprocessing import preprocess_text
from src.similarity import cosine_similarity_score
from src.skill_extraction import extract_skills
from utils.constants import SKILL_CATALOG


@dataclass(slots=True)
class MatchResult:
    similarity_score: float
    matched_skills: list[str]
    missing_skills: list[str]
    resume_skills: list[str]
    jd_skills: list[str]
    skill_coverage: float
    embedding_backend: str
    analysis_notes: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return asdict(self)


def _ordered_overlap(reference: list[str], present: set[str]) -> list[str]:
    result: list[str] = []
    seen: set[str] = set()
    for skill in reference:
        if skill in present and skill not in seen:
            seen.add(skill)
            result.append(skill)
    return result


def analyze_match(
    resume_text: str,
    job_description: str,
    extra_skills: Iterable[str] | None = None,
) -> MatchResult:
    resume_text = resume_text or ""
    job_description = job_description or ""

    notes: list[str] = []
    if not resume_text.strip():
        notes.append("Resume text is empty or could not be extracted from the uploaded file.")
    if not job_description.strip():
        notes.append("Job description text is empty.")

    clean_resume = preprocess_text(resume_text)
    clean_jd = preprocess_text(job_description)

    vectors = build_embeddings([clean_resume or resume_text, clean_jd or job_description])
    similarity = cosine_similarity_score(vectors[0], vectors[1]) if len(vectors) >= 2 else 0.0

    catalog = extra_skills or SKILL_CATALOG
    resume_skills = extract_skills(resume_text, extra_skills=catalog)
    jd_skills = extract_skills(job_description, extra_skills=catalog)

    resume_set = set(resume_skills)
    jd_set = set(jd_skills)

    matched = _ordered_overlap(jd_skills, resume_set)
    missing = [skill for skill in jd_skills if skill not in resume_set]
    coverage = round(len(matched) / len(jd_skills), 4) if jd_skills else 0.0

    if not jd_skills:
        notes.append("No predefined skills were detected in the job description.")
    if not resume_skills:
        notes.append("No predefined skills were detected in the resume.")
    if jd_set and resume_set and jd_set.isdisjoint(resume_set):
        notes.append("Resume and job description have no exact overlap in the predefined skill catalog.")

    return MatchResult(
        similarity_score=similarity,
        matched_skills=matched,
        missing_skills=missing,
        resume_skills=resume_skills,
        jd_skills=jd_skills,
        skill_coverage=coverage,
        embedding_backend=embedding_backend(),
        analysis_notes=notes,
    )


def summarize_match_result(result: MatchResult) -> str:
    if result.similarity_score >= 0.75:
        opening = "The resume is strongly aligned with this role."
    elif result.similarity_score >= 0.5:
        opening = "The resume is moderately aligned with this role."
    else:
        opening = "The resume currently shows low alignment with this role."

    matched = ", ".join(result.matched_skills[:5]) if result.matched_skills else "no exact skill matches"
    missing = ", ".join(result.missing_skills[:5]) if result.missing_skills else "no major gaps"

    return f"{opening} Matched skills: {matched}. Priority gaps: {missing}."
