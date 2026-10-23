import json
from pathlib import Path
from typing import Literal

import numpy as np
import pytest
from balomer_contracts.models import Frame, Session
from balomer_vision.replay import read_replay
from balomer_vision.soccertrack import main, to_frames

PLAYER, GOALKEEPER, REFEREE, OTHER = 1, 2, 3, 7
ROLES = {PLAYER: "player", GOALKEEPER: "goalkeeper", REFEREE: "referee", OTHER: "other"}
EVERY_2_S = range(1, 802, 50)


def person(
    half: Literal[1, 2], n: int, pid: int, side: str, category: int, x: float
) -> dict[str, object]:
    """A GSR object annotation on 25 fps frame n (1-based), at (x, 0) m."""
    at = {"x": x, "y": 0.0}
    return {
        "image_id": f"390{half}{n:06d}",
        "supercategory": "object",
        "category_id": category,
        "attributes": {"role": ROLES[category], "team": side, "player_id": pid},
        "bbox_pitch": {
            f"{axis}_bottom_{end}": at[axis] for axis in at for end in ("left", "right", "middle")
        },
    }


def cast(
    half: Literal[1, 2], frames: range, roster: list[tuple[int, str, int]]
) -> list[dict[str, object]]:
    return [
        person(half, n, pid, side, category, -float(pid))
        for n in frames
        for pid, side, category in roster
    ]


def in_order(annotations: list[dict[str, object]]) -> list[dict[str, object]]:
    return sorted(annotations, key=lambda a: str(a["image_id"]))


def write_half(source: Path, half: Literal[1, 2], annotations: list[dict[str, object]]) -> None:
    name = {1: "1st", 2: "2nd"}[half]
    gsr = source / "gsr" / "7"
    gsr.mkdir(parents=True, exist_ok=True)
    pitch = {
        "image_id": f"390{half}000001",
        "supercategory": "pitch",
        "category_id": 5,
        "lines": {},
    }
    document = {
        "info": {"version": "1.3", "game_time_start": f"{half} - 00:00", "frame_rate": 25},
        "images": [],
        "annotations": [pitch, *in_order(annotations)],
        "categories": [{"supercategory": "object", "id": c, "name": r} for c, r in ROLES.items()],
    }
    (gsr / f"7_{name}.json").write_text(json.dumps(document), encoding="utf-8")
    ball = source / "ball"
    ball.mkdir(exist_ok=True)
    frame = np.arange(1, 802, dtype=np.int32)
    x = frame.astype(np.float32)
    x[0] = np.nan
    np.savez(
        ball / f"7_{name}_ball.npz",
        frame=frame,
        x=x,
        y=np.zeros_like(x),
        status=np.ones_like(frame, dtype=np.int8),
        y_flipped=np.bool_(False),
    )


def by_clock(frames: list[Frame]) -> dict[int, dict[str, float]]:
    return {f.clock_ms: {p.id: p.x for p in f.players} for f in frames}


def test_gsr_fixture_to_frames(tmp_path: Path) -> None:
    source, out = tmp_path / "soccertrack-v2", tmp_path / "replay"
    first = cast(1, EVERY_2_S, [(1, "left", GOALKEEPER), (2, "left", PLAYER)])
    first += cast(1, EVERY_2_S, [(3, "right", GOALKEEPER), (4, "right", PLAYER)])
    first += [
        person(1, 3, 2, "left", PLAYER, -9.0),
        person(1, 26, 5, "right", PLAYER, 6.0),
        person(1, 76, 5, "right", PLAYER, 7.0),
        person(1, 151, 5, "right", PLAYER, 8.0),
        person(1, 1, 90, "left", REFEREE, 0.0),
        person(1, 1, 91, "right", OTHER, 0.0),
    ]
    write_half(source, 1, first)
    second = cast(2, EVERY_2_S, [(1, "right", GOALKEEPER), (2, "right", PLAYER)])
    second += cast(2, EVERY_2_S, [(3, "left", GOALKEEPER), (4, "left", PLAYER)])
    second += cast(2, EVERY_2_S, [(6, "right", PLAYER)])
    write_half(source, 2, second)

    assert main(["7", "--source", str(source), "--out", str(out)]) == 0

    halves: list[list[Frame]] = []
    for half in (1, 2):
        session, frames = read_replay(out / f"7_{half}.jsonl")
        assert session == Session(
            type="session",
            match_id="7",
            half=half,
            pitch_length_m=105,
            pitch_width_m=68,
            credit="Data: SoccerTrack v2 (CC BY 4.0)",
        )
        halves.append(list(frames))
    one, two = halves

    assert [f.clock_ms for f in one] == list(range(0, 32_001, 200))
    assert [f.clock_ms for f in two] == list(range(2_700_000, 2_732_001, 200))
    assert all(f.half == 1 for f in one) and all(f.half == 2 for f in two)
    assert all(f.possession is None for f in one + two)
    assert one[0].ball is None and one[1].ball is not None and one[1].ball.x == 6.0

    teams = {(f.half, p.id): (p.team, p.role) for f in one + two for p in f.players}
    assert teams[1, "1"] == teams[2, "1"] == ("home", "goalkeeper")
    assert teams[1, "2"] == teams[2, "2"] == ("home", "player")
    assert teams[1, "4"] == teams[2, "4"] == ("away", "player")
    assert teams[2, "6"] == ("home", "player")
    assert not {"90", "91"} & {pid for _, pid in teams}

    xs = by_clock(one)
    assert xs[0]["2"] == -2.0 and xs[200]["2"] == -9.0
    assert "5" not in xs[800]
    assert xs[2800]["5"] == 6.0 and xs[3000]["5"] == 7.0
    assert xs[5000]["5"] == 7.0
    assert all("5" not in xs[c] for c in range(5200, 6000, 200))
    assert xs[6000]["5"] == 8.0

    keepers_and_home = [(1, "left", GOALKEEPER), (2, "left", PLAYER), (3, "right", GOALKEEPER)]
    short = cast(1, range(1, 102, 50), keepers_and_home) + [person(1, 1, 4, "right", PLAYER, 4.0)]
    kept = list(to_frames(in_order(short), {}, 1, {}))
    assert [f.clock_ms for f in kept] == list(range(0, 2_001, 200))

    no_away_keeper = cast(1, EVERY_2_S, [(1, "left", GOALKEEPER), (2, "left", PLAYER)])
    no_away_keeper += cast(1, EVERY_2_S, [(4, "right", PLAYER)])
    with pytest.raises(ValueError, match="goalkeeper"):
        list(to_frames(in_order(no_away_keeper), {}, 1, {}))
