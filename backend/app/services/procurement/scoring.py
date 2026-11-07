from __future__ import annotations

from typing import Any

DEFAULT_WEIGHTS = {
    "specification_fit": 0.30,
    "price": 0.25,
    "delivery": 0.20,
    "warranty_and_support": 0.15,
    "evidence_confidence": 0.10,
}


def build_vendor_score(criterion_scores: dict[str, Any], weights: dict[str, float] | None = None) -> dict[str, Any]:
    if weights is None:
        weights = DEFAULT_WEIGHTS

    safe_weights = {key: float(value) for key, value in weights.items()}
    missing = []
    numeric_scores: dict[str, float] = {}

    for key, value in criterion_scores.items():
        if value is None:
            missing.append(key)
            continue
        try:
            numeric_scores[key] = float(value)
        except (TypeError, ValueError):
            missing.append(key)

    total_weight = sum(safe_weights.get(key, 0.0) for key in numeric_scores)
    weighted_value = 0.0
    for key, score in numeric_scores.items():
        weighted_value += (score / 100.0) * safe_weights.get(key, 0.0)

    overall_score = round((weighted_value / total_weight) * 100.0, 2) if total_weight else 0.0
    return {
        "criterion_scores": {key: round(score, 2) for key, score in numeric_scores.items()},
        "overall_score": overall_score,
        "missing_information": missing,
        "explanation": "Weighted score calculated from available evidence; missing criteria are excluded from the denominator.",
    }
