import re
from functools import lru_cache

from sentence_transformers import SentenceTransformer, util


MODEL_NAME = "all-MiniLM-L6-v2"
MISSING_THRESHOLD = 0.4


@lru_cache(maxsize=1)
def get_embedding_model() -> SentenceTransformer:
    return SentenceTransformer(MODEL_NAME, device="cpu")


def split_jd_requirements(jd_text: str) -> list[str]:
    parts = re.split(r"[\n\r]+|(?<=[.!?])\s+", jd_text)
    return [part.strip() for part in parts if part.strip()]


def keyword_overlap_score(text_a: str, text_b: str) -> float:
    words_a = set(re.findall(r"\b[a-zA-Z][a-zA-Z0-9+#.-]*\b", text_a.lower()))
    words_b = set(re.findall(r"\b[a-zA-Z][a-zA-Z0-9+#.-]*\b", text_b.lower()))
    if not words_a or not words_b:
        return 0.0
    return len(words_a & words_b) / len(words_b)


def _clamp_score(score: float) -> float:
    return max(0.0, min(1.0, score))


def match_resume_to_jd(resume_bullets: list[str], jd_text: str) -> dict:
    jd_requirements = split_jd_requirements(jd_text)
    if not jd_requirements:
        return {
            "matched_requirements": [],
            "missing_skills": [],
            "score": 0.0,
        }

    if not resume_bullets:
        empty_matches = [
            {
                "requirement": jd_requirement,
                "matched_text": "",
                "score": 0.0,
            }
            for jd_requirement in jd_requirements
        ]
        return {
            "matched_requirements": empty_matches,
            "missing_skills": jd_requirements,
            "score": 0.0,
        }

    model = get_embedding_model()
    resume_embeddings = model.encode(resume_bullets, convert_to_tensor=True, normalize_embeddings=True)
    jd_embeddings = model.encode(jd_requirements, convert_to_tensor=True, normalize_embeddings=True)

    similarity_matrix = util.cos_sim(jd_embeddings, resume_embeddings)

    matched_requirements: list[dict] = []
    missing_skills: list[str] = []
    requirement_scores: list[float] = []

    for jd_index, jd_requirement in enumerate(jd_requirements):
        row = similarity_matrix[jd_index]
        best_bullet_index = int(row.argmax().item())
        embedding_score = float(row[best_bullet_index].item())

        best_bullet = resume_bullets[best_bullet_index]
        keyword_score = keyword_overlap_score(best_bullet, jd_requirement)
        final_score = _clamp_score(0.7 * embedding_score + 0.3 * keyword_score)
        requirement_scores.append(final_score)

        matched_requirements.append(
            {
                "requirement": jd_requirement,
                "matched_text": best_bullet,
                "score": round(final_score * 100, 2),
            }
        )

        if final_score < MISSING_THRESHOLD:
            missing_skills.append(jd_requirement)

    overall_score = (sum(requirement_scores) / len(requirement_scores)) * 100

    return {
        "matched_requirements": matched_requirements,
        "missing_skills": missing_skills,
        "score": round(overall_score, 2),
    }
