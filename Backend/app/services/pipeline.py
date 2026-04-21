import io
import re
from typing import Any

from PyPDF2 import PdfReader
from sklearn.metrics.pairwise import cosine_similarity

from app.models.schemas import Breakdown, ResumeResult
from app.services.artifacts import load_classifier_stack
from app.services.xai import build_xai_with_groq


TECH_KEYWORDS = {
    "python", "java", "javascript", "typescript", "react", "node", "express", "flask", "django",
    "fastapi", "mongodb", "mysql", "postgresql", "docker", "kubernetes", "aws", "azure", "gcp",
}

_NAME_STOPWORDS = {
    "resume", "curriculum vitae", "cv", "profile", "summary", "objective",
    "experience", "education", "skills", "projects", "certifications", "contact",
}

_LOCATION_STOPWORDS = {
    "india", "usa", "us", "united states", "uk", "united kingdom",
    "canada", "australia", "germany", "france", "singapore", "remote",
}


def extract_pdf_text(content: bytes) -> str:
    reader = PdfReader(io.BytesIO(content))
    texts = [(page.extract_text() or "") for page in reader.pages]
    return "\n".join(texts).strip()


def clean_text(txt: str) -> str:
    txt = re.sub(r"http\S+\s", " ", txt)
    txt = re.sub(r"[^\x00-\x7F]", " ", txt)
    txt = re.sub(r"\s+", " ", txt)
    return txt.strip()


def extract_skills(text: str) -> set[str]:
    t = text.lower()
    return {k for k in TECH_KEYWORDS if re.search(rf"\b{re.escape(k)}\b", t)}


def classify_text(text: str) -> tuple[str, float, list[float]]:
    model, vectorizer, encoder = load_classifier_stack()
    cleaned = clean_text(text)
    vect = vectorizer.transform([cleaned])
    probs = model.predict_proba(vect)[0]
    pred_idx = model.predict(vect)
    label = str(encoder.inverse_transform(pred_idx)[0])
    return label, float(max(probs)), probs.tolist()


def extract_candidate_name(resume_text: str, fallback_filename: str) -> str:
    fallback = re.sub(r"\.pdf$", "", fallback_filename, flags=re.IGNORECASE).strip()
    lines = [ln.strip() for ln in resume_text.splitlines() if ln.strip()]
    if not lines:
        return fallback

    for raw_line in lines[:12]:
        line = re.sub(r"\s+", " ", raw_line).strip()
        lower = line.lower()

        if any(tok in lower for tok in ("@", "http", "linkedin", "github", "+", "www.")):
            continue
        if any(sw == lower for sw in _NAME_STOPWORDS):
            continue
        if len(line) < 3 or len(line) > 60:
            continue

        words = line.split()
        if len(words) < 2 or len(words) > 4:
            continue

        if all(re.fullmatch(r"[A-Za-z][A-Za-z'\.-]*", w) for w in words):
            return " ".join(words)

    return fallback


def extract_candidate_location(resume_text: str) -> str:
    lines = [ln.strip() for ln in resume_text.splitlines() if ln.strip()]

    # Prefer explicit location labels when present near top of resume.
    for raw_line in lines[:20]:
        line = re.sub(r"\s+", " ", raw_line).strip()
        lower = line.lower()
        if lower.startswith("location:"):
            value = line.split(":", 1)[1].strip()
            if value:
                return value

    city_state_pattern = re.compile(r"\b([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+){0,2}),\s*([A-Z]{2})\b")
    city_country_pattern = re.compile(
        r"\b([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+){0,2}),\s*"
        r"(India|USA|US|United States|UK|United Kingdom|Canada|Australia|Germany|France|Singapore)\b",
        flags=re.IGNORECASE,
    )

    for raw_line in lines[:30]:
        line = re.sub(r"\s+", " ", raw_line).strip()
        if any(tok in line.lower() for tok in ("@", "http", "linkedin", "github", "www.")):
            continue

        m1 = city_state_pattern.search(line)
        if m1:
            return f"{m1.group(1)}, {m1.group(2)}"

        m2 = city_country_pattern.search(line)
        if m2:
            country = m2.group(2)
            normalized = country.upper() if country.lower() in {"us", "usa", "uk"} else country.title()
            return f"{m2.group(1)}, {normalized}"

        if line.lower() in _LOCATION_STOPWORDS:
            return line.title()

    text = " ".join(lines[:40])
    if re.search(r"\bremote\b", text, flags=re.IGNORECASE):
        return "Remote"

    return "N/A"


