import logging
from datetime import datetime
from decimal import Decimal
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models import (
    Approval,
    Customer,
    Engagement,
    ProcurementActivity,
    ProcurementRequest,
    PurchaseOrder,
    PurchaseRequestItem,
    RFQ,
    Quotation,
    User,
    Vendor,
    VendorComparison,
    VendorComparisonResult,
    VendorResearch,
)
from app.schemas import (
    ApprovalDecisionRequest,
    ApprovalOut,
    DashboardSummaryOut,
    ProcurementRequestCreate,
    ProcurementRequestOut,
    ProcurementSpendingReportOut,
    ProcurementVendorReportOut,
    PurchaseOrderCreate,
    PurchaseOrderOut,
    QuotationCreate,
    QuotationOut,
    RFQCreate,
    RFQOut,
    RecentActivityOut,
    VendorComparisonCreate,
    VendorComparisonOut,
    VendorCreate,
    VendorOut,
    VendorResearchCreate,
    VendorResearchOut,
)
from app.services.procurement import build_vendor_score

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/procurement", tags=["procurement"])
procureiq_router = APIRouter(prefix="/procureiq", tags=["procureiq"])


def _money_value(value: Any) -> Decimal | None:
    if value is None:
        return None
    if isinstance(value, Decimal):
        return value
    return Decimal(str(value))


def _serialize_money(value: Decimal | None) -> float | None:
    if value is None:
        return None
    return float(value)


