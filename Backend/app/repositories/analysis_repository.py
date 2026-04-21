from datetime import datetime, timezone
from typing import Any

from bson import ObjectId
from gridfs.errors import NoFile
from motor.motor_asyncio import AsyncIOMotorGridFSBucket

from app.db.mongodb import get_database, serialize_doc
from app.models.schemas import ResumeResult

COLLECTION = "analysis_runs"


async def _get_bucket() -> AsyncIOMotorGridFSBucket:
    db = await get_database()
    return AsyncIOMotorGridFSBucket(db, bucket_name="resume_files")


async def save_analysis_run(
    job_id: str,
    resumes_with_files: list[tuple[ResumeResult, str, bytes]],
) -> dict[str, Any]:
    db = await get_database()
    bucket = await _get_bucket()

    stored_resumes: list[dict[str, Any]] = []
    for result, original_filename, pdf_bytes in resumes_with_files:
        file_id = await bucket.upload_from_stream(
            filename=original_filename,
            source=pdf_bytes,
            metadata={"job_id": job_id, "resume_id": result.id, "source": "analysis"},
        )
        stored_resumes.append(
            {
                "file_id": str(file_id),
                "original_filename": original_filename,
                "analysis": result.model_dump(),
            }
        )

    doc = {
        "job_id": job_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "resumes": stored_resumes,
    }
    inserted = await db[COLLECTION].insert_one(doc)
    created = await db[COLLECTION].find_one({"_id": inserted.inserted_id})
    return serialize_doc(created) or {}


async def list_analysis_runs_by_job(job_id: str, limit: int = 20) -> list[dict[str, Any]]:
    db = await get_database()
    docs = await db[COLLECTION].find({"job_id": job_id}).sort("created_at", -1).to_list(length=limit)
    return [serialize_doc(doc) or {} for doc in docs]


async def get_pdf_bytes(file_id: str) -> tuple[str, bytes] | None:
    if not ObjectId.is_valid(file_id):
        return None

    bucket = await _get_bucket()
    oid = ObjectId(file_id)

    try:
        stream = await bucket.open_download_stream(oid)
        content = await stream.read()
        return stream.filename or "resume.pdf", content
    except NoFile:
        return None
