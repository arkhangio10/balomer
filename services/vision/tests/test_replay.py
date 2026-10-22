from pathlib import Path
from typing import Literal

import pytest
from balomer_contracts.models import Alert, Frame, Metrics, Period, Phase, Player, Point, Session
from balomer_vision.replay import EdgeMessage, parse_clock, read_replay, schedule

FIXTURE = Path(__file__).parent / "fixtures" / "sample_1.jsonl"

session = Session(
    type="session",
    match_id="sample",
    half=1,
    pitch_length_m=105,
    pitch_width_m=68,
    credit="Synthetic test sample",
)
SIDES: tuple[tuple[Literal["home", "away"], float], ...] = (("home", -1.0), ("away", 1.0))
PLAYERS = [
    Player(id=f"{team}{n}", team=team, role="player" if n else "goalkeeper", x=side * x, y=y)
    for team, side in SIDES
    for n, (x, y) in enumerate(
        [(50.0, 0.0), (30.0, -10.0), (30.0, 10.0), (10.0, -10.0), (10.0, 10.0)]
    )
]


def frame_at(k: int) -> Frame:
    """A still 5-a-side match: the ball is loose for 2 s, then at a home player's feet or null."""
    ball = Point(x=0, y=0) if k < 10 else None if k % 10 == 9 else Point(x=-10, y=9)
    return Frame(
        type="frame", half=1, clock_ms=200 * k, players=PLAYERS, ball=ball, possession=None
    )


def label(message: EdgeMessage) -> str:
    return message.period.kind if isinstance(message, Metrics) else message.type


def clock(message: EdgeMessage) -> int | None:
    return message.clock_ms if isinstance(message, Frame | Metrics) else None


frames = [frame_at(k) for k in range(10)]


def test_schedule_respects_speed_and_start() -> None:
    sends = [
        s
        for s in schedule(session, frames, start_ms=0, speed=1)
        if not isinstance(s.message, Metrics | Alert)
    ]
    assert [s.message.type for s in sends] == ["session", "phase"] + ["frame"] * 10 + ["phase"]
    first, last = sends[1].message, sends[-1].message
    assert isinstance(first, Phase) and first.phase == "kickoff"
    assert isinstance(last, Phase) and last.phase == "end"
    assert [s.at_s for s in sends[2:-1]] == pytest.approx([0.2 * k for k in range(10)])
    assert sends[-1].at_s == pytest.approx(2.0)
    fast = [s.message for s in schedule(session, frames, 0, 3) if isinstance(s.message, Frame)]
    assert [f.clock_ms for f in fast] == [0, 600, 1200, 1800]
    late = [s.message for s in schedule(session, frames, 1000, 1) if isinstance(s.message, Frame)]
    assert late[0].clock_ms == 1000 and all(f.clock_ms >= 1000 for f in late)
    assert parse_clock("29:30") == 1_770_000


def test_schedule_publishes_metrics() -> None:
    match = [frame_at(k) for k in range(4800)]
    messages = [s.message for s in schedule(session, match, start_ms=0, speed=1)]
    trace = [(label(m), clock(m)) for m in messages]
    assert [c for kind, c in trace if kind == "rolling"] == list(range(5000, 960_000, 5000))
    assert all(
        trace[i + 1] == ("frame", c) for i, (kind, c) in enumerate(trace) if kind == "rolling"
    )
    first_rolling = messages[trace.index(("rolling", 5000))]
    assert isinstance(first_rolling, Metrics)
    assert first_rolling.teams.home.possession == pytest.approx(60.0)

    closed = trace.index(("block", 900_000))
    assert trace[closed - 1 : closed + 4] == [
        ("frame", 899_800),
        ("block", 900_000),
        ("alert", None),
        ("rolling", 900_000),
        ("frame", 900_000),
    ]
    block = messages[closed]
    assert isinstance(block, Metrics)
    assert block.period == Period(kind="block", from_min=0, to_min=15)
    assert block.teams.home.possession == pytest.approx(100 * 4490 / 4500)
    assert block.teams.away.possession == 0.0
    assert block.teams.home.line_height == pytest.approx(32.5)
    assert (block.teams.home.attack_direction, block.teams.away.attack_direction) == (1, -1)

    assert trace[-3:] == [
        ("block", 959_800),
        ("half", 959_800),
        ("phase", None),
    ]
    last_block, half, end = messages[-3:]
    assert isinstance(last_block, Metrics) and isinstance(half, Metrics)
    assert last_block.period == Period(kind="block", from_min=15, to_min=30)
    assert half.period == Period(kind="half", from_min=0, to_min=45)
    assert isinstance(end, Phase) and end.phase == "end"

    sent = [m for m in messages if isinstance(m, Frame)]
    assert all(f.possession == (None if f.clock_ms < 2000 else "home") for f in sent)

    late = list(schedule(session, match, parse_clock("15:30"), 1))
    first = next(i for i, s in enumerate(late) if isinstance(s.message, Frame))
    assert [(label(s.message), clock(s.message)) for s in late[: first + 1]] == [
        ("session", None),
        ("phase", None),
        ("block", 900_000),
        ("alert", None),
        ("rolling", 930_000),
        ("frame", 930_000),
    ]
    assert all(s.at_s == 0.0 for s in late[: first + 1])
    late_frame = late[first].message
    assert isinstance(late_frame, Frame) and late_frame.possession == "home"


def test_read_replay_reads_the_committed_fixture() -> None:
    read_session, read_frames = read_replay(FIXTURE)
    all_frames = list(read_frames)
    assert read_session.credit == "Synthetic test sample"
    assert len(all_frames) == 30
    assert all(len(f.players) == 22 and f.possession is None for f in all_frames)


def test_no_alert_when_the_replay_ends_before_a_minute_mark() -> None:
    sends = list(schedule(session, frames, start_ms=0, speed=1))
    assert not any(isinstance(s.message, Alert) for s in sends)
