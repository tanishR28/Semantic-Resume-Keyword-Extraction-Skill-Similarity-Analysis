from pydantic import BaseModel, Field


class WeightConfig(BaseModel):
    semantic_similarity: float = Field(0.30, ge=0, le=1)
    skills_match: float = Field(0.25, ge=0, le=1)
    experience_match: float = Field(0.15, ge=0, le=1)
    education_match: float = Field(0.10, ge=0, le=1)
    projects_relevance: float = Field(0.10, ge=0, le=1)
    job_classification: float = Field(0.10, ge=0, le=1)


class JobCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    description: str = Field(..., min_length=20)
    weights: WeightConfig


class JobResponse(JobCreate):
    id: str


class Breakdown(BaseModel):
    semantic: float
    skills: float
    experience: float
    education: float
    projects: float
    alignment: float


class XAIInsights(BaseModel):
    strengths: list[str]
    gaps: list[str]
    verdict: str


class ResumeResult(BaseModel):
    id: str
    name: str
    score: int
    integrity: str
    role: str
    location: str
    skills: list[str]
    insights: list[str]
    breakdown: Breakdown
    xai_insights: XAIInsights
    resume_url: str
    source: str = "api"


class AnalysisResponse(BaseModel):
    job_id: str
    resumes: list[ResumeResult]


class StoredResumeAnalysis(BaseModel):
    file_id: str
    original_filename: str
    analysis: ResumeResult


class AnalysisRunRecord(BaseModel):
    id: str
    job_id: str
    created_at: str
    resumes: list[StoredResumeAnalysis]
