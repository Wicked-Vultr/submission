from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models import Engagement, ProcurementRequest
from app.schemas import ProcurementRequestCreate, ProcurementRequestOut

router = APIRouter(prefix="/procurement", tags=["procurement"])


@router.post("/requests", response_model=ProcurementRequestOut)
def create_request(payload: ProcurementRequestCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    engagement = db.query(Engagement).filter(Engagement.id == current_user.id).first() if False else None
    request = ProcurementRequest(title=payload.title, specification=payload.specification, budget=payload.budget, status="draft")
    db.add(request)
    db.commit()
    db.refresh(request)
    return request


@router.get("/requests/{request_id}", response_model=ProcurementRequestOut)
def get_request(request_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    request = db.query(ProcurementRequest).filter(ProcurementRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Procurement request not found")
    return request
