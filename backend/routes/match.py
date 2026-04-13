from fastapi import APIRouter

from backend.models.match import MatchRequest, MatchResponse
from backend.services.matcher import match_resume_to_jd
from backend.services.parser import parse_resume


router = APIRouter(tags=["match"])


@router.post("/match", response_model=MatchResponse)
def match_resume(request: MatchRequest) -> MatchResponse:
    parsed_resume = parse_resume(request.resume_text)
    print(parsed_resume)
    match_result = match_resume_to_jd(parsed_resume["bullets"], request.jd_text)

    flags: list[str] = []
    if parsed_resume["experience_years"] < 2:
        flags.append("Low experience")

    total_requirements = len(match_result["matched_requirements"])
    missing_count = len(match_result["missing_skills"])
    if total_requirements > 0 and (missing_count / total_requirements) > 0.4:
        flags.append("Skill gap")

    return MatchResponse(
        score=match_result["score"],
        matched_requirements=match_result["matched_requirements"],
        missing_skills=match_result["missing_skills"],
        flags=flags,
    )
