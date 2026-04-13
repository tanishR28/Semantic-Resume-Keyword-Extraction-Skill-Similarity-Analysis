import re


SKILL_KEYWORDS = ["python", "java", "docker", "kubernetes", "aws", "react", "node", "sql"]
BULLET_PREFIXES = ("-", "•")
BULLET_VERBS = ("developed", "built", "led", "created")


def parse_resume(text: str) -> dict:
    lines = [line.strip() for line in text.splitlines() if line.strip()]

    bullets: list[str] = []
    for line in lines:
        lower_line = line.lower()
        if line.startswith(BULLET_PREFIXES):
            bullets.append(line.lstrip("-• ").strip())
            continue
        if lower_line.startswith(BULLET_VERBS):
            bullets.append(line)

    text_lower = text.lower()
    skills = [skill for skill in SKILL_KEYWORDS if re.search(rf"\b{re.escape(skill)}\b", text_lower)]

    year_matches = re.findall(r"(\d+)\s+years?", text_lower)
    experience_years = max((int(year) for year in year_matches), default=0)

    return {
        "bullets": bullets,
        "skills": skills,
        "experience_years": experience_years,
    }