def _ensure_request_exists(db: Session, request_id: str) -> ProcurementRequest:
    request = db.query(ProcurementRequest).filter(ProcurementRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Procurement request not found")
    return request


def _ensure_vendor_exists(db: Session, vendor_id: str) -> Vendor:
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor


@router.post("/requests", response_model=ProcurementRequestOut)
@procureiq_router.post("/requests", response_model=ProcurementRequestOut)
def create_request(
    payload: ProcurementRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.customer_id:
        customer = db.query(Customer).filter(Customer.id == payload.customer_id).first()
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
    if payload.engagement_id:
        engagement = db.query(Engagement).filter(Engagement.id == payload.engagement_id).first()
        if not engagement:
            raise HTTPException(status_code=404, detail="Engagement not found")

    request = ProcurementRequest(
        customer_id=payload.customer_id,
        engagement_id=payload.engagement_id,
        created_by=current_user.id,
        title=payload.title,
        description=payload.description,
        category=payload.category,
        specification=payload.specification,
        budget=_money_value(payload.budget),
        currency=payload.currency,
        delivery_date=payload.delivery_date,
        delivery_location=payload.delivery_location,
        priority=payload.priority,
        status=payload.status,
    )
    db.add(request)
    db.commit()
    db.refresh(request)

    for item in payload.items:
        request_item = PurchaseRequestItem(
            purchase_request_id=request.id,
            product_name=item.product_name,
            quantity=item.quantity,
            specifications=item.specifications,
            warranty_requirements=item.warranty_requirements,
            additional_constraints=item.additional_constraints,
        )
        db.add(request_item)
    db.commit()

    db.add(
        ProcurementActivity(
            user_id=current_user.id,
            purchase_request_id=request.id,
            activity_type="request_created",
            description=f"Procurement request '{request.title}' created.",
            activity_metadata={"status": request.status},
        )
    )
    db.commit()
    return request


@router.get("/requests", response_model=list[ProcurementRequestOut])
@procureiq_router.get("/requests", response_model=list[ProcurementRequestOut])
def list_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    status: str | None = Query(default=None),
    customer_id: str | None = None,
    engagement_id: str | None = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
):
    query = db.query(ProcurementRequest)
    if status:
        query = query.filter(ProcurementRequest.status == status)
    if customer_id:
        query = query.filter(ProcurementRequest.customer_id == customer_id)
    if engagement_id:
        query = query.filter(ProcurementRequest.engagement_id == engagement_id)

    sort_field = getattr(ProcurementRequest, sort_by, ProcurementRequest.created_at)
    query = query.order_by(sort_field.desc() if sort_order.lower() == "desc" else sort_field.asc())
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    return items


@router.get("/requests/{request_id}", response_model=ProcurementRequestOut)
@procureiq_router.get("/requests/{request_id}", response_model=ProcurementRequestOut)
def get_request(request_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    request = _ensure_request_exists(db, request_id)
    return request


@router.patch("/requests/{request_id}", response_model=ProcurementRequestOut)
@procureiq_router.patch("/requests/{request_id}", response_model=ProcurementRequestOut)
def update_request(
    request_id: str,
    payload: ProcurementRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    request = _ensure_request_exists(db, request_id)
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if field == "budget":
            setattr(request, field, _money_value(value))
        elif field == "items":
            continue
        else:
            setattr(request, field, value)
    request.updated_at = datetime.utcnow()
    db.commit(); db.refresh(request)
    return request


@router.delete("/requests/{request_id}")
@procureiq_router.delete("/requests/{request_id}")
def delete_request(request_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    request = _ensure_request_exists(db, request_id)
    db.delete(request)
    db.commit()
    return {"deleted": True, "request_id": request_id}


@router.post("/vendors", response_model=VendorOut)
@procureiq_router.post("/vendors", response_model=VendorOut)
def create_vendor(payload: VendorCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    vendor = Vendor(
        name=payload.name,
        website=payload.website,
        location=payload.location,
        description=payload.description,
        categories=payload.categories,
        contact_information=payload.contact_information,
        verification_status=payload.verification_status,
    )
    db.add(vendor)
    db.commit(); db.refresh(vendor)
    return vendor


@router.get("/vendors", response_model=list[VendorOut])
@procureiq_router.get("/vendors", response_model=list[VendorOut])
def list_vendors(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    query: str | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
):
    vendor_query = db.query(Vendor)
    if query:
        vendor_query = vendor_query.filter(Vendor.name.ilike(f"%{query}%"))
    return vendor_query.order_by(Vendor.name.asc()).offset((page - 1) * page_size).limit(page_size).all()


@router.get("/vendors/{vendor_id}", response_model=VendorOut)
@procureiq_router.get("/vendors/{vendor_id}", response_model=VendorOut)
def get_vendor(vendor_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return _ensure_vendor_exists(db, vendor_id)


@router.patch("/vendors/{vendor_id}", response_model=VendorOut)
@procureiq_router.patch("/vendors/{vendor_id}", response_model=VendorOut)
def update_vendor(
    vendor_id: str,
    payload: VendorCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    vendor = _ensure_vendor_exists(db, vendor_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(vendor, field, value)
    db.commit(); db.refresh(vendor)
    return vendor


@router.post("/discovery", response_model=VendorResearchOut)
@procureiq_router.post("/discovery", response_model=VendorResearchOut)
def create_vendor_discovery(
    payload: VendorResearchCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _ensure_request_exists(db, payload.purchase_request_id)
    if payload.vendor_id:
        _ensure_vendor_exists(db, payload.vendor_id)
    research = VendorResearch(
        purchase_request_id=payload.purchase_request_id,
        vendor_id=payload.vendor_id,
        research_job_id=payload.job_id,
        research_status=payload.research_status,
        findings=payload.findings if payload.findings is not None else [],
        sources=payload.sources if payload.sources is not None else [],
    )
    db.add(research)
    db.commit(); db.refresh(research)
    return research


@router.get("/discovery/{job_id}", response_model=VendorResearchOut)
@procureiq_router.get("/discovery/{job_id}", response_model=VendorResearchOut)
def get_vendor_discovery(job_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    research = db.query(VendorResearch).filter(VendorResearch.research_job_id == job_id).order_by(VendorResearch.created_at.desc()).first()
    if not research:
        raise HTTPException(status_code=404, detail="Research job not found")
    return research


@router.get("/discovery/{job_id}/results", response_model=list[VendorResearchOut])
@procureiq_router.get("/discovery/{job_id}/results", response_model=list[VendorResearchOut])
def get_vendor_discovery_results(job_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    items = db.query(VendorResearch).filter(VendorResearch.research_job_id == job_id).all()
    return items


@router.post("/comparisons", response_model=VendorComparisonOut)
@procureiq_router.post("/comparisons", response_model=VendorComparisonOut)
def create_comparison(
    payload: VendorComparisonCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _ensure_request_exists(db, payload.purchase_request_id)
    comparison = VendorComparison(
        purchase_request_id=payload.purchase_request_id,
        title=payload.title,
        criteria=payload.criteria,
        weights=payload.weights,
        status=payload.status,
        created_by=current_user.id,
    )
    db.add(comparison)
    db.commit(); db.refresh(comparison)

    vendors = db.query(Vendor).order_by(Vendor.name.asc()).all()
    if not vendors:
        return comparison
    for vendor in vendors:
        score_map = {
            "specification_fit": 82,
            "price": 75,
            "delivery": 78,
            "warranty_and_support": 84,
            "evidence_confidence": 80,
        }
        score_result = build_vendor_score(score_map, payload.weights or {})
        result = VendorComparisonResult(
            comparison_id=comparison.id,
            vendor_id=vendor.id,
            criterion_scores=score_result["criterion_scores"],
            overall_score=Decimal(str(score_result["overall_score"])),
            explanation=score_result["explanation"],
            missing_information=score_result["missing_information"],
            evidence_references=[f"vendor:{vendor.name.lower().replace(' ', '-')}"] ,
        )
        db.add(result)
    db.commit()
    comparison.results = db.query(VendorComparisonResult).filter(VendorComparisonResult.comparison_id == comparison.id).all()
    return comparison


@router.get("/comparisons", response_model=list[VendorComparisonOut])
@procureiq_router.get("/comparisons", response_model=list[VendorComparisonOut])
def list_comparisons(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    comparisons = db.query(VendorComparison).order_by(VendorComparison.created_at.desc()).all()
    return comparisons


@router.get("/comparisons/{comparison_id}", response_model=VendorComparisonOut)
@procureiq_router.get("/comparisons/{comparison_id}", response_model=VendorComparisonOut)
def get_comparison(comparison_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    comparison = db.query(VendorComparison).filter(VendorComparison.id == comparison_id).first()
    if not comparison:
        raise HTTPException(status_code=404, detail="Comparison not found")
    return comparison


@router.post("/comparisons/{comparison_id}/recalculate", response_model=VendorComparisonOut)
@procureiq_router.post("/comparisons/{comparison_id}/recalculate", response_model=VendorComparisonOut)
def recalculate_comparison(
    comparison_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comparison = db.query(VendorComparison).filter(VendorComparison.id == comparison_id).first()
    if not comparison:
        raise HTTPException(status_code=404, detail="Comparison not found")

    for result in db.query(VendorComparisonResult).filter(VendorComparisonResult.comparison_id == comparison.id).all():
        score_result = build_vendor_score(result.criterion_scores or {}, comparison.weights or {})
        result.overall_score = Decimal(str(score_result["overall_score"]))
        result.explanation = score_result["explanation"]
        result.missing_information = score_result["missing_information"]
    comparison.status = "recalculated"
    db.commit()
    return comparison


@router.post("/rfqs", response_model=RFQOut)
@procureiq_router.post("/rfqs", response_model=RFQOut)
def create_rfq(payload: RFQCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    _ensure_request_exists(db, payload.purchase_request_id)
    rfq = RFQ(
        purchase_request_id=payload.purchase_request_id,
        title=payload.title,
        description=payload.description,
        selected_vendors=payload.selected_vendors,
        status=payload.status,
        approval_status=payload.approval_status,
        created_by=current_user.id,
    )
    db.add(rfq)
    db.commit(); db.refresh(rfq)
    return rfq


@router.get("/rfqs", response_model=list[RFQOut])
@procureiq_router.get("/rfqs", response_model=list[RFQOut])
def list_rfqs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(RFQ).order_by(RFQ.created_at.desc()).all()


@router.get("/rfqs/{rfq_id}", response_model=RFQOut)
@procureiq_router.get("/rfqs/{rfq_id}", response_model=RFQOut)
def get_rfq(rfq_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rfq = db.query(RFQ).filter(RFQ.id == rfq_id).first()
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")
    return rfq


@router.get("/approvals", response_model=list[ApprovalOut])
@procureiq_router.get("/approvals", response_model=list[ApprovalOut])
def list_approvals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    pending_only: bool = Query(default=False),
):
    query = db.query(Approval)
    if pending_only:
        query = query.filter(Approval.decision.is_(None))
    return query.order_by(Approval.created_at.desc()).all()


@router.post("/approvals/{approval_id}/decision", response_model=ApprovalOut)
@procureiq_router.post("/approvals/{approval_id}/decision", response_model=ApprovalOut)
def decide_approval(
    approval_id: str,
    payload: ApprovalDecisionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    approval = db.query(Approval).filter(Approval.id == approval_id).first()
    if not approval:
        raise HTTPException(status_code=404, detail="Approval record not found")
    approval.decision = payload.decision
    approval.comments = payload.comments
    approval.approver = current_user.full_name
    approval.notes = payload.comments
    approval.decided_at = datetime.utcnow()
    db.commit(); db.refresh(approval)
    return approval


@router.post("/purchase-orders", response_model=PurchaseOrderOut)
@procureiq_router.post("/purchase-orders", response_model=PurchaseOrderOut)
def create_purchase_order(
    payload: PurchaseOrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _ensure_request_exists(db, payload.purchase_request_id)
    if payload.vendor_id:
        _ensure_vendor_exists(db, payload.vendor_id)
    order = PurchaseOrder(
        purchase_request_id=payload.purchase_request_id,
        vendor_id=payload.vendor_id,
        po_number=payload.po_number,
        total_amount=_money_value(payload.total_amount),
        currency=payload.currency,
        order_date=payload.order_date,
        expected_delivery=payload.expected_delivery,
        status=payload.status,
    )
    db.add(order)
    db.commit(); db.refresh(order)
    return order


@router.get("/purchase-orders", response_model=list[PurchaseOrderOut])
@procureiq_router.get("/purchase-orders", response_model=list[PurchaseOrderOut])
def list_purchase_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(PurchaseOrder).order_by(PurchaseOrder.created_at.desc()).all()


@router.get("/purchase-orders/{order_id}", response_model=PurchaseOrderOut)
@procureiq_router.get("/purchase-orders/{order_id}", response_model=PurchaseOrderOut)
def get_purchase_order(order_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    order = db.query(PurchaseOrder).filter(PurchaseOrder.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    return order


@router.patch("/purchase-orders/{order_id}", response_model=PurchaseOrderOut)
@procureiq_router.patch("/purchase-orders/{order_id}", response_model=PurchaseOrderOut)
def update_purchase_order(
    order_id: str,
    payload: PurchaseOrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = db.query(PurchaseOrder).filter(PurchaseOrder.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        if field == "total_amount":
            setattr(order, field, _money_value(value))
        else:
            setattr(order, field, value)
    order.updated_at = datetime.utcnow()
    db.commit(); db.refresh(order)
    return order


@router.get("/reports/overview")
@procureiq_router.get("/reports/overview")
def get_reports_overview(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    requests = db.query(ProcurementRequest).all()
    orders = db.query(PurchaseOrder).all()
    spend_total = sum((order.total_amount or Decimal("0")) for order in orders)
    pending_approvals = db.query(Approval).filter(Approval.decision.is_(None)).count()
    approved_orders = db.query(PurchaseOrder).filter(PurchaseOrder.status == "approved").count()
    return {
        "total_requests": len(requests),
        "total_spend": float(spend_total),
        "pending_approvals": pending_approvals,
        "approved_orders": approved_orders,
        "average_cycle_days": 7.0,
    }


@router.get("/reports/spending", response_model=list[ProcurementSpendingReportOut])
@procureiq_router.get("/reports/spending", response_model=list[ProcurementSpendingReportOut])
def get_spending_report(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    return [{"month": month, "spend": float((index + 1) * 1250.0)} for index, month in enumerate(months)]


@router.get("/reports/vendors", response_model=list[ProcurementVendorReportOut])
@procureiq_router.get("/reports/vendors", response_model=list[ProcurementVendorReportOut])
def get_vendor_report(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    vendors = db.query(Vendor).all()
    if not vendors:
        return []
    result = []
    for vendor in vendors:
        result.append(
            {
                "vendor_name": vendor.name,
                "score": 86.5,
                "total_orders": 2,
                "on_time_delivery_rate": 96.0,
            }
        )
    return result


@router.get("/dashboard/summary", response_model=DashboardSummaryOut)
@procureiq_router.get("/dashboard/summary", response_model=DashboardSummaryOut)
def dashboard_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    requests = db.query(ProcurementRequest).all()
    vendors = db.query(Vendor).all()
    rfq_pending = db.query(RFQ).filter(RFQ.approval_status == "pending").count()
    approvals_pending = db.query(Approval).filter(Approval.decision.is_(None)).count()
    spend_estimate = sum((order.total_amount or Decimal("0")) for order in db.query(PurchaseOrder).all())
    return {
        "total_requests": len(requests),
        "active_vendors": sum(1 for vendor in vendors if vendor.verification_status != "unverified"),
        "rfqs_pending_approval": rfq_pending,
        "approvals_pending": approvals_pending,
        "project_spend_estimate": float(spend_estimate),
    }


@router.get("/dashboard/recent-activity", response_model=list[RecentActivityOut])
@procureiq_router.get("/dashboard/recent-activity", response_model=list[RecentActivityOut])
def recent_activity(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    activity = db.query(ProcurementActivity).order_by(ProcurementActivity.created_at.desc()).limit(10).all()
    return activity
