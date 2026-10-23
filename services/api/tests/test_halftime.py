import json
from pathlib import Path
from typing import Any

from balomer_api.app import create_app
from balomer_contracts.models import Metrics, ReportOk
from fastapi.testclient import TestClient

EXAMPLES = Path(__file__).parents[3] / "packages" / "contracts" / "examples"


def load(name: str, **changes: Any) -> dict[str, Any]:  # Any: parsed JSON.
    message: dict[str, Any] = json.loads((EXAMPLES / f"{name}.json").read_text(encoding="utf-8"))
    message.update(changes)
    return message


def metrics(kind: str, from_min: int, to_min: int) -> dict[str, Any]:
    return load("metrics", period={"kind": kind, "from_min": from_min, "to_min": to_min})


def test_phase_end_for_half_one_triggers_one_report() -> None:
    calls: list[list[Metrics]] = []

    def stub(snapshots: list[Metrics]) -> ReportOk:
        calls.append(snapshots)
        return ReportOk.model_validate(load("report_ok"))

    first = [
        load("session"),
        load("phase", phase="kickoff"),
        metrics("rolling", 40, 45),
        metrics("block", 30, 45),
        metrics("half", 0, 45),
        load("phase", phase="end"),
    ]
    second = [
        load("session", half=2),
        load("phase", phase="kickoff", half=2),
        load("phase", phase="end", half=2),
        load("frame", half=2, clock_ms=2_800_000),
    ]
    with (
        TestClient(create_app(report=stub)) as client,
        client.websocket_connect("/ws/tv") as tv,
        client.websocket_connect("/ws/edge") as edge,
    ):
        for message in first:
            edge.send_text(json.dumps(message))
        assert [tv.receive_json() for _ in first] == first
        assert tv.receive_json() == load("report_ok")
        for message in second:
            edge.send_text(json.dumps(message))
        assert [tv.receive_json() for _ in second] == second

    assert [[s.period.kind for s in snapshots] for snapshots in calls] == [["block", "half"]]
