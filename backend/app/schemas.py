from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class TokenPayload(BaseModel):
    sub: str
    exp: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2)
    password: str = Field(..., min_length=6)
    role: Literal["platform_admin", "expert", "customer", "collaborator", "viewer"] = "expert"


class UserOut(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: str
    created_at: datetime


class WorkspaceCreate(BaseModel):
    name: str = Field(..., min_length=2)
    slug: str = Field(..., min_length=2)


class WorkspaceOut(BaseModel):
    id: str
    name: str
    slug: str
    is_active: bool
    created_at: datetime


class CustomerCreate(BaseModel):
    name: str = Field(..., min_length=2)
    customer_type: str = "internal"


class CustomerOut(BaseModel):
    id: str
    name: str
    customer_type: str
    workspace_id: str
    created_at: datetime


class EngagementCreate(BaseModel):
    title: str = Field(..., min_length=2)
    description: str = Field(..., min_length=10)
    customer_id: str
    status: str = "draft"


class EngagementOut(BaseModel):
    id: str
    title: str
    description: str
    status: str
    customer_id: str
    owner_id: str
    workspace_id: str
    created_at: datetime


class ScopeRequest(BaseModel):
    summary: str | None = None
    objectives: str | None = None
    requirements: str | None = None
    constraints: str | None = None
    research_questions: str | None = None


class ScopeOut(ScopeRequest):
    id: str
    engagement_id: str
    approved: bool
    updated_at: datetime


class ResearchJobOut(BaseModel):
    id: str
    engagement_id: str
    job_type: str
    status: str
    progress: int
    current_phase: str
    findings_count: int
    created_at: datetime


class ResearchJobCreate(BaseModel):
    brief: str = Field(..., min_length=10)


class FindingOut(BaseModel):
    id: str
    research_job_id: str
    entity_name: str
    attribute: str | None = None
    value: str | None = None
    evidence_url: str | None = None
    evidence_text: str | None = None
    confidence: str
    created_at: datetime


class RecommendationCreate(BaseModel):
    title: str
    summary: str
    rationale: str | None = None


class RecommendationOut(BaseModel):
    id: str
    engagement_id: str
    title: str
    summary: str
    rationale: str | None = None
    is_approved: bool
    created_at: datetime


class RoadmapItemCreate(BaseModel):
    title: str
    description: str | None = None
    phase: str = "phase-1"
    status: str = "planned"


class RoadmapItemOut(RoadmapItemCreate):
    id: str
    engagement_id: str
    created_at: datetime


class ApprovalCreate(BaseModel):
    decision: str
    notes: str | None = None


class ApprovalOut(BaseModel):
    id: str
    engagement_id: str
    decision: str | None
    approver: str | None
    notes: str | None = None
    created_at: datetime


class ProcurementRequestCreate(BaseModel):
    title: str = Field(..., min_length=2)
    specification: str | None = None
    budget: str | None = None


class ProcurementRequestOut(BaseModel):
    id: str
    engagement_id: str
    title: str
    specification: str | None = None
    budget: str | None = None
    status: str
    created_at: datetime
