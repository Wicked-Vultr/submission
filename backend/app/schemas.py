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


class ProcurementRequestCreate(BaseModel):
    customer_id: str | None = None
    engagement_id: str | None = None
    title: str = Field(..., min_length=2)
    description: str | None = None
    category: str | None = None
    specification: str | None = None
    budget: float | None = None
    currency: str = "USD"
    delivery_date: datetime | None = None
    delivery_location: str | None = None
    priority: str = "normal"
    status: str = "draft"
    items: list[PurchaseRequestItemCreate] = Field(default_factory=list)


class ProcurementRequestOut(BaseModel):
    id: str
    engagement_id: str | None = None
    customer_id: str | None = None
    created_by: str | None = None
    title: str
    description: str | None = None
    category: str | None = None
    specification: str | None = None
    budget: float | None = None
    currency: str = "USD"
    delivery_date: datetime | None = None
    delivery_location: str | None = None
    priority: str = "normal"
    status: str
    created_at: datetime


class PurchaseRequestItemCreate(BaseModel):
    product_name: str = Field(..., min_length=2)
    quantity: int = Field(default=1, ge=1)
    specifications: str | None = None
    warranty_requirements: str | None = None
    additional_constraints: str | None = None


class PurchaseRequestItemOut(PurchaseRequestItemCreate):
    id: str
    purchase_request_id: str
    created_at: datetime


class VendorCreate(BaseModel):
    name: str = Field(..., min_length=2)
    website: str | None = None
    location: str | None = None
    description: str | None = None
    categories: str | None = None
    contact_information: str | None = None
    verification_status: str = "unverified"


class VendorOut(VendorCreate):
    id: str
    region: str | None = None
    created_at: datetime


class VendorResearchCreate(BaseModel):
    purchase_request_id: str
    vendor_id: str | None = None
    job_id: str | None = None
    findings: dict | list | None = None
    sources: list[str] | None = None
    research_status: str = "queued"


class VendorResearchOut(BaseModel):
    id: str
    purchase_request_id: str
    vendor_id: str | None = None
    research_job_id: str | None = None
    research_status: str
    findings: dict | list | None = None
    sources: list[str] | None = None
    last_researched_at: datetime | None = None
    created_at: datetime


class VendorComparisonCreate(BaseModel):
    purchase_request_id: str
    title: str = Field(..., min_length=2)
    criteria: dict = Field(default_factory=dict)
    weights: dict = Field(default_factory=dict)
    status: str = "draft"


class VendorComparisonResultOut(BaseModel):
    id: str
    comparison_id: str
    vendor_id: str
    criterion_scores: dict
    overall_score: float | None = None
    explanation: str | None = None
    missing_information: list[str] | None = None
    evidence_references: list[str] | None = None


class VendorComparisonOut(VendorComparisonCreate):
    id: str
    created_by: str
    created_at: datetime
    results: list[VendorComparisonResultOut] = []


class RFQCreate(BaseModel):
    purchase_request_id: str
    title: str = Field(..., min_length=2)
    description: str | None = None
    selected_vendors: list[str] = Field(default_factory=list)
    status: str = "draft"
    approval_status: str = "pending"


class RFQOut(RFQCreate):
    id: str
    created_by: str
    created_at: datetime


class QuotationCreate(BaseModel):
    rfq_id: str
    vendor_id: str
    quoted_price: float | None = None
    currency: str = "USD"
    delivery_estimate: str | None = None
    warranty: str | None = None
    terms: str | None = None
    document_reference: str | None = None


class QuotationOut(QuotationCreate):
    id: str
    received_at: datetime | None = None
    created_at: datetime


class ApprovalDecisionRequest(BaseModel):
    decision: str = Field(..., pattern="^(approve|reject|request_changes)$")
    comments: str | None = None


class ApprovalOut(BaseModel):
    id: str
    entity_type: str | None = None
    entity_id: str | None = None
    engagement_id: str | None = None
    requested_by: str | None = None
    assigned_to: str | None = None
    decision: str | None = None
    comments: str | None = None
    approver: str | None = None
    notes: str | None = None
    decided_at: datetime | None = None
    created_at: datetime


class PurchaseOrderCreate(BaseModel):
    purchase_request_id: str
    vendor_id: str | None = None
    po_number: str = Field(..., min_length=2)
    total_amount: float | None = None
    currency: str = "USD"
    order_date: datetime | None = None
    expected_delivery: datetime | None = None
    status: str = "draft"


class PurchaseOrderOut(PurchaseOrderCreate):
    id: str
    created_at: datetime
    updated_at: datetime


class ProcurementActivityOut(BaseModel):
    id: str
    user_id: str
    purchase_request_id: str | None = None
    activity_type: str
    description: str
    metadata: dict | None = None
    created_at: datetime


class DashboardSummaryOut(BaseModel):
    total_requests: int
    active_vendors: int
    rfqs_pending_approval: int
    approvals_pending: int
    project_spend_estimate: float


class RecentActivityOut(BaseModel):
    id: str
    user_id: str
    purchase_request_id: str | None = None
    activity_type: str
    description: str
    metadata: dict | None = None
    created_at: datetime


class ProcurementOverviewReportOut(BaseModel):
    total_requests: int
    total_spend: float
    pending_approvals: int
    approved_orders: int
    average_cycle_days: float | None = None


class ProcurementSpendingReportOut(BaseModel):
    month: str
    spend: float


class ProcurementVendorReportOut(BaseModel):
    vendor_name: str
    score: float
    total_orders: int
    on_time_delivery_rate: float
