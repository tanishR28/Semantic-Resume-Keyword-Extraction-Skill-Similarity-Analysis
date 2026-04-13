from pydantic import BaseModel, Field


class MatchRequest(BaseModel):
    resume_text: str = Field(..., min_length=1)
    jd_text: str = Field(..., min_length=1)


class RequirementMatch(BaseModel):
    requirement: str
    matched_text: str
    score: float


class MatchResponse(BaseModel):
    score: float
    matched_requirements: list[RequirementMatch]
    missing_skills: list[str]
    flags: list[str]
