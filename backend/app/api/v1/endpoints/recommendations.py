from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models import Engagement, Recommendation
from app.schemas import RecommendationCreate, RecommendationOut

router = APIRouter(prefix="/engagements/{engagement_id}/recommendations", tags=["recommendations"])


@router.post("", response_model=RecommendationOut)
def create_recommendation(
    engagement_id: str,
    payload: RecommendationCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    engagement = db.query(Engagement).filter(Engagement.id == engagement_id).first()
    if not engagement:
        raise HTTPException(status_code=404, detail="Engagement not found")
    recommendation = Recommendation(
        engagement_id=engagement_id,
        title=payload.title,
        summary=payload.summary,
        rationale=payload.rationale,
        is_approved=False,
    )
    db.add(recommendation)
    db.commit()
    db.refresh(recommendation)
    return recommendation


@router.get("", response_model=list[RecommendationOut])
def list_recommendations(engagement_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Recommendation).filter(Recommendation.engagement_id == engagement_id).all()
