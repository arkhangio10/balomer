import json
from collections.abc import Iterator
from pathlib import Path
from typing import Any

import pytest
from balomer_api.app import create_app
from fastapi.testclient import TestClient
from starlette.testclient import WebSocketTestSession

EXAMPLES = Path(__file__).parents[3] / "packages" / "contracts" / "examples"

Sockets = tuple[TestClient, WebSocketTestSession, WebSocketTestSession]


def load(name: str, **changes: Any) -> dict[str, Any]:  # Any: parsed JSON.
    message: dict[str, Any] = json.loads((EXAMPLES / f"{name}.json").read_text(encoding="utf-8"))
    message.update(changes)
    return message


def metrics(kind: str, from_min: int, to_min: int, clock_ms: int) -> dict[str, Any]:
    period = {"kind": kind, "from_min": from_min, "to_min": to_min}
    return load("metrics", clock_ms=clock_ms, period=period)


session = load("session")
kickoff = load("phase", phase="kickoff")
frame_1 = load("frame", clock_ms=1000)
frame_2 = load("frame", clock_ms=1200)
frame_3 = load("frame", clock_ms=1400)
rolling_1 = metrics("rolling", 0, 5, 1000)
rolling_2 = metrics("rolling", 1, 6, 1200)
block_0_15 = metrics("block", 0, 15, 900000)
alert_15 = load("alert", minute=15)
alert_30 = load("alert", minute=30)
report = load("report_ok")


@pytest.fixture
def sockets() -> Iterator[Sockets]:
    with (
        TestClient(create_app()) as client,
        client.websocket_connect("/ws/tv") as early,
        client.websocket_connect("/ws/edge") as edge,
    ):
        yield client, early, edge


def send_all(sockets: Sockets, sent: list[dict[str, Any]]) -> None:
    """Send through the edge; the early TV receiving them all proves they were processed."""
    _, early, edge = sockets
    for message in sent:
        edge.send_text(json.dumps(message))
    assert [early.receive_json() for _ in sent] == sent


def late_replay(sockets: Sockets, count: int) -> list[Any]:  # Any: parsed JSON.
    client = sockets[0]
    with client.websocket_connect("/ws/tv") as late:
        return [late.receive_json() for _ in range(count)]


def test_late_client_gets_latest_state(sockets: Sockets) -> None:
    client, early, edge = sockets
    sent = [
        session,
        kickoff,
        frame_1,
        frame_2,
        rolling_1,
        rolling_2,
        block_0_15,
        alert_15,
        alert_30,
    ]
    send_all(sockets, sent)
    with client.websocket_connect("/ws/tv") as late:
        assert [late.receive_json() for _ in range(7)] == [
            session,
            kickoff,
            block_0_15,
            alert_15,
            alert_30,
            rolling_2,
            frame_2,
        ]
        edge.send_text(json.dumps({"type": "frame"}))
        edge.send_text(json.dumps(frame_3))
        assert late.receive_json() == frame_3
        assert early.receive_json() == frame_3


def test_report_is_replayed_after_rolling_metrics(sockets: Sockets) -> None:
    send_all(sockets, [session, rolling_1, report, frame_1])
    assert late_replay(sockets, 4) == [session, rolling_1, report, frame_1]


def test_new_first_half_session_clears_cache(sockets: Sockets) -> None:
    session_again = load("session", match_id="other")
    sent = [session, kickoff, frame_1, rolling_1, block_0_15, alert_15, report, session_again]
    send_all(sockets, sent)
    assert late_replay(sockets, 1) == [session_again]


def test_second_half_session_keeps_snapshots_alerts_and_report(sockets: Sockets) -> None:
    session_h2 = load("session", half=2)
    sent = [
        session,
        kickoff,
        frame_1,
        rolling_1,
        block_0_15,
        alert_15,
        alert_30,
        report,
        session_h2,
    ]
    send_all(sockets, sent)
    assert late_replay(sockets, 5) == [session_h2, block_0_15, alert_15, alert_30, report]


def test_raw_text_is_forwarded_unchanged(sockets: Sockets) -> None:
    _, early, edge = sockets
    raw = (
        '{"type": "frame", "half": 1, "clock_ms": 1000, '
        '"players": [], "ball": null, "possession": null}'
    )
    edge.send_text(raw)
    assert early.receive_text() == raw
