import json

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.api.v1.endpoints.engagements import start_research
from app.db.session import Base
from app.models import Customer, Engagement, ResearchJob, User, Workspace
from app.schemas import ResearchJobCreate


@pytest.mark.asyncio
async def test_start_research_generates_and_persists_llm_plan(monkeypatch):
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    test_session = sessionmaker(bind=engine)
    db = test_session()

    workspace = Workspace(name="Test workspace", slug="test-workspace")
    db.add(workspace)
    db.flush()
    user = User(
        email="expert@example.com",
        full_name="Test Expert",
        password_hash="test-hash",
        workspace_id=workspace.id,
    )
    customer = Customer(name="Test customer", workspace_id=workspace.id)
    db.add_all([user, customer])
    db.flush()
    engagement = Engagement(
        title="Laptop procurement",
        description="Research business laptops for a team.",
        customer_id=customer.id,
        owner_id=user.id,
        workspace_id=workspace.id,
    )
    db.add(engagement)
    db.commit()

    expected_plan = {
        "summary": "Research business laptops for the team.",
        "search_objectives": ["Identify suppliers and published specifications."],
        "research_questions": ["What warranty terms are published?"],
        "entities": ["business laptops", "suppliers"],
        "missing_information": ["Budget"],
        "conflicts": [],
    }

    async def fake_process_research_brief(self, brief: str):
        assert brief == "Research 50 business laptops."
        return expected_plan

    monkeypatch.setattr(
        "app.api.v1.endpoints.engagements.LLMService.process_research_brief",
        fake_process_research_brief,
    )

    try:
        response = await start_research(
            engagement.id,
            ResearchJobCreate(brief="Research 50 business laptops."),
            db,
            user,
        )

        assert response["status"] == "queued"
        assert response["research_plan"] == expected_plan
        job = db.query(ResearchJob).filter_by(id=response["job_id"]).first()
        assert json.loads(job.job_metadata) == {"research_plan": expected_plan}
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)
        engine.dispose()
