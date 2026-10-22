import argparse
import asyncio
import logging
import time
from collections.abc import Iterable, Iterator, Sequence
from dataclasses import dataclass
from pathlib import Path

from balomer_contracts.models import Alert, Frame, Metrics, Phase, Session
from websockets.asyncio.client import connect

logger = logging.getLogger(__name__)

EdgeMessage = Session | Phase | Frame | Metrics | Alert

FRAME_INTERVAL_S = 0.2
LOG_EVERY_MS = 5_000


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


def schedule(
    session: Session, frames: Iterable[Frame], start_ms: int, speed: float
) -> Iterator[Send]:
    yield Send(0.0, session)
    yield Send(0.0, Phase(type="phase", phase="kickoff", half=session.half))
    step = round(speed)
    sent = 0
    for index, frame in enumerate(f for f in frames if f.clock_ms >= start_ms):
        if index % step == 0:
            yield Send(FRAME_INTERVAL_S * sent, frame)
            sent += 1
    yield Send(FRAME_INTERVAL_S * sent, Phase(type="phase", phase="end", half=session.half))


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
