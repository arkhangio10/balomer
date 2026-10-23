import argparse
import logging
from collections.abc import Iterable, Iterator, Mapping, Sequence
from pathlib import Path
from typing import Any, Literal

import ijson
import numpy as np
from balomer_contracts.models import Frame, Player, Point, Session

from balomer_vision.metrics import HALF_MIN, MINUTE_MS, Team
from balomer_vision.replay import DIRECTION_WINDOW_MS, TEAMS

logger = logging.getLogger(__name__)

SOURCE_FRAME_MS = 40
FRAME_MS = 200
HOLD_MS = 2_000
ROLES: dict[int, Literal["player", "goalkeeper"]] = {1: "player", 2: "goalkeeper"}
HALVES: dict[Literal[1, 2], str] = {1: "1st", 2: "2nd"}
CREDIT = "Data: SoccerTrack v2 (CC BY 4.0)"

# Any: ijson yields untyped JSON values.
Annotation = Mapping[str, Any]


def _ticks(
    annotations: Iterable[Annotation], half: Literal[1, 2], teams: dict[str, Team]
) -> Iterator[tuple[int, list[Player]]]:
    seen: dict[str, tuple[int, Player]] = {}

    def held(tick: int) -> list[Player]:
        return [p for at, p in seen.values() if tick - at <= HOLD_MS]

    tick = 0
    clock = 0
    for annotation in annotations:
        role = ROLES.get(annotation["category_id"])
        if role is None:
            continue
        clock = (int(annotation["image_id"][-6:]) - 1) * SOURCE_FRAME_MS
        while tick < clock:
            yield tick, held(tick)
            tick += FRAME_MS
        attributes, point = annotation["attributes"], annotation["bbox_pitch"]
        pid = str(attributes["player_id"])
        left_is_home = (attributes["team"] == "left") == (half == 1)
        team = teams.setdefault(pid, "home" if left_is_home else "away")
        x, y = point["x_bottom_middle"], point["y_bottom_middle"]
        seen[pid] = (clock, Player(id=pid, team=team, role=role, x=x, y=y))
    while tick <= clock:
        yield tick, held(tick)
        tick += FRAME_MS


def to_frames(
    annotations: Iterable[Annotation],
    ball: Mapping[int, Point],
    half: Literal[1, 2],
    teams: dict[str, Team],
) -> Iterator[Frame]:
    offset = HALF_MIN * MINUTE_MS * (half - 1)
    opening_end: int | None = None
    keepers: set[Team] = set()
    dropped = 0
    for tick, players in _ticks(annotations, half, teams):
        if not all(any(p.team == t and p.role == "player" for p in players) for t in TEAMS):
            dropped += 1
            continue
        if opening_end is None:
            opening_end = tick + DIRECTION_WINDOW_MS
        if tick < opening_end:
            keepers.update(p.team for p in players if p.role == "goalkeeper")
        elif len(keepers) < len(TEAMS):
            raise ValueError(f"half {half}: no goalkeeper for {set(TEAMS) - keepers} in 30 s")
        yield Frame(
            type="frame",
            half=half,
            clock_ms=offset + tick,
            players=players,
            ball=ball.get(tick // SOURCE_FRAME_MS + 1),
            possession=None,
        )
    logger.info("half %d: dropped %d frames without an outfield player per team", half, dropped)


def read_ball(path: Path) -> dict[int, Point]:
    with np.load(path) as track:
        return {
            int(n): Point(x=float(x), y=float(y))
            for n, x, y in zip(track["frame"], track["x"], track["y"], strict=True)
            if not np.isnan(x)
        }


def read_gsr(path: Path) -> Iterator[Annotation]:
    with path.open("rb") as handle:
        yield from ijson.items(handle, "annotations.item", use_float=True)


def ingest(match_id: str, source: Path, out: Path) -> None:
    teams: dict[str, Team] = {}
    for half, name in HALVES.items():
        session = Session(
            type="session",
            match_id=match_id,
            half=half,
            pitch_length_m=105,
            pitch_width_m=68,
            credit=CREDIT,
        )
        annotations = read_gsr(source / "gsr" / match_id / f"{match_id}_{name}.json")
        ball = read_ball(source / "ball" / f"{match_id}_{name}_ball.npz")
        target = out / f"{match_id}_{half}.jsonl"
        with target.open("w", encoding="utf-8") as handle:
            handle.write(session.model_dump_json() + "\n")
            for frame in to_frames(annotations, ball, half, teams):
                handle.write(frame.model_dump_json() + "\n")
        logger.info("wrote %s", target)


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Write a SoccerTrack v2 match as replay files.")
    parser.add_argument("match_id")
    parser.add_argument("--source", type=Path, default=Path("data/soccertrack-v2"))
    parser.add_argument("--out", type=Path, default=Path("data/replay"))
    args = parser.parse_args(argv)
    logging.basicConfig(level=logging.INFO)
    args.out.mkdir(parents=True, exist_ok=True)
    ingest(args.match_id, args.source, args.out)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
