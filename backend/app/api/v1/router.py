from fastapi import APIRouter

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.customers import router as customers_router
from app.api.v1.endpoints.engagements import router as engagements_router
from app.api.v1.endpoints.procurement import procureiq_router, router as procurement_router
from app.api.v1.endpoints.recommendations import router as recommendations_router
from app.api.v1.endpoints.research import router as research_router
from app.api.v1.endpoints.roadmaps import router as roadmaps_router

api_v1 = APIRouter()
api_v1.include_router(auth_router)
api_v1.include_router(customers_router)
api_v1.include_router(engagements_router)
api_v1.include_router(research_router)
api_v1.include_router(recommendations_router)
api_v1.include_router(roadmaps_router)
api_v1.include_router(procurement_router)
api_v1.include_router(procureiq_router)
