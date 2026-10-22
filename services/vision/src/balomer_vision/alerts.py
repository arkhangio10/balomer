from typing import Literal, get_args

from balomer_contracts.models import Alert, Evidence, Metrics, TeamMetrics

from balomer_vision.metrics import Team

Metric = Literal["possession", "line_height", "width", "depth", "compactness"]

METRICS: tuple[Metric, ...] = get_args(Metric)
TEAMS: tuple[Team, ...] = ("home", "away")
LABELS: dict[Team, str] = {"home": "Home", "away": "Away"}

TEMPLATES: dict[str, str] = {
    "possession_up": "{team} held a larger share of possession than in the previous quarter-hour.",
    "possession_down": (
        "{team} held a smaller share of possession than in the previous quarter-hour."
    ),
    "line_height_up": (
        "{team} pushed their defensive line higher up the pitch than in the previous quarter-hour."
    ),
    "line_height_down": (
        "{team} dropped their defensive line deeper towards their own goal"
        " than in the previous quarter-hour."
    ),
    "width_up": "{team} played wider across the pitch than they did in the previous quarter-hour.",
    "width_down": (
        "{team} played narrower across the pitch than they did in the previous quarter-hour."
    ),
    "depth_up": (
        "{team} stretched longer from back to front than they did in the previous quarter-hour."
    ),
    "depth_down": (
        "{team} became shorter from back to front than they were in the previous quarter-hour."
    ),
    "compactness_up": (
        "{team} became less compact, covering a larger area than in the previous quarter-hour."
    ),
    "compactness_down": (
        "{team} became more compact, covering a smaller area than in the previous quarter-hour."
    ),
    "possession_lead": (
        "{team} had more possession than {other} during this quarter-hour of the match."
    ),
    "line_height_lead": (
        "{team} defended with a higher line than {other} during this quarter-hour of the match."
    ),
    "width_lead": (
        "{team} spread wider across the pitch than {other} during this quarter-hour of the match."
    ),
    "depth_lead": (
        "{team} stretched longer from back to front than {other} during this quarter-hour."
    ),
    "compactness_lead": (
        "{team} was less compact than {other}, covering a larger area during this quarter-hour."
    ),
}


def _value(metrics: Metrics, team: Team, metric: Metric) -> float:
    side: TeamMetrics = getattr(metrics.teams, team)
    return float(getattr(side, metric))


def minute_alert(
    minute: Literal[15, 30, 60, 75], current: Metrics, previous: Metrics | None
) -> Alert:
    best = -1.0
    team: Team = "home"
    metric: Metric = "possession"
    if previous is not None:
        for m in METRICS:
            for t in TEAMS:
                before = _value(previous, t, m)
                change = abs(_value(current, t, m) - before) / before if before > 0 else -1.0
                if change > best:
                    best, team, metric = change, t, m
        rose = _value(current, team, metric) > _value(previous, team, metric)
        template_id = f"{metric}_{'up' if rose else 'down'}"
        other: Team = "away" if team == "home" else "home"
        evidence = [
            Evidence(metric=metric, team=team, period=previous.period),
            Evidence(metric=metric, team=team, period=current.period),
        ]
    else:
        for m in METRICS:
            home, away = _value(current, "home", m), _value(current, "away", m)
            gap = abs(home - away) / max(home, away) if max(home, away) > 0 else -1.0
            if gap > best:
                best, metric = gap, m
                team = "home" if home >= away else "away"
        other = "away" if team == "home" else "home"
        template_id = f"{metric}_lead"
        evidence = [
            Evidence(metric=metric, team=team, period=current.period),
            Evidence(metric=metric, team=other, period=current.period),
        ]
    text = TEMPLATES[template_id].format(team=LABELS[team], other=LABELS[other])
    return Alert(type="alert", minute=minute, template_id=template_id, text=text, evidence=evidence)
