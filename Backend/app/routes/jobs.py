from fastapi import APIRouter

from app.models.schemas import JobCreate, JobResponse
from app.repositories.jobs_repository import create_job, list_jobs

router = APIRouter()


@router.get("", response_model=list[JobResponse])
async def get_jobs() -> list[JobResponse]:
    jobs = await list_jobs()
    return [JobResponse(**job) for job in jobs]


@router.post("", response_model=JobResponse)
async def add_job(payload: JobCreate) -> JobResponse:
    job = await create_job(payload)
    return JobResponse(**job)
