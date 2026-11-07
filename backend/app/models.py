from __future__ import annotations

import uuid
from datetime import datetime

from decimal import Decimal

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Integer, Numeric, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Workspace(Base):
    __tablename__ = "workspaces"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    users: Mapped[list["User"]] = relationship(back_populates="workspace")
    customers: Mapped[list["Customer"]] = relationship(back_populates="workspace")
    engagements: Mapped[list["Engagement"]] = relationship(back_populates="workspace")


class User(Base):
    __tablename__ = "users"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="expert")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    workspace_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("workspaces.id"), nullable=True)

    workspace: Mapped[Workspace | None] = relationship(back_populates="users")
    engagements: Mapped[list["Engagement"]] = relationship(back_populates="owner")
    purchase_requests: Mapped[list["ProcurementRequest"]] = relationship(back_populates="created_by_user")


class Customer(Base):
    __tablename__ = "customers"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    customer_type: Mapped[str] = mapped_column(String(50), default="internal")
    workspace_id: Mapped[str] = mapped_column(String(36), ForeignKey("workspaces.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    workspace: Mapped[Workspace] = relationship(back_populates="customers")
    engagements: Mapped[list["Engagement"]] = relationship(back_populates="customer")
    purchase_requests: Mapped[list["ProcurementRequest"]] = relationship(back_populates="customer")


class Engagement(Base):
    __tablename__ = "engagements"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="draft")
    customer_id: Mapped[str] = mapped_column(String(36), ForeignKey("customers.id"), nullable=False)
    owner_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    workspace_id: Mapped[str] = mapped_column(String(36), ForeignKey("workspaces.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    customer: Mapped[Customer] = relationship(back_populates="engagements")
    owner: Mapped[User] = relationship(back_populates="engagements")
    workspace: Mapped[Workspace] = relationship(back_populates="engagements")
    recommendations: Mapped[list["Recommendation"]] = relationship(back_populates="engagement")
    research_jobs: Mapped[list["ResearchJob"]] = relationship(back_populates="engagement")
    roadmap_items: Mapped[list["RoadmapItem"]] = relationship(back_populates="engagement")
    purchase_requests: Mapped[list["ProcurementRequest"]] = relationship(back_populates="engagement")


class EngagementScope(Base):
    __tablename__ = "engagement_scopes"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    engagement_id: Mapped[str] = mapped_column(String(36), ForeignKey("engagements.id"), nullable=False)
    summary: Mapped[str] = mapped_column(Text)
    objectives: Mapped[str | None] = mapped_column(Text)
    requirements: Mapped[str | None] = mapped_column(Text)
    constraints: Mapped[str | None] = mapped_column(Text)
    research_questions: Mapped[str | None] = mapped_column(Text)
    approved: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ResearchJob(Base):
    __tablename__ = "research_jobs"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    engagement_id: Mapped[str] = mapped_column(String(36), ForeignKey("engagements.id"), nullable=False)
    job_type: Mapped[str] = mapped_column(String(50), default="research")
    status: Mapped[str] = mapped_column(String(50), default="queued")
    progress: Mapped[int] = mapped_column(Integer, default=0)
    current_phase: Mapped[str] = mapped_column(String(50), default="plan")
    brief: Mapped[str | None] = mapped_column(Text)
    findings_count: Mapped[int] = mapped_column(Integer, default=0)
    job_metadata: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    engagement: Mapped[Engagement] = relationship(back_populates="research_jobs")
    findings: Mapped[list["Finding"]] = relationship(back_populates="research_job")


class Finding(Base):
    __tablename__ = "findings"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    research_job_id: Mapped[str] = mapped_column(String(36), ForeignKey("research_jobs.id"), nullable=False)
    entity_name: Mapped[str] = mapped_column(String(255), nullable=False)
    attribute: Mapped[str | None] = mapped_column(String(255))
    value: Mapped[str | None] = mapped_column(Text)
    evidence_url: Mapped[str | None] = mapped_column(String(500))
    evidence_text: Mapped[str | None] = mapped_column(Text)
    confidence: Mapped[str] = mapped_column(String(50), default="verified")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    research_job: Mapped[ResearchJob] = relationship(back_populates="findings")


class Recommendation(Base):
    __tablename__ = "recommendations"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    engagement_id: Mapped[str] = mapped_column(String(36), ForeignKey("engagements.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    rationale: Mapped[str | None] = mapped_column(Text)
    is_approved: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    engagement: Mapped[Engagement] = relationship(back_populates="recommendations")


class RoadmapItem(Base):
    __tablename__ = "roadmap_items"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    engagement_id: Mapped[str] = mapped_column(String(36), ForeignKey("engagements.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    phase: Mapped[str] = mapped_column(String(50), default="phase-1")
    status: Mapped[str] = mapped_column(String(50), default="planned")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    engagement: Mapped[Engagement] = relationship(back_populates="roadmap_items")


class Approval(Base):
    __tablename__ = "approvals"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    entity_type: Mapped[str | None] = mapped_column(String(64), default="procurement_request")
    entity_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    engagement_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("engagements.id"), nullable=True)
    requested_by: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id"), nullable=True)
    assigned_to: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id"), nullable=True)
    decision: Mapped[str | None] = mapped_column(String(50))
    comments: Mapped[str | None] = mapped_column(Text)
    approver: Mapped[str | None] = mapped_column(String(255))
    notes: Mapped[str | None] = mapped_column(Text)
    decided_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    requested_user: Mapped[User | None] = relationship(foreign_keys="[Approval.requested_by]")
    assigned_user: Mapped[User | None] = relationship(foreign_keys="[Approval.assigned_to]")


class Vendor(Base):
    __tablename__ = "vendors"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    website: Mapped[str | None] = mapped_column(String(500))
    location: Mapped[str | None] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    categories: Mapped[str | None] = mapped_column(Text)
    contact_information: Mapped[str | None] = mapped_column(Text)
    verification_status: Mapped[str] = mapped_column(String(50), default="unverified")
    region: Mapped[str | None] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ProcurementRequest(Base):
    __tablename__ = "procurement_requests"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("customers.id"), nullable=True)
    engagement_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("engagements.id"), nullable=True)
    created_by: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    category: Mapped[str | None] = mapped_column(String(100))
    specification: Mapped[str | None] = mapped_column(Text)
    budget: Mapped[Decimal | None] = mapped_column(Numeric(14, 2), nullable=True)
    currency: Mapped[str] = mapped_column(String(10), default="USD")
    delivery_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    delivery_location: Mapped[str | None] = mapped_column(String(255))
    priority: Mapped[str] = mapped_column(String(50), default="normal")
    status: Mapped[str] = mapped_column(String(50), default="draft")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    customer: Mapped[Customer | None] = relationship(back_populates="purchase_requests")
    engagement: Mapped[Engagement | None] = relationship(back_populates="purchase_requests")
    created_by_user: Mapped[User] = relationship(back_populates="purchase_requests")
    items: Mapped[list["PurchaseRequestItem"]] = relationship(back_populates="purchase_request")
    vendor_researches: Mapped[list["VendorResearch"]] = relationship(back_populates="purchase_request")
    vendor_comparisons: Mapped[list["VendorComparison"]] = relationship(back_populates="purchase_request")
    rfqs: Mapped[list["RFQ"]] = relationship(back_populates="purchase_request")
    purchase_orders: Mapped[list["PurchaseOrder"]] = relationship(back_populates="purchase_request")
    activities: Mapped[list["ProcurementActivity"]] = relationship(back_populates="purchase_request")


PurchaseRequest = ProcurementRequest


class PurchaseRequestItem(Base):
    __tablename__ = "purchase_request_items"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    purchase_request_id: Mapped[str] = mapped_column(String(36), ForeignKey("procurement_requests.id"), nullable=False)
    product_name: Mapped[str] = mapped_column(String(255), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    specifications: Mapped[str | None] = mapped_column(Text)
    warranty_requirements: Mapped[str | None] = mapped_column(Text)
    additional_constraints: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    purchase_request: Mapped[ProcurementRequest] = relationship(back_populates="items")


class VendorResearch(Base):
    __tablename__ = "vendor_research"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    purchase_request_id: Mapped[str] = mapped_column(String(36), ForeignKey("procurement_requests.id"), nullable=False)
    vendor_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("vendors.id"), nullable=True)
    research_job_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    research_status: Mapped[str] = mapped_column(String(50), default="queued")
    findings: Mapped[str | None] = mapped_column(JSON, default=list)
    sources: Mapped[str | None] = mapped_column(JSON, default=list)
    last_researched_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    purchase_request: Mapped[ProcurementRequest] = relationship(back_populates="vendor_researches")
    vendor: Mapped[Vendor | None] = relationship()


class VendorComparison(Base):
    __tablename__ = "vendor_comparisons"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    purchase_request_id: Mapped[str] = mapped_column(String(36), ForeignKey("procurement_requests.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    criteria: Mapped[str | None] = mapped_column(JSON, default=dict)
    weights: Mapped[str | None] = mapped_column(JSON, default=dict)
    status: Mapped[str] = mapped_column(String(50), default="draft")
    created_by: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    purchase_request: Mapped[ProcurementRequest] = relationship(back_populates="vendor_comparisons")
    results: Mapped[list["VendorComparisonResult"]] = relationship(back_populates="comparison")


class VendorComparisonResult(Base):
    __tablename__ = "vendor_comparison_results"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    comparison_id: Mapped[str] = mapped_column(String(36), ForeignKey("vendor_comparisons.id"), nullable=False)
    vendor_id: Mapped[str] = mapped_column(String(36), ForeignKey("vendors.id"), nullable=False)
    criterion_scores: Mapped[str | None] = mapped_column(JSON, default=dict)
    overall_score: Mapped[Decimal | None] = mapped_column(Numeric(5, 2), nullable=True)
    explanation: Mapped[str | None] = mapped_column(Text)
    missing_information: Mapped[str | None] = mapped_column(JSON, default=list)
    evidence_references: Mapped[str | None] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    comparison: Mapped[VendorComparison] = relationship(back_populates="results")
    vendor: Mapped[Vendor] = relationship()


class RFQ(Base):
    __tablename__ = "rfqs"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    purchase_request_id: Mapped[str] = mapped_column(String(36), ForeignKey("procurement_requests.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    selected_vendors: Mapped[str | None] = mapped_column(JSON, default=list)
    status: Mapped[str] = mapped_column(String(50), default="draft")
    approval_status: Mapped[str] = mapped_column(String(50), default="pending")
    created_by: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    purchase_request: Mapped[ProcurementRequest] = relationship(back_populates="rfqs")
    quotations: Mapped[list["Quotation"]] = relationship(back_populates="rfq")


class Quotation(Base):
    __tablename__ = "quotations"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    rfq_id: Mapped[str] = mapped_column(String(36), ForeignKey("rfqs.id"), nullable=False)
    vendor_id: Mapped[str] = mapped_column(String(36), ForeignKey("vendors.id"), nullable=False)
    quoted_price: Mapped[Decimal | None] = mapped_column(Numeric(14, 2), nullable=True)
    currency: Mapped[str] = mapped_column(String(10), default="USD")
    delivery_estimate: Mapped[str | None] = mapped_column(String(255))
    warranty: Mapped[str | None] = mapped_column(Text)
    terms: Mapped[str | None] = mapped_column(Text)
    document_reference: Mapped[str | None] = mapped_column(String(500))
    received_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    rfq: Mapped[RFQ] = relationship(back_populates="quotations")
    vendor: Mapped[Vendor] = relationship()


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    purchase_request_id: Mapped[str] = mapped_column(String(36), ForeignKey("procurement_requests.id"), nullable=False)
    vendor_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("vendors.id"), nullable=True)
    po_number: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    total_amount: Mapped[Decimal | None] = mapped_column(Numeric(14, 2), nullable=True)
    currency: Mapped[str] = mapped_column(String(10), default="USD")
    order_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    expected_delivery: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="draft")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    purchase_request: Mapped[ProcurementRequest] = relationship(back_populates="purchase_orders")
    vendor: Mapped[Vendor | None] = relationship()


class ProcurementActivity(Base):
    __tablename__ = "procurement_activity"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    purchase_request_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("procurement_requests.id"), nullable=True)
    activity_type: Mapped[str] = mapped_column(String(80), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    activity_metadata: Mapped[str | None] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    purchase_request: Mapped[ProcurementRequest | None] = relationship(back_populates="activities")
