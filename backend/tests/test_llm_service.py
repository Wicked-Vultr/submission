import json
from types import SimpleNamespace

import pytest

from app.services import llm_service
from app.services.llm_service import LLMProviderError, LLMService


class FakeResponse:
    def __init__(self, content: str):
        self.content = content

    def raise_for_status(self):
        return None

    def json(self):
        return {"choices": [{"message": {"content": self.content}}]}


class FakeAsyncClient:
    def __init__(self, *, response: FakeResponse, requests: list[dict]):
        self.response = response
        self.requests = requests

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_value, traceback):
        return None

    async def post(self, url: str, *, headers: dict, json: dict):
        self.requests.append({"url": url, "headers": headers, "json": json})
        return self.response


@pytest.mark.asyncio
async def test_vultr_research_plan_uses_configured_chat_endpoint(monkeypatch):
    requests: list[dict] = []
    plan = {
        "summary": "Research business laptops for a team.",
        "search_objectives": ["Find suppliers with published business laptop specifications."],
        "research_questions": ["What warranties are published by each supplier?"],
        "entities": ["business laptops", "suppliers"],
        "missing_information": ["Budget"],
        "conflicts": [],
    }

    monkeypatch.setattr(
        llm_service,
        "settings",
        SimpleNamespace(
            llm_provider="vultr",
            llm_base_url="",
            llm_api_key="",
            llm_model="unused-model",
            vultr_inference_url="",
            vultr_inference_api_key="test-vultr-key",
            vultr_inference_model="test-model",
        ),
    )
    monkeypatch.setattr(
        llm_service.httpx,
        "AsyncClient",
        lambda **kwargs: FakeAsyncClient(
            response=FakeResponse(json.dumps(plan)),
            requests=requests,
        ),
    )

    result = await LLMService().process_research_brief("We need laptops for our staff.")

    assert result == plan
    assert requests[0]["url"] == "https://api.vultrinference.com/v1/chat/completions"
    assert requests[0]["headers"]["Authorization"] == "Bearer test-vultr-key"
    assert requests[0]["json"]["model"] == "test-model"


def test_vultr_requires_its_model_setting(monkeypatch):
    monkeypatch.setattr(
        llm_service,
        "settings",
        SimpleNamespace(
            llm_provider="vultr",
            llm_base_url="",
            llm_api_key="",
            llm_model="unused-model",
            vultr_inference_url="",
            vultr_inference_api_key="test-vultr-key",
            vultr_inference_model="",
        ),
    )

    with pytest.raises(LLMProviderError, match="model name"):
        LLMService()._provider_config()


def test_openai_provider_uses_default_api_base(monkeypatch):
    monkeypatch.setattr(
        llm_service,
        "settings",
        SimpleNamespace(
            llm_provider="openai",
            llm_base_url="",
            llm_api_key="test-openai-key",
            llm_model="test-model",
        ),
    )

    assert LLMService()._provider_config() == (
        "https://api.openai.com/v1",
        "test-openai-key",
        "test-model",
    )


def test_openai_compatible_provider_requires_a_base_url(monkeypatch):
    monkeypatch.setattr(
        llm_service,
        "settings",
        SimpleNamespace(
            llm_provider="openai_compatible",
            llm_base_url="",
            llm_api_key="test-key",
            llm_model="test-model",
        ),
    )

    with pytest.raises(LLMProviderError, match="base URL"):
        LLMService()._provider_config()


@pytest.mark.asyncio
async def test_mock_provider_creates_a_plan_without_external_calls(monkeypatch):
    monkeypatch.setattr(
        llm_service,
        "settings",
        SimpleNamespace(llm_provider="mock"),
    )

    result = await LLMService().process_research_brief("We need laptops for our staff.")

    assert result["summary"] == "We need laptops for our staff."
    assert result["entities"] == ["suppliers"]
    assert result["missing_information"] == []


@pytest.mark.asyncio
async def test_invalid_provider_json_is_reported(monkeypatch):
    requests: list[dict] = []
    monkeypatch.setattr(
        llm_service,
        "settings",
        SimpleNamespace(
            llm_provider="openai_compatible",
            llm_base_url="https://llm.example/v1",
            llm_api_key="test-key",
            llm_model="test-model",
        ),
    )
    monkeypatch.setattr(
        llm_service.httpx,
        "AsyncClient",
        lambda **kwargs: FakeAsyncClient(
            response=FakeResponse("not-json"),
            requests=requests,
        ),
    )

    with pytest.raises(LLMProviderError, match="not valid JSON"):
        await LLMService().process_research_brief("We need laptops for our staff.")
