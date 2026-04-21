from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.mongodb import close_mongo_client, get_database
from app.routes.analysis import router as analysis_router
from app.routes.jobs import router as jobs_router


app = FastAPI(title="TalentPulse API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup() -> None:
    await get_database()


@app.on_event("shutdown")
async def on_shutdown() -> None:
    await close_mongo_client()


@app.get("/api/health")
async def health() -> dict:
    return {"status": "ok"}


app.include_router(jobs_router, prefix="/api/jobs", tags=["jobs"])
app.include_router(analysis_router, prefix="/api/analysis", tags=["analysis"])
