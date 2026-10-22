from typing import Literal

import pytest
from balomer_contracts.models import (
    Alert,
    Block,
    Frame,
    Metrics,
    Period,
    Player,
    Point,
    Session,
    TeamMetrics,
    Teams,
)
from balomer_vision.alerts import TEMPLATES, minute_alert
from balomer_vision.replay import EdgeMessage, schedule

HALF_MS = 45 * 60_000
STEP_MS = 1000
SIDES: tuple[tuple[Literal["home", "away"], float], ...] = (("home", -1.0), ("away", 1.0))
SHAPE = [(50.0, 0.0), (30.0, -10.0), (30.0, 10.0), (10.0, -10.0), (10.0, 10.0)]


def half_frames(half: Literal[1, 2]) -> list[Frame]:
    """A 5-a-side match whose shape and ball change every quarter-hour."""
    start = HALF_MS * (half - 1)
    frames = []
    for clock in range(start, start + HALF_MS, STEP_MS):
        quarter = (clock - start) // 900_000
        players = [
            Player(
                id=f"{team}{n}",
                team=team,
                role="player" if n else "goalkeeper",
                x=side * (x - 3 * quarter * (side > 0)),
                y=y * (1 + 0.2 * quarter),
            )
            for team, side in SIDES
            for n, (x, y) in enumerate(SHAPE)
        ]
        ball = Point(x=-10, y=9) if quarter % 2 == 0 else Point(x=10, y=9)
        frames.append(
            Frame(
                type="frame", half=half, clock_ms=clock, players=players, ball=ball, possession=None
            )
        )
    return frames


def messages_of(half: Literal[1, 2], start_ms: int = 0) -> list[EdgeMessage]:
    session = Session(
        type="session",
        match_id="sample",
        half=half,
        pitch_length_m=105,
        pitch_width_m=68,
        credit="Synthetic test sample",
    )
    return [s.message for s in schedule(session, half_frames(half), start_ms, speed=1)]


def team_metrics(**values: float) -> TeamMetrics:
    base = {"possession": 50.0, "line_height": 30.0, "width": 40.0, "depth": 40.0}
    base["compactness"] = 1600.0
    return TeamMetrics(
        **{**base, **values},
        attack_direction=1,
        line_x=0.0,
        block=Block(x_min=0, x_max=1, y_min=0, y_max=1),
    )


def metrics(to_min: float, **home: float) -> Metrics:
    return Metrics(
        type="metrics",
        half=1,
        clock_ms=0,
        period=Period(kind="block", from_min=to_min - 15, to_min=to_min),
        teams=Teams(home=team_metrics(**home), away=team_metrics()),
    )


@pytest.mark.parametrize(("half", "minutes"), [(1, [15, 30]), (2, [60, 75])])
def test_one_alert_per_minute_mark_right_after_its_block(
    half: Literal[1, 2], minutes: list[int]
) -> None:
    messages = messages_of(half)
    alerts = [(i, m) for i, m in enumerate(messages) if isinstance(m, Alert)]
    assert [a.minute for _, a in alerts] == minutes
    for i, alert in alerts:
        block = messages[i - 1]
        assert isinstance(block, Metrics) and block.period.kind == "block"
        assert block.period.to_min == alert.minute


def test_evidence_points_at_blocks_sent_earlier() -> None:
    sent: list[Period] = []
    checked = 0
    for message in messages_of(2):
        if isinstance(message, Metrics) and message.period.kind == "block":
            sent.append(message.period)
        if isinstance(message, Alert):
            assert all(e.period in sent for e in message.evidence)
            checked += len(message.evidence)
    assert checked == 4


def test_alerts_before_start_follow_their_blocks() -> None:
    messages = messages_of(1, start_ms=31 * 60_000)
    kinds = [
        m.minute if isinstance(m, Alert) else m.period.kind
        for m in messages
        if isinstance(m, Alert | Metrics)
    ]
    assert kinds[:5] == ["block", 15, "block", 30, "rolling"]


def test_no_digit_and_12_to_15_words() -> None:
    texts = [t.format(team="Home", other="Away") for t in TEMPLATES.values()]
    texts += [m.text for m in messages_of(1) + messages_of(2) if isinstance(m, Alert)]
    for text in texts:
        assert not any(c.isdigit() for c in text)
        assert 12 <= len(text.split()) <= 15
    assert not any(c.isdigit() for c in "".join(TEMPLATES))


def test_previous_block_rule_picks_largest_relative_change() -> None:
    before = metrics(15, line_height=30.0, width=40.0)
    now = metrics(30, line_height=24.0, width=44.0, possession=51.0)
    alert = minute_alert(30, now, before)
    assert alert.template_id == "line_height_down"
    assert alert.text.startswith("Home ") and "Away" not in alert.text
    assert [(e.metric, e.team, e.period.to_min) for e in alert.evidence] == [
        ("line_height", "home", 15),
        ("line_height", "home", 30),
    ]


def test_previous_block_rule_skips_zero_baseline() -> None:
    before = metrics(60, possession=0.0)
    alert = minute_alert(75, metrics(75, possession=10.0, width=44.0), before)
    assert alert.template_id == "width_up"


def test_team_comparison_without_previous_names_the_leader() -> None:
    alert = minute_alert(15, metrics(15, depth=36.0, possession=80.0), None)
    assert alert.template_id == "possession_lead"
    assert alert.text.startswith("Home ") and alert.text.count("Away") == 1
    assert [(e.metric, e.team) for e in alert.evidence] == [
        ("possession", "home"),
        ("possession", "away"),
    ]
