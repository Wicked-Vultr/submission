from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models import Finding, ResearchJob
from app.schemas import FindingOut, ResearchJobOut
from app.services.research_service import ResearchService

router = APIRouter(prefix="/research", tags=["research"])


@router.get("/{job_id}", response_model=ResearchJobOut)
def get_research_job(job_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    job = db.query(ResearchJob).filter(ResearchJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Research job not found")
    return job


@router.get("/{job_id}/findings", response_model=list[FindingOut])
def get_findings(job_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    job = db.query(ResearchJob).filter(ResearchJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Research job not found")
    findings = db.query(Finding).filter(Finding.research_job_id == job_id).all()
    return findings


@router.post("/{job_id}/cancel")
def cancel_research(job_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    job = db.query(ResearchJob).filter(ResearchJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Research job not found")
    job.status = "cancelled"
    db.commit()
    return {"message": "Research cancelled", "job_id": job_id}
