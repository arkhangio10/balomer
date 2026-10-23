import logging
import os
from collections.abc import Callable, Sequence
from typing import get_args

from balomer_contracts.models import (
    Evidence,
    Metrics,
    Recommendation,
    ReportOk,
    ReportUnavailable,
)
from pydantic import BaseModel
from strands import Agent
from strands.models import BedrockModel

logger = logging.getLogger(__name__)

REGION = "us-east-1"
MAX_TOKENS = 1024
MAX_TEXT = 110
METRICS = get_args(Evidence.model_fields["metric"].annotation)
TEAMS = get_args(Evidence.model_fields["team"].annotation)

SYSTEM_PROMPT = f"""You are the halftime analyst for an amateur football coach.
You receive the first half's metric snapshots as JSON, one per line: one per 15-minute block
and one for the whole half. Each holds Home's and Away's possession (%), line height (m from
their own goal line), width and depth (m) and compactness (m²).

Write exactly three recommendations. Each has a problem the numbers show, one adjustment for
the second half, and its evidence: the metric, team and period it rests on, copied exactly
from the input.

Rules:
- Never write a digit. The TV shows the numbers from your evidence.
- Keep each problem and each adjustment under {MAX_TEXT} characters.
- Call the teams Home and Away."""


class Draft(BaseModel):
    """The three halftime recommendations."""

    recommendations: list[Recommendation]


Ask = Callable[[str], Draft]


def validate(draft: Draft, snapshots: Sequence[Metrics]) -> list[str]:
    known = {
        Evidence(metric=metric, team=team, period=s.period).model_dump_json()
        for s in snapshots
        for metric in METRICS
        for team in TEAMS
    }
    errors = []
    if len(draft.recommendations) != 3:
        errors.append(f"There are {len(draft.recommendations)} recommendations, not three.")
    for n, recommendation in enumerate(draft.recommendations, start=1):
        for field in ("problem", "adjustment"):
            text: str = getattr(recommendation, field)
            if any(ch.isdigit() for ch in text):
                errors.append(f"Recommendation {n}: the {field} contains a digit.")
            if len(text) > MAX_TEXT:
                errors.append(f"Recommendation {n}: the {field} is over {MAX_TEXT} characters.")
        errors += [
            f"Recommendation {n}: {e.model_dump_json()} is not in the input."
            for e in recommendation.evidence
            if e.model_dump_json() not in known
        ]
    return errors


def bedrock(model_id: str) -> Ask:
    model = BedrockModel(model_id=model_id, region_name=REGION, max_tokens=MAX_TOKENS)
    agent = Agent(model=model, system_prompt=SYSTEM_PROMPT, callback_handler=None)

    def ask(prompt: str) -> Draft:
        return Draft.model_validate(agent(prompt, structured_output_model=Draft).structured_output)

    return ask


def generate(snapshots: Sequence[Metrics], ask: Ask | None = None) -> ReportOk | ReportUnavailable:
    ask = ask or bedrock(os.environ["BEDROCK_MODEL_ID"])
    prompt = "\n".join(s.model_dump_json() for s in snapshots)
    for _ in range(2):
        draft = ask(prompt)
        errors = validate(draft, snapshots)
        if not errors:
            return ReportOk(
                type="report", kind="halftime", status="ok", recommendations=draft.recommendations
            )
        logger.warning("Halftime report failed validation: %s", errors)
        prompt = "Your answer failed validation. Answer again, fixing:\n" + "\n".join(errors)
    return ReportUnavailable(type="report", kind="halftime", status="unavailable")
