import asyncio
import logging
from collections.abc import Callable

from balomer_agent.report import generate
from balomer_contracts.models import (
    Alert,
    Frame,
    Message,
    Metrics,
    Phase,
    ReportOk,
    ReportUnavailable,
    Session,
)
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import ValidationError

logger = logging.getLogger(__name__)

Report = Callable[[list[Metrics]], ReportOk | ReportUnavailable]


class Relay:
    """Latest-state cache that lets a TV joining late catch up. Stores the raw text."""

    def __init__(self) -> None:
        self._session: str | None = None
        self._phase: str | None = None
        self._snapshots: list[str] = []
        self._alerts: list[str] = []
        self._rolling: str | None = None
        self._report: str | None = None
        self._frame: str | None = None

    def record(self, message: Message, raw: str) -> None:
        body = message.root
        if isinstance(body, Session):
            if body.half == 1:
                self._snapshots, self._alerts, self._report = [], [], None
            self._phase = self._rolling = self._frame = None
            self._session = raw
        elif isinstance(body, Phase):
            self._phase = raw
        elif isinstance(body, Frame):
            self._frame = raw
        elif isinstance(body, Metrics):
            if body.period.kind == "rolling":
                self._rolling = raw
            else:
                self._snapshots.append(raw)
        elif isinstance(body, Alert):
            self._alerts.append(raw)
        elif isinstance(body, ReportOk | ReportUnavailable):
            self._report = raw

    def snapshots(self, half: int) -> list[Metrics]:
        parsed = (Metrics.model_validate_json(raw) for raw in self._snapshots)
        return [m for m in parsed if m.half == half]

    def replay(self) -> list[str]:
        singles = [self._session, self._phase]
        tail = [self._rolling, self._report, self._frame]
        return [
            raw for raw in [*singles, *self._snapshots, *self._alerts, *tail] if raw is not None
        ]


def create_app(report: Report = generate) -> FastAPI:
    app = FastAPI()
    relay = Relay()
    lock = asyncio.Lock()
    clients: set[asyncio.Queue[str]] = set()
    tasks: set[asyncio.Task[None]] = set()

    def publish(message: Message, raw: str) -> None:
        relay.record(message, raw)
        for queue in clients:
            queue.put_nowait(raw)

    async def halftime(snapshots: list[Metrics]) -> None:
        try:
            result = await asyncio.to_thread(report, snapshots)
        except Exception:
            logger.exception("Halftime report failed")
            return
        raw = result.model_dump_json()
        async with lock:
            publish(Message.model_validate_json(raw), raw)

    @app.websocket("/ws/edge")
    async def edge(websocket: WebSocket) -> None:
        await websocket.accept()
        try:
            while True:
                raw = await websocket.receive_text()
                try:
                    message = Message.model_validate_json(raw)
                except ValidationError as error:
                    logger.warning("Dropped invalid edge message: %s", error)
                    continue
                async with lock:
                    publish(message, raw)
                    body = message.root
                    if isinstance(body, Phase) and body.phase == "end" and body.half == 1:
                        task = asyncio.create_task(halftime(relay.snapshots(1)))
                        tasks.add(task)
                        task.add_done_callback(tasks.discard)
        except WebSocketDisconnect:
            return

    @app.websocket("/ws/tv")
    async def tv(websocket: WebSocket) -> None:
        queue: asyncio.Queue[str] = asyncio.Queue()
        async with lock:
            for raw in relay.replay():
                queue.put_nowait(raw)
            clients.add(queue)

        async def send() -> None:
            while True:
                await websocket.send_text(await queue.get())

        try:
            await websocket.accept()
            sender = asyncio.create_task(send())
            try:
                async for _ in websocket.iter_text():
                    pass
            finally:
                sender.cancel()
        finally:
            clients.discard(queue)

    return app


app = create_app()
