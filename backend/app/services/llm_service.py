import json
import random
from typing import Any

from app.core.config import get_settings

settings = get_settings()


class LLMService:
    def __init__(self):
        self.provider = settings.llm_provider
        self.base_url = settings.llm_base_url
        self.api_key = settings.llm_api_key
        self.model = settings.llm_model

    async def analyze_problem(self, text: str) -> dict[str, Any]:
        if self.provider == "mock":
            return {
                "summary": text[:180],
                "business_domain": "Operations",
                "objectives": ["Improve decision velocity", "Reduce operational cost"],
                "requirements": ["Evidence-backed recommendation", "Stakeholder review"],
                "constraints": ["Need executive review"],
                "clarification_questions": ["Who are the primary stakeholders?"],
            }
        return {"summary": text[:180], "business_domain": "Operations"}

    async def generate_recommendation(self, scope: dict[str, Any], findings: list[dict[str, Any]]) -> dict[str, Any]:
        if self.provider == "mock":
            return {
                "title": "Recommended phased implementation",
                "summary": "Adopt a staged rollout driven by evidence and stakeholder approval.",
                "rationale": "Findings indicate strongest return when implemented incrementally.",
                "options": [
                    {"name": "Phase 1 rollout", "score": 88},
                    {"name": "Parallel pilot", "score": 76},
                ],
            }
        return {"title": "Recommended phased implementation", "summary": "Fallback", "options": []}

    async def compare_solutions(self, options: list[dict[str, Any]]) -> dict[str, Any]:
        if self.provider == "mock":
            scored = []
            for idx, option in enumerate(options):
                scored.append({**option, "score": 70 + idx * 8})
            return {"results": scored, "best_option": scored[0]["name"] if scored else "n/a"}
        return {"results": options, "best_option": "n/a"}

    async def process_research_brief(self, brief: str) -> dict[str, Any]:
        if self.provider == "mock":
            return {
                "research_questions": [
                    "What are the current vendors and options?",
                    "What evidence supports the proposed approach?",
                ],
                "entities": ["suppliers", "costs", "workflow"],
                "summary": brief[:300],
            }
        return {"activities": []}
