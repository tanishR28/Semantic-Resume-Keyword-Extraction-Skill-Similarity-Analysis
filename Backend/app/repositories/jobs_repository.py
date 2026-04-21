from datetime import datetime, timezone
from typing import Any

from app.db.mongodb import get_database, serialize_doc
from app.models.schemas import JobCreate


COLLECTION = "jobs"


async def create_job(payload: JobCreate) -> dict[str, Any]:
    db = await get_database()
    doc = payload.model_dump()
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    result = await db[COLLECTION].insert_one(doc)
    inserted = await db[COLLECTION].find_one({"_id": result.inserted_id})
    return serialize_doc(inserted) or {}


async def list_jobs() -> list[dict[str, Any]]:
    db = await get_database()
    docs = await db[COLLECTION].find().sort("created_at", -1).to_list(length=200)
    return [serialize_doc(doc) or {} for doc in docs]


async def get_job_by_id(job_id: str) -> dict[str, Any] | None:
    from bson import ObjectId

    db = await get_database()
    if not ObjectId.is_valid(job_id):
        return None
    doc = await db[COLLECTION].find_one({"_id": ObjectId(job_id)})
    return serialize_doc(doc)
