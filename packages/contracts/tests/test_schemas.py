import json
from collections.abc import Callable
from pathlib import Path
from typing import Any

import pytest
from balomer_contracts.models import Message
from pydantic import ValidationError

EXAMPLES = Path(__file__).parents[1] / "examples"
MESSAGE_TYPES = {"session", "phase", "frame", "metrics", "alert", "report"}

# Any: parsed JSON that the tests break on purpose before validating it.
INVALID_REPORTS: dict[str, Callable[[Any], object]] = {
    "two recommendations": lambda r: r["recommendations"].pop(),
    "recommendation without evidence": lambda r: r["recommendations"][0].pop("evidence"),
    "evidence without a period": lambda r: r["recommendations"][0]["evidence"][0].pop("period"),
    "ok report with no recommendations": lambda r: r.pop("recommendations"),
}


def load(name: str) -> Any:  # Any: parsed JSON, shaped by the schemas under test.
    return json.loads((EXAMPLES / name).read_text(encoding="utf-8"))


@pytest.mark.parametrize("path", sorted(EXAMPLES.glob("*.json")), ids=lambda p: p.stem)
def test_examples_validate(path: Path) -> None:
    Message.model_validate_json(path.read_text(encoding="utf-8"))


def test_every_message_type_has_an_example() -> None:
    assert {load(path.name)["type"] for path in EXAMPLES.glob("*.json")} == MESSAGE_TYPES


@pytest.mark.parametrize("breakage", INVALID_REPORTS.values(), ids=list(INVALID_REPORTS))
def test_invalid_reports_are_rejected(breakage: Callable[[Any], object]) -> None:
    report = load("report_ok.json")
    breakage(report)
    with pytest.raises(ValidationError):
        Message.model_validate(report)
