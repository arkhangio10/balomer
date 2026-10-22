from typing import Literal

import pytest
from balomer_contracts.models import Block, Frame, Period, Player, Point
from balomer_vision.metrics import (
    Shape,
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

MINUTE = 60_000


def player(
    team: Literal["home", "away"],
    x: float,
    y: float = 0.0,
    role: Literal["player", "goalkeeper"] = "player",
) -> Player:
    return Player(id=f"{team}-{x}-{y}", team=team, role=role, x=x, y=y)


def frame(players: list[Player], ball: Point | None) -> Frame:
    return Frame(type="frame", half=1, clock_ms=0, players=players, ball=ball, possession=None)


def test_possession_nearest_within_two_metres() -> None:
    players = [player("away", 1.0), player("home", 1.5), player("home", 0.5, role="goalkeeper")]
    assert possession(frame(players, Point(x=0, y=0)), None) == "away"


def test_possession_keeps_previous() -> None:
    assert possession(frame([player("away", 2.5)], Point(x=0, y=0)), "home") == "home"
    assert possession(frame([player("away", 0.5)], None), "home") == "home"


def test_attack_direction() -> None:
    assert attack_direction([-48.0, -47.5]) == 1
    assert attack_direction([49.0]) == -1


def test_defensive_line() -> None:
    home = defensive_line([-30.0, -25.0, -20.0, -9.0, 0.0, 10.0], 1, 105)
    away = defensive_line([30.0, 29.0, 28.0, 27.0, 5.0, 0.0], -1, 105)
    assert home == pytest.approx((31.5, -21.0))
    assert away == pytest.approx((24.0, 28.5))


def test_shape() -> None:
    result = shape(
        [player("home", -24.1, 0.0), player("home", 12.1, -22.0), player("home", 0, 22.8)]
    )
    assert (result.width, result.depth, result.compactness) == pytest.approx((44.8, 36.2, 1621.76))
    assert result.block == Block(x_min=-24.1, x_max=12.1, y_min=-22.0, y_max=22.8)


def test_block_of_counts_stoppage_time() -> None:
    assert block_of(46 * MINUTE, 1) == Period(kind="block", from_min=30, to_min=45)
    assert block_of(92 * MINUTE, 2) == Period(kind="block", from_min=75, to_min=90)
    assert block_of(45 * MINUTE, 2) == Period(kind="block", from_min=45, to_min=60)


def test_rolling_period() -> None:
    assert rolling_period(10 * MINUTE, 1) == Period(kind="rolling", from_min=5, to_min=10)
    assert rolling_period(2 * MINUTE, 1) == Period(kind="rolling", from_min=0, to_min=2)
    assert rolling_period(47 * MINUTE, 2) == Period(kind="rolling", from_min=45, to_min=47)


def sample(possessed: bool, d: float, direction: Literal[1, -1]) -> TeamSample:
    block = Block(x_min=-20 + d, x_max=10 + d, y_min=-20, y_max=20 + d)
    return TeamSample(
        possessed=possessed,
        line_height=30 + d,
        line_x=-20 + d,
        shape=Shape(width=40 + d, depth=30 + d, compactness=(40 + d) * (30 + d), block=block),
        attack_direction=direction,
    )


def test_aggregate() -> None:
    period = Period(kind="block", from_min=0, to_min=15)
    samples: list[dict[Team, TeamSample]] = [
        {"home": sample(d < 3, d, 1), "away": sample(False, d, -1)} for d in (0.0, 1.0, 2.0, 3.0)
    ]
    metrics = aggregate(samples, period, 1, 15 * MINUTE)
    home, away = metrics.teams.home, metrics.teams.away
    assert (metrics.period, metrics.half, metrics.clock_ms) == (period, 1, 15 * MINUTE)
    assert (home.possession, away.possession) == (75.0, 0.0)
    assert (home.line_height, home.line_x, home.width, home.depth, home.compactness) == (
        pytest.approx((31.5, -18.5, 41.5, 31.5, 1308.5))
    )
    assert (home.block.x_min, home.block.x_max, home.block.y_min, home.block.y_max) == (
        pytest.approx((-18.5, 11.5, -20.0, 21.5))
    )
    assert (home.attack_direction, away.attack_direction) == (1, -1)
