from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "ProcureIQ API"
    app_env: str = "development"
    version: str = "0.1.0"
    debug: bool = False
    api_prefix: str = "/api/v1"
    project_name: str = "procureiq"
    secret_key: str = "change-me-in-production"
    database_url: str = "sqlite:///./eia.db"
    redis_url: str = "redis://localhost:6379/0"
    cors_allowed_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    jwt_secret_key: str = "change-me-in-production"
    access_token_expire_minutes: int = 60 * 24
    llm_base_url: str = ""
    llm_api_key: str = ""
    llm_model: str = "gpt-4o-mini"
    llm_provider: Literal["mock", "openai", "vultr", "openai_compatible"] = "mock"
    vultr_inference_url: str = ""
    vultr_inference_api_key: str = ""
    vultr_inference_model: str = ""
    max_upload_size_mb: int = 25
    allow_origins: list[str] = Field(default_factory=lambda: ["http://localhost:5173", "http://127.0.0.1:5173"])

    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parents[2] / ".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_allowed_origins.split(",") if origin.strip()]


@lru_cache()
def get_settings() -> Settings:
    return Settings()
