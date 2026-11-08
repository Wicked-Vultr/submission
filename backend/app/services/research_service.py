import json
import uuid
from datetime import datetime
from typing import Any

from sqlalchemy.orm import Session

from app.models import Engagement, Finding, ResearchJob


class ResearchService:
    @staticmethod
    def create_job(
        db: Session,
        engagement_id: str,
        brief: str,
        research_plan: dict[str, Any] | None = None,
    ) -> ResearchJob:
        job = ResearchJob(
            id=str(uuid.uuid4()),
            engagement_id=engagement_id,
            job_type="research",
            status="queued",
            progress=0,
            current_phase="plan",
            brief=brief,
            findings_count=0,
            job_metadata=json.dumps({"research_plan": research_plan or {}}),
        )
        db.add(job)
        db.commit()
        db.refresh(job)
        return job

    @staticmethod
    def update_job(db: Session, job_id: str, *, status: str | None = None, progress: int | None = None, current_phase: str | None = None, findings_count: int | None = None, job_metadata: str | None = None) -> ResearchJob:
        job = db.query(ResearchJob).filter(ResearchJob.id == job_id).first()
        if not job:
            raise ValueError("Research job not found")
        if status:
            job.status = status
        if progress is not None:
            job.progress = progress
        if current_phase:
            job.current_phase = current_phase
        if findings_count is not None:
            job.findings_count = findings_count
        if job_metadata is not None:
            job.job_metadata = job_metadata
        job.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(job)
        return job

    @staticmethod
    def add_finding(db: Session, job_id: str, entity_name: str, *, attribute: str | None = None, value: str | None = None, evidence_url: str | None = None, evidence_text: str | None = None, confidence: str = "verified") -> Finding:
        finding = Finding(
            id=str(uuid.uuid4()),
            research_job_id=job_id,
            entity_name=entity_name,
            attribute=attribute,
            value=value,
            evidence_url=evidence_url,
            evidence_text=evidence_text,
            confidence=confidence,
        )
        db.add(finding)
        db.commit()
        db.refresh(finding)
        return finding

    @staticmethod
    def get_job(db: Session, job_id: str) -> ResearchJob | None:
        return db.query(ResearchJob).filter(ResearchJob.id == job_id).first()

    @staticmethod
    def list_findings(db: Session, job_id: str) -> list[Finding]:
        return db.query(Finding).filter(Finding.research_job_id == job_id).all()
