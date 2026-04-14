from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    from routes.match import router as match_router
except ModuleNotFoundError:
    from backend.routes.match import router as match_router


app = FastAPI(title="ATS Resume Matcher API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(match_router)
