from collections.abc import Sequence
from dataclasses import dataclass
from math import hypot
from statistics import fmean
from typing import Literal

from balomer_contracts.models import Block, Frame, Metrics, Period, Player, TeamMetrics, Teams

Team = Literal["home", "away"]

MINUTE_MS = 60_000
HALF_MIN = 45
BLOCK_MIN = 15
ROLLING_MIN = 5


@dataclass(frozen=True)
class Shape:
    width: float
    depth: float
    compactness: float
    block: Block


@dataclass(frozen=True)
class TeamSample:
    possessed: bool
    line_height: float
    line_x: float
    shape: Shape
    attack_direction: Literal[1, -1]


def possession(frame: Frame, previous: Team | None, radius_m: float = 2.0) -> Team | None:
    ball = frame.ball
    if ball is None:
        return previous
    nearest = min(
        ((hypot(p.x - ball.x, p.y - ball.y), p.team) for p in frame.players if p.role == "player"),
        default=None,
    )
    if nearest is None or nearest[0] > radius_m:
        return previous
    return nearest[1]


def attack_direction(goalkeeper_x: Sequence[float]) -> Literal[1, -1]:
    return -1 if fmean(goalkeeper_x) > 0 else 1


def defensive_line(
    outfield_x: Sequence[float], direction: Literal[1, -1], pitch_length_m: float, n: int = 4
) -> tuple[float, float]:
    line_x = fmean(sorted(outfield_x, key=lambda x: direction * x)[:n])
    return direction * line_x + pitch_length_m / 2, line_x


def shape(outfield: Sequence[Player]) -> Shape:
    xs = [p.x for p in outfield]
    ys = [p.y for p in outfield]
    block = Block(x_min=min(xs), x_max=max(xs), y_min=min(ys), y_max=max(ys))
    width = block.y_max - block.y_min
    depth = block.x_max - block.x_min
    return Shape(width=width, depth=depth, compactness=width * depth, block=block)


def block_of(clock_ms: int, half: Literal[1, 2]) -> Period:
    start_min = HALF_MIN * (half - 1)
    last = HALF_MIN // BLOCK_MIN - 1
    from_min = start_min + BLOCK_MIN * min((clock_ms // MINUTE_MS - start_min) // BLOCK_MIN, last)
    return Period(kind="block", from_min=from_min, to_min=from_min + BLOCK_MIN)


def rolling_period(clock_ms: int, half: Literal[1, 2]) -> Period:
    to_min = clock_ms / MINUTE_MS
    from_min = max(HALF_MIN * (half - 1), to_min - ROLLING_MIN)
    return Period(kind="rolling", from_min=from_min, to_min=to_min)


def aggregate(
    samples: Sequence[dict[Team, TeamSample]], period: Period, half: Literal[1, 2], clock_ms: int
) -> Metrics:
    def team(name: Team) -> TeamMetrics:
        own = [s[name] for s in samples]
        return TeamMetrics(
            possession=100 * sum(s.possessed for s in own) / len(own),
            line_height=fmean(s.line_height for s in own),
            width=fmean(s.shape.width for s in own),
            depth=fmean(s.shape.depth for s in own),
            compactness=fmean(s.shape.compactness for s in own),
            attack_direction=own[-1].attack_direction,
            line_x=fmean(s.line_x for s in own),
            block=Block(
                x_min=fmean(s.shape.block.x_min for s in own),
                x_max=fmean(s.shape.block.x_max for s in own),
                y_min=fmean(s.shape.block.y_min for s in own),
                y_max=fmean(s.shape.block.y_max for s in own),
            ),
        )

    teams = Teams(home=team("home"), away=team("away"))
    return Metrics(type="metrics", half=half, clock_ms=clock_ms, period=period, teams=teams)
