from pathlib import Path

import pytest
from balomer_contracts.models import Frame, Phase, Session
from balomer_vision.replay import parse_clock, read_replay, schedule

FIXTURE = Path(__file__).parent / "fixtures" / "sample_1.jsonl"

session = Session(
    type="session",
    match_id="sample",
    half=1,
    pitch_length_m=105,
    pitch_width_m=68,
    credit="Synthetic test sample",
)
frames = [
    Frame(type="frame", half=1, clock_ms=200 * k, players=[], ball=None, possession=None)
    for k in range(10)
]


def test_schedule_respects_speed_and_start() -> None:
    sends = list(schedule(session, frames, start_ms=0, speed=1))
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


def test_read_replay_reads_the_committed_fixture() -> None:
    read_session, read_frames = read_replay(FIXTURE)
    all_frames = list(read_frames)
    assert read_session.credit == "Synthetic test sample"
    assert len(all_frames) == 30
    assert all(len(f.players) == 22 and f.possession is None for f in all_frames)
