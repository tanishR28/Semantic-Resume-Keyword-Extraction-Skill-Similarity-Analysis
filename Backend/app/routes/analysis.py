from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import Response

from app.models.schemas import AnalysisResponse, AnalysisRunRecord
from app.repositories.jobs_repository import get_job_by_id
from app.repositories.analysis_repository import get_pdf_bytes, list_analysis_runs_by_job, save_analysis_run
from app.services.pipeline import run_pipeline_for_resume

router = APIRouter()


@router.post("/run", response_model=AnalysisResponse)
async def run_analysis(job_id: str = Form(...), files: list[UploadFile] = File(...)) -> AnalysisResponse:
    job = await get_job_by_id(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    results = []
    persisted_payload = []
    for file in files:
        if not file.filename.lower().endswith(".pdf"):
            continue
        content = await file.read()
        if not content:
            continue
        result = run_pipeline_for_resume(file.filename, content, job)
        results.append(result)
        persisted_payload.append((result, file.filename, content))

    results.sort(key=lambda r: r.score, reverse=True)
    if persisted_payload:
        await save_analysis_run(job_id=job_id, resumes_with_files=persisted_payload)
    return AnalysisResponse(job_id=job_id, resumes=results)


@router.get("/history/{job_id}", response_model=list[AnalysisRunRecord])
async def get_job_analysis_history(job_id: str) -> list[AnalysisRunRecord]:
    job = await get_job_by_id(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    runs = await list_analysis_runs_by_job(job_id)
    return [AnalysisRunRecord(**run) for run in runs]


@router.get("/resume/{file_id}")
async def download_resume_pdf(file_id: str) -> Response:
    pdf = await get_pdf_bytes(file_id)
    if not pdf:
        raise HTTPException(status_code=404, detail="Resume PDF not found")

    filename, content = pdf
    return Response(
        content=content,
        media_type="application/pdf",
        headers={"Content-Disposition": f'inline; filename="{filename}"'},
    )
