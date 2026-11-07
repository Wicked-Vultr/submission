from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models import Engagement, RoadmapItem
from app.schemas import RoadmapItemCreate, RoadmapItemOut

router = APIRouter(prefix="/engagements/{engagement_id}/roadmaps", tags=["roadmaps"])


@router.post("", response_model=RoadmapItemOut)
def create_roadmap_item(
    engagement_id: str,
    payload: RoadmapItemCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    engagement = db.query(Engagement).filter(Engagement.id == engagement_id).first()
    if not engagement:
        raise HTTPException(status_code=404, detail="Engagement not found")
    roadmap_item = RoadmapItem(
        engagement_id=engagement_id,
        title=payload.title,
        description=payload.description,
        phase=payload.phase,
        status=payload.status,
    )
    db.add(roadmap_item)
    db.commit()
    db.refresh(roadmap_item)
    return roadmap_item


@router.get("", response_model=list[RoadmapItemOut])
def list_roadmap_items(engagement_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(RoadmapItem).filter(RoadmapItem.engagement_id == engagement_id).all()
