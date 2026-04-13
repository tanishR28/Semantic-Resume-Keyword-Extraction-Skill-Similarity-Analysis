from fastapi import FastAPI

from backend.routes.match import router as match_router


app = FastAPI(title="ATS Resume Matcher API", version="0.1.0")


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(match_router)
