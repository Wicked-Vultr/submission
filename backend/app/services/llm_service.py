import json
from typing import Any

import httpx
from pydantic import BaseModel, ValidationError

from app.core.config import get_settings

settings = get_settings()

DEFAULT_VULTR_BASE_URL = "https://api.vultrinference.com/v1"
DEFAULT_OPENAI_BASE_URL = "https://api.openai.com/v1"


class LLMProviderError(RuntimeError):
    """Raised when an external LLM provider cannot return a valid response."""


class ProblemAnalysis(BaseModel):
    summary: str
    business_domain: str | None
    objectives: list[str]
    requirements: list[str]
    constraints: list[str]
    clarification_questions: list[str]


class ResearchPlan(BaseModel):
    summary: str
    search_objectives: list[str]
    research_questions: list[str]
    entities: list[str]
    missing_information: list[str]
    conflicts: list[str]


class RecommendationDraft(BaseModel):
    title: str
    summary: str
    rationale: str
    options: list[dict[str, Any]]


class ComparisonDraft(BaseModel):
    results: list[dict[str, Any]]
    best_option: str | None


class LLMService:
    def __init__(self):
        self.provider = settings.llm_provider.strip().lower()

    def _provider_config(self) -> tuple[str, str, str]:
        if self.provider == "openai":
            base_url = settings.llm_base_url or DEFAULT_OPENAI_BASE_URL
            api_key = settings.llm_api_key
            model = settings.llm_model
        elif self.provider == "vultr":
            base_url = settings.vultr_inference_url or DEFAULT_VULTR_BASE_URL
            api_key = settings.vultr_inference_api_key
            model = settings.vultr_inference_model
        elif self.provider == "openai_compatible":
            base_url = settings.llm_base_url
            api_key = settings.llm_api_key
            model = settings.llm_model
        else:
            raise LLMProviderError(
                f"Unsupported LLM_PROVIDER '{self.provider}'. Use mock, openai, vultr, or openai_compatible."
            )

        if not base_url:
            raise LLMProviderError("Set the LLM provider base URL in the backend environment.")
        if not api_key:
            raise LLMProviderError("Set the LLM provider API key in the backend environment.")
        if not model:
            raise LLMProviderError("Set the LLM model name in the backend environment.")
        return base_url.rstrip("/"), api_key, model

    async def _complete_json(self, *, system_prompt: str, user_prompt: str) -> dict[str, Any]:
        base_url, api_key, model = self._provider_config()
        endpoint = base_url if base_url.endswith("/chat/completions") else f"{base_url}/chat/completions"
        request_payload = {
            "model": model,
            "temperature": 0.1,
            "max_tokens": 2000,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        }

        try:
            async with httpx.AsyncClient(timeout=httpx.Timeout(45.0, connect=10.0)) as client:
                response = await client.post(
                    endpoint,
                    headers={
                        "Authorization": f"Bearer {api_key}",
                        "Content-Type": "application/json",
                    },
                    json=request_payload,
                )
                response.raise_for_status()
                response_payload = response.json()
        except httpx.TimeoutException as exc:
            raise LLMProviderError("The LLM provider request timed out.") from exc
        except httpx.HTTPStatusError as exc:
            raise LLMProviderError(
                f"The LLM provider returned HTTP {exc.response.status_code}."
            ) from exc
        except httpx.RequestError as exc:
            raise LLMProviderError("Could not connect to the configured LLM provider.") from exc
        except ValueError as exc:
            raise LLMProviderError("The LLM provider returned an invalid JSON response.") from exc

        try:
            content = response_payload["choices"][0]["message"]["content"]
        except (KeyError, IndexError, TypeError) as exc:
            raise LLMProviderError("The LLM provider response did not contain a chat message.") from exc

        if not isinstance(content, str):
            raise LLMProviderError("The LLM provider returned a non-text response.")
        content = content.strip()
        if content.startswith("```"):
            content = content.split("\n", 1)[-1].rsplit("```", 1)[0].strip()

        try:
            result = json.loads(content)
        except json.JSONDecodeError as exc:
            raise LLMProviderError("The LLM response was not valid JSON.") from exc
        if not isinstance(result, dict):
            raise LLMProviderError("The LLM response must be a JSON object.")
        return result

    async def analyze_problem(self, text: str) -> dict[str, Any]:
        if self.provider == "mock":
            return {
                "summary": text[:180],
                "business_domain": None,
                "objectives": [],
                "requirements": [],
                "constraints": [],
                "clarification_questions": ["What outcome should this work achieve?"],
            }
        system_prompt = (
            "You help an expert clarify a business or procurement requirement. "
            "Return only a JSON object with summary, business_domain, objectives, "
            "requirements, constraints, and clarification_questions. Use empty arrays "
            "when the input does not establish a value. Do not invent budgets, dates, "
            "product specifications, vendors, or other missing facts."
        )
        result = await self._complete_json(system_prompt=system_prompt, user_prompt=text)
        try:
            return ProblemAnalysis.model_validate(result).model_dump()
        except ValidationError as exc:
            raise LLMProviderError("The LLM returned an invalid requirement-analysis structure.") from exc

    async def generate_recommendation(self, scope: dict[str, Any], findings: list[dict[str, Any]]) -> dict[str, Any]:
        if self.provider == "mock":
            return {
                "title": "Recommended phased implementation",
                "summary": "Review the available evidence and compare the options before deciding.",
                "rationale": "This draft is based only on the supplied scope and findings.",
                "options": [],
            }
        system_prompt = (
            "Draft an expert-review recommendation using only the supplied scope and findings. "
            "Return JSON with title, summary, rationale, and options. Do not invent evidence, "
            "prices, supplier claims, scores, or facts not present in the input. Mark unknowns "
            "as unknown and keep this as a draft for human review."
        )
        result = await self._complete_json(
            system_prompt=system_prompt,
            user_prompt=json.dumps({"scope": scope, "findings": findings}, ensure_ascii=False),
        )
        try:
            return RecommendationDraft.model_validate(result).model_dump()
        except ValidationError as exc:
            raise LLMProviderError("The LLM returned an invalid recommendation structure.") from exc

    async def compare_solutions(self, options: list[dict[str, Any]]) -> dict[str, Any]:
        if self.provider == "mock":
            return {"results": options, "best_option": None}
        system_prompt = (
            "Compare the supplied options using only their provided information. Return JSON "
            "with results (one item per input option, including name and explanation) and "
            "best_option. Do not invent facts or numerical scores. If evidence is insufficient "
            "to choose, set best_option to null and explain the missing information."
        )
        result = await self._complete_json(
            system_prompt=system_prompt,
            user_prompt=json.dumps({"options": options}, ensure_ascii=False),
        )
        try:
            return ComparisonDraft.model_validate(result).model_dump()
        except ValidationError as exc:
            raise LLMProviderError("The LLM returned an invalid comparison structure.") from exc

    async def process_research_brief(self, brief: str) -> dict[str, Any]:
        if self.provider == "mock":
            return {
                "summary": brief[:300],
                "search_objectives": [],
                "research_questions": [
                    "Which requirements or details need clarification before supplier research?",
                    "What public evidence is needed to evaluate potential suppliers?",
                ],
                "entities": ["suppliers"],
                "missing_information": [],
                "conflicts": [],
            }
        system_prompt = (
            "Create a supplier-research plan from the provided procurement brief. Return only "
            "JSON with summary, search_objectives, research_questions, entities, "
            "missing_information, and conflicts. Do not claim that research has been performed. "
            "Do not invent a budget, deadline, specification, supplier, or factual finding. "
            "Use missing_information for details absent from the brief."
        )
        result = await self._complete_json(system_prompt=system_prompt, user_prompt=brief)
        try:
            return ResearchPlan.model_validate(result).model_dump()
        except ValidationError as exc:
            raise LLMProviderError("The LLM returned an invalid research-plan structure.") from exc
