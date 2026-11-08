from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models import Customer, Engagement, EngagementScope, ResearchJob
from app.schemas import EngagementCreate, EngagementOut, ResearchJobCreate, ScopeOut, ScopeRequest
from app.services.llm_service import LLMProviderError, LLMService
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
async def analyze_scope(
    engagement_id: str,
    payload: ScopeRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    engagement = db.query(Engagement).filter(Engagement.id == engagement_id).first()
    if not engagement:
        raise HTTPException(status_code=404, detail="Engagement not found")
    problem_text = (payload.summary or payload.requirements or "").strip()
    if not problem_text:
        raise HTTPException(status_code=422, detail="A summary or requirement is required for analysis")

    llm = LLMService()
    try:
        result = await llm.analyze_problem(problem_text)
    except LLMProviderError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    scope = EngagementScope(
        engagement_id=engagement_id,
        summary=result["summary"],
        objectives="\n".join(result["objectives"]),
        requirements="\n".join(result["requirements"]),
        constraints="\n".join(result["constraints"]),
        research_questions="\n".join(result["clarification_questions"]),
    )
    db.add(scope)
    db.commit()
    db.refresh(scope)
    return {"message": "Scope analysis created", "scope": result}


@router.get("/{engagement_id}/scope", response_model=ScopeOut)
def get_scope(engagement_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    scope = db.query(EngagementScope).filter(EngagementScope.engagement_id == engagement_id).order_by(EngagementScope.created_at.desc()).first()
    if not scope:
        raise HTTPException(status_code=404, detail="Scope not found")
    return scope


@router.post("/{engagement_id}/research")
async def start_research(
    engagement_id: str,
    payload: ResearchJobCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    engagement = db.query(Engagement).filter(Engagement.id == engagement_id).first()
    if not engagement:
        raise HTTPException(status_code=404, detail="Engagement not found")
    try:
        research_plan = await LLMService().process_research_brief(payload.brief)
    except LLMProviderError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    job = ResearchService.create_job(
        db,
        engagement_id,
        payload.brief,
        research_plan=research_plan,
    )
    return {
        "job_id": job.id,
        "status": job.status,
        "progress": job.progress,
        "research_plan": research_plan,
    }


@router.get("/{engagement_id}/research/jobs")
def list_research_jobs(engagement_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    jobs = db.query(ResearchJob).filter(ResearchJob.engagement_id == engagement_id).all()
    return jobs
