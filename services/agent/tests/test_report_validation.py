import json
from pathlib import Path

from balomer_agent.report import MAX_TEXT, Draft, generate, validate
from balomer_contracts.models import Evidence, Metrics, Period, Recommendation, ReportUnavailable

EXAMPLES = Path(__file__).parents[3] / "packages" / "contracts" / "examples"


def snapshot(kind: str, from_min: int, to_min: int) -> Metrics:
    data = json.loads((EXAMPLES / "metrics.json").read_text(encoding="utf-8"))
    data["period"] = {"kind": kind, "from_min": from_min, "to_min": to_min}
    return Metrics.model_validate(data)


SNAPSHOTS = [snapshot("block", 0, 15), snapshot("block", 15, 30), snapshot("half", 0, 45)]
BLOCK_15_30 = Period(kind="block", from_min=15, to_min=30)


def rec(
    problem: str = "Away defended deep and gave Home time on the ball.",
    period: Period = BLOCK_15_30,
    adjustment: str = "Push the back line up together.",
) -> Recommendation:
    evidence = Evidence(metric="line_height", team="away", period=period)
    return Recommendation(problem=problem, adjustment=adjustment, evidence=[evidence])


GOOD = Draft(recommendations=[rec(), rec(), rec(period=Period(kind="half", from_min=0, to_min=45))])
WITH_DIGIT = Draft(recommendations=[rec(problem="Away lost the ball 3 times."), rec(), rec()])


def test_validator_rejects_unknown_evidence_and_digits() -> None:
    assert validate(GOOD, SNAPSHOTS) == []
    unknown = rec(period=Period(kind="block", from_min=30, to_min=45))
    long = rec(adjustment="x" * (MAX_TEXT + 1))
    for bad in (unknown, rec(problem="Away lost the ball 3 times."), long):
        assert len(validate(Draft(recommendations=[bad, rec(), rec()]), SNAPSHOTS)) == 1
    assert len(validate(Draft(recommendations=[rec(), rec()]), SNAPSHOTS)) == 1


def test_one_retry_then_unavailable() -> None:
    prompts: list[str] = []

    def stub(prompt: str) -> Draft:
        prompts.append(prompt)
        return WITH_DIGIT

    assert generate(SNAPSHOTS, stub) == ReportUnavailable(
        type="report", kind="halftime", status="unavailable"
    )
    assert len(prompts) == 2
    assert '"from_min":15.0' in prompts[0] and "digit" in prompts[1]

    answers = iter([WITH_DIGIT, GOOD])
    report = generate(SNAPSHOTS, lambda _: next(answers))
    assert report.status == "ok" and report.recommendations == GOOD.recommendations
