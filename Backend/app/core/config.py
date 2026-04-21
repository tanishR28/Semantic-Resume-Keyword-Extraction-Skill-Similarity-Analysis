from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: str = "development"
    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "talentpulse"
    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    hf_repo_base: str = "https://huggingface.co/maxvoyager/ats-model/resolve/main"
    hf_ner_model: str = "dslim/bert-base-NER"
    models_dir: str = ".models"
    groq_api_key: str = ""
    groq_model: str = "llama-3.1-8b-instant"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
