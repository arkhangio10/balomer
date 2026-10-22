import argparse
import asyncio
import logging
import time
from bisect import bisect_left
from collections.abc import Iterable, Iterator, Sequence
from dataclasses import dataclass
from itertools import chain
from pathlib import Path
from typing import Literal

from balomer_contracts.models import Alert, Frame, Metrics, Period, Phase, Session
from websockets.asyncio.client import connect

from balomer_vision.alerts import minute_alert
from balomer_vision.metrics import (
    HALF_MIN,
    MINUTE_MS,
    ROLLING_MIN,
    Team,
    TeamSample,
    aggregate,
    attack_direction,
    block_of,
    defensive_line,
    possession,
    rolling_period,
    shape,
)

logger = logging.getLogger(__name__)

EdgeMessage = Session | Phase | Frame | Metrics | Alert

FRAME_INTERVAL_S = 0.2
LOG_EVERY_MS = 5_000
DIRECTION_WINDOW_MS = 30_000
ROLLING_EVERY_MS = 5_000
TEAMS: tuple[Team, ...] = ("home", "away")
ALERT_MINUTES: tuple[Literal[15, 30, 60, 75], ...] = (15, 30, 60, 75)


@dataclass(frozen=True)
class Send:
    at_s: float
    message: EdgeMessage


def parse_clock(text: str) -> int:
    minutes, seconds = text.split(":")
    return (int(minutes) * 60 + int(seconds)) * 1000


def read_replay(path: Path) -> tuple[Session, Iterator[Frame]]:
    handle = path.open(encoding="utf-8")
    session = Session.model_validate_json(handle.readline())

    def frames() -> Iterator[Frame]:
        with handle:
            for line in handle:
                yield Frame.model_validate_json(line)

    return session, frames()


def _samples(
    frame: Frame, holder: Team | None, directions: dict[Team, Literal[1, -1]], pitch_length_m: float
) -> dict[Team, TeamSample]:
    samples: dict[Team, TeamSample] = {}
    for team in TEAMS:
        direction = directions[team]
        outfield = [p for p in frame.players if p.team == team and p.role == "player"]
        height, line_x = defensive_line([p.x for p in outfield], direction, pitch_length_m)
        samples[team] = TeamSample(holder == team, height, line_x, shape(outfield), direction)
    return samples


def _alerts(at_s: float, closed: Metrics, previous: Metrics | None) -> Iterator[Send]:
    for minute in ALERT_MINUTES:
        if minute == closed.period.to_min:
            yield Send(at_s, minute_alert(minute, closed, previous))


def schedule(
    session: Session, frames: Iterable[Frame], start_ms: int, speed: float
) -> Iterator[Send]:
    yield Send(0.0, session)
    yield Send(0.0, Phase(type="phase", phase="kickoff", half=session.half))
    half = session.half
    rest = iter(frames)
    head: list[Frame] = []
    for frame in rest:
        head.append(frame)
        if frame.clock_ms >= head[0].clock_ms + DIRECTION_WINDOW_MS:
            break
    opening_end = head[0].clock_ms + DIRECTION_WINDOW_MS
    keepers = [
        p for f in head if f.clock_ms < opening_end for p in f.players if p.role == "goalkeeper"
    ]
    directions: dict[Team, Literal[1, -1]] = {
        team: attack_direction([p.x for p in keepers if p.team == team]) for team in TEAMS
    }
    step = round(speed)
    sent = 0
    index = 0
    holder: Team | None = None
    clocks: list[int] = []
    samples: list[dict[Team, TeamSample]] = []
    block, block_start = block_of(head[0].clock_ms, half), 0
    mark = head[0].clock_ms - head[0].clock_ms % ROLLING_EVERY_MS
    rolling_due = False
    last_block: Metrics | None = None
    for frame in chain(head, rest):
        at_s = FRAME_INTERVAL_S * sent
        current = block_of(frame.clock_ms, half)
        if current != block:
            boundary = int(block.to_min * MINUTE_MS)
            closed = aggregate(samples[block_start:], block, half, boundary)
            yield Send(at_s, closed)
            yield from _alerts(at_s, closed, last_block)
            last_block = closed
            block, block_start = current, len(samples)
        reached = frame.clock_ms - frame.clock_ms % ROLLING_EVERY_MS
        if reached > mark:
            mark, rolling_due = reached, True
        if rolling_due and frame.clock_ms >= start_ms:
            since = bisect_left(clocks, mark - ROLLING_MIN * MINUTE_MS)
            window = samples[since : bisect_left(clocks, mark)]
            yield Send(at_s, aggregate(window, rolling_period(mark, half), half, mark))
            rolling_due = False
        holder = possession(frame, holder)
        clocks.append(frame.clock_ms)
        samples.append(_samples(frame, holder, directions, session.pitch_length_m))
        if frame.clock_ms >= start_ms:
            if index % step == 0:
                yield Send(at_s, frame.model_copy(update={"possession": holder}))
                sent += 1
            index += 1
    at_s = FRAME_INTERVAL_S * sent
    whole = Period(kind="half", from_min=HALF_MIN * (half - 1), to_min=HALF_MIN * half)
    yield Send(at_s, aggregate(samples[block_start:], block, half, clocks[-1]))
    yield Send(at_s, aggregate(samples, whole, half, clocks[-1]))
    yield Send(at_s, Phase(type="phase", phase="end", half=half))


async def publish(url: str, sends: Iterable[Send]) -> None:
    async with connect(url) as ws:
        began = time.monotonic()
        next_log_ms = 0
        for send in sends:
            await asyncio.sleep(max(0.0, began + send.at_s - time.monotonic()))
            if isinstance(send.message, Frame) and send.message.clock_ms >= next_log_ms:
                logger.info("match clock %d ms", send.message.clock_ms)
                next_log_ms = send.message.clock_ms - send.message.clock_ms % LOG_EVERY_MS
                next_log_ms += LOG_EVERY_MS
            await ws.send(send.message.model_dump_json())


def _speed(text: str) -> float:
    value = float(text)
    if value < 1:
        raise argparse.ArgumentTypeError("must be at least 1")
    return value


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Publish a replay file to the API as live.")
    parser.add_argument("path", type=Path)
    parser.add_argument("--start", default="00:00", help="MM:SS match clock to start from")
    parser.add_argument("--speed", type=_speed, default=1.0)
    parser.add_argument("--url", default="ws://127.0.0.1:8080/ws/edge")
    args = parser.parse_args(argv)
    logging.basicConfig(level=logging.INFO)
    session, frames = read_replay(args.path)
    sends = schedule(session, frames, parse_clock(args.start), args.speed)
    asyncio.run(publish(args.url, sends))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