def compute_breakdown(resume_text: str, jd_text: str, resume_probs: list[float], jd_probs: list[float]) -> Breakdown:
    _, vectorizer, _ = load_classifier_stack()
    resume_vec = vectorizer.transform([clean_text(resume_text)])
    jd_vec = vectorizer.transform([clean_text(jd_text)])
    semantic = float(cosine_similarity(resume_vec, jd_vec)[0][0]) * 100

    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(jd_text)
    skills = (len(resume_skills.intersection(jd_skills)) / len(jd_skills) * 100) if jd_skills else 60.0

    exp_matches = re.findall(r"(\d+(?:\.\d+)?)\s*(?:years?|yrs?)", resume_text, flags=re.IGNORECASE)
    years = float(exp_matches[0]) if exp_matches else 0.0
    experience = min((years / 4.0) * 100, 100)

    education = 100.0 if re.search(r"bachelor|master|btech|mtech|phd", resume_text, flags=re.IGNORECASE) else 55.0
    projects = 85.0 if re.search(r"project|built|developed|implemented", resume_text, flags=re.IGNORECASE) else 40.0

    align = float(cosine_similarity([resume_probs], [jd_probs])[0][0]) * 100

    return Breakdown(
        semantic=round(semantic, 2),
        skills=round(skills, 2),
        experience=round(experience, 2),
        education=round(education, 2),
        projects=round(projects, 2),
        alignment=round(align, 2),
    )


def weighted_score(breakdown: Breakdown, weights: dict[str, float]) -> int:
    default_weights = {
        "semantic_similarity": 0.30,
        "skills_match": 0.25,
        "experience_match": 0.15,
        "education_match": 0.10,
        "projects_relevance": 0.10,
        "job_classification": 0.10,
    }

    components = {
        "semantic_similarity": breakdown.semantic,
        "skills_match": breakdown.skills,
        "experience_match": breakdown.experience,
        "education_match": breakdown.education,
        "projects_relevance": breakdown.projects,
        "job_classification": breakdown.alignment,
    }

    total_weight = sum(max(0.0, float(weights.get(k, default_weights[k]))) for k in components)
    if total_weight <= 0:
        total_weight = 1.0

    weighted_sum = sum(components[k] * max(0.0, float(weights.get(k, default_weights[k]))) for k in components)
    score = weighted_sum / total_weight
    return int(max(0, min(100, round(score))))


def integrity_from_score(score: int) -> str:
    if score >= 80:
        return "Genuine"
    if score < 50:
        return "Suspicious"
    return "Uncertain"


def run_pipeline_for_resume(filename: str, content: bytes, job: dict[str, Any]) -> ResumeResult:
    text = extract_pdf_text(content)
    if not text:
        text = filename

    jd = job.get("description", "")
    role_label, _, resume_probs = classify_text(text)
    _, _, jd_probs = classify_text(jd if jd else text)

    breakdown = compute_breakdown(text, jd if jd else text, resume_probs, jd_probs)
    score = weighted_score(breakdown, job.get("weights", {}))
    detected_skills = sorted(list(extract_skills(text)))[:10]
    candidate_name = extract_candidate_name(text, filename)
    candidate_location = extract_candidate_location(text)
    xai_insights = build_xai_with_groq(
        breakdown=breakdown,
        resume_text=text,
        jd_text=jd,
        role_label=role_label,
        score=score,
        top_skills=detected_skills,
    )

    return ResumeResult(
        id=f"res_{abs(hash(filename + str(score))) % 1000000}",
        name=candidate_name,
        score=score,
        integrity=integrity_from_score(score),
        role=role_label,
        location=candidate_location,
        skills=detected_skills or ["Pending extraction"],
        insights=[
            "Scored using modular FastAPI pipeline.",
            "Weights sourced from selected job config.",
        ],
        breakdown=breakdown,
        xai_insights=xai_insights,
        resume_url=filename,
        source="api",
    )
