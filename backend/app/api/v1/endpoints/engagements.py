from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models import Customer, Engagement, EngagementScope, ResearchJob
from app.schemas import EngagementCreate, EngagementOut, ScopeOut, ScopeRequest
from app.services.llm_service import LLMService
from app.services.research_service import ResearchService

router = APIRouter(prefix="/engagements", tags=["engagements"])


@router.get("", response_model=list[EngagementOut])
def list_engagements(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Engagement).all()


@router.post("", response_model=EngagementOut)
def create_engagement(payload: EngagementCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    customer = db.query(Customer).filter(Customer.id == payload.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    engagement = Engagement(
        title=payload.title,
        description=payload.description,
        status=payload.status,
        customer_id=payload.customer_id,
        owner_id=current_user.id,
        workspace_id=customer.workspace_id,
    )
    db.add(engagement)
    db.commit()
    db.refresh(engagement)
    return engagement


@router.get("/{engagement_id}", response_model=EngagementOut)
def get_engagement(engagement_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    engagement = db.query(Engagement).filter(Engagement.id == engagement_id).first()
    if not engagement:
        raise HTTPException(status_code=404, detail="Engagement not found")
    return engagement


@router.post("/{engagement_id}/scope/analyze")
async def analyze_scope(engagement_id: str, payload: ScopeRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    engagement = db.query(Engagement).filter(Engagement.id == engagement_id).first()
    if not engagement:
        raise HTTPException(status_code=404, detail="Engagement not found")
    llm = LLMService()
    result = await llm.analyze_problem(payload.summary or payload.requirements or "")
    scope = EngagementScope(
        engagement_id=engagement_id,
        summary=result.get("summary", payload.summary or ""),
        objectives="\n".join(result.get("objectives", [])),
        requirements="\n".join(result.get("requirements", [])),
        constraints="\n".join(result.get("constraints", [])),
        research_questions="\n".join(result.get("clarification_questions", [])),
    )
    db.add(scope)
    db.commit()
    return {"message": "Scope analysis created", "scope": result}


@router.get("/{engagement_id}/scope", response_model=ScopeOut)
def get_scope(engagement_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    scope = db.query(EngagementScope).filter(EngagementScope.engagement_id == engagement_id).order_by(EngagementScope.created_at.desc()).first()
    if not scope:
        raise HTTPException(status_code=404, detail="Scope not found")
    return scope


@router.post("/{engagement_id}/research")
def start_research(engagement_id: str, payload: dict, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    engagement = db.query(Engagement).filter(Engagement.id == engagement_id).first()
    if not engagement:
        raise HTTPException(status_code=404, detail="Engagement not found")
    brief = payload.get("brief") or payload.get("summary") or "" 
    if not brief:
        raise HTTPException(status_code=400, detail="Research brief is required")
    job = ResearchService.create_job(db, engagement_id, brief)
    return {"job_id": job.id, "status": job.status, "progress": job.progress}


@router.get("/{engagement_id}/research/jobs")
def list_research_jobs(engagement_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    jobs = db.query(ResearchJob).filter(ResearchJob.engagement_id == engagement_id).all()
    return jobs
