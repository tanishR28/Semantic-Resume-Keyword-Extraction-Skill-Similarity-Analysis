from typing import Any

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import settings

_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None


def serialize_doc(doc: dict[str, Any] | None) -> dict[str, Any] | None:
    if not doc:
        return doc
    if "_id" in doc:
        doc["id"] = str(doc.pop("_id"))
    return doc


async def get_database() -> AsyncIOMotorDatabase:
    global _client, _db
    if _db is not None:
        return _db

    # Use default MongoDB driver pool behavior for local dev; tune only when runtime profile is known.
    _client = AsyncIOMotorClient(settings.mongodb_uri, appname="talentpulse-api")
    _db = _client[settings.mongodb_db_name]
    return _db


async def close_mongo_client() -> None:
    global _client, _db
    if _client is not None:
        _client.close()
    _client = None
    _db = None
