from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_v1
from app.core.config import get_settings
from app.db.session import Base, engine

settings = get_settings()

app = FastAPI(title=settings.app_name, version=settings.version, debug=settings.debug)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_v1, prefix=settings.api_prefix)


@app.get("/health")
def health_check():
    return {"status": "ok", "app": settings.app_name}


@app.get("/api/v1/health")
def api_health_check():
    return {"status": "ok", "app": settings.app_name}


@app.on_event("startup")
def startup() -> None:
    Base.metadata.create_all(bind=engine)
