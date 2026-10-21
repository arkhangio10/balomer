# Local demo — Requirements

## Context

On 2026-10-20 the submission plan pivoted: everything runs on one laptop and
nothing is deployed to AWS except the Bedrock model call. Movement data comes
from SoccerTrack v2 (CC BY 4.0), the fallback the objectives planned for
2026-10-11 when own footage is not available. One match is used: id `117092`
(paper label M1), 11 v 11 on a 105 m x 68 m pitch, two 45-minute halves,
annotated at 25 fps.

## User story

As an **amateur coach watching a Fire TV in the dressing room**, I want **a
recorded match to play through the pipeline as if it were live — radar, stats,
minute alerts and a halftime report**, so that **I see what Balomer would tell
me at halftime, and a judge can reproduce it from the README without an AWS
deployment**.

## Acceptance criteria (EARS)

Every criterion is testable and links to at least one objective ID from
[docs/OBJECTIVES.md](../../docs/OBJECTIVES.md), such as `P3` or `S1` (pattern
`^(H|P|V|E|S|B|D)\d+$`). A criterion with no objective does not belong in this
spec.

| ID | Criterion | Objectives |
|----|-----------|------------|
| AC-1 | Every WebSocket message (edge → API, API → TV) and the agent's input and output shall validate against a JSON Schema in `packages/contracts/`, and the Python and TypeScript types for them shall be generated from those schemas. | E1, P7 |
| AC-2 | When the ingest command runs on one SoccerTrack v2 half (GSR JSON and ball `.npz`), the vision service shall write a replay file with one frame every 200 ms holding every player and goalkeeper (team `home` or `away`, an id stable across both halves) and the ball, in metres with the origin at the centre spot, without loading the whole JSON into memory. | P8 |
| AC-3 | If a player is missing from the annotations for 2 s or less, then the replay shall keep their last position; if missing for longer, the replay shall omit them until they reappear. | P8 |
| AC-4 | When the replayer runs with a replay file, a start minute and a speed factor, it shall first publish the metric snapshots and alerts for the part of the half before the start minute without publishing those frames, then publish frames in order, one every 200 ms of wall time, skipping frames so the match clock advances at the speed factor, each stamped with the half and the match clock, and finally publish an end-of-half `phase` message. | P8 |
| AC-5 | While a TV client is connected, the API shall forward every edge message to it, and when a client connects it shall first send the latest frame, rolling metrics and report, and every snapshot and alert so far, so a late client shows the same state and alert history. | P2 |
| AC-6 | While frames arrive, the TV app shall draw the pitch to scale inside the TV safe area (96 px left and right, 54 px top and bottom) and move every player and the ball continuously between frames, Home as filled dots and Away as rings in their team colours, with no more than 2 s from a frame being published to it being drawn. | P2 |
| AC-7 | The vision service shall compute possession (per frame and as a percentage), defensive line height, team width, team depth and compactness as pure functions over coordinates, and publish them for three kinds of period: a rolling 5-minute window at least every 5 s, each 15-minute block, and each half. The TV app shall show the rolling values with animated transitions and draw each team's defensive line and block on the pitch. | P3, E3 |
| AC-8 | When the match clock reaches 15', 30', 60' or 75', the vision service shall publish exactly one alert whose text comes from a template and which references at least one metric by team and period, and the TV app shall slide in a banner in 300 ms showing the referenced values, highlight the matching metrics on screen, keep the banner for `max(5 s, 0.33 s × words + 2 s)`, slide it out in 200–250 ms, and keep the alert in an on-screen alert history. | P4, P7 |
| AC-9 | When the API receives the end-of-first-half `phase` message, it shall request a halftime report from the agent with the first-half snapshots, and the TV app shall show it within 60 s: exactly three recommendations, each a problem and one adjustment that reference at least one metric by team and period from the input. | P5, P7, H2 |
| AC-10 | If the agent's output references a metric, team or period that is not in its input, or contains a digit in its text, then the API shall ask once more and, if it fails again, show a "report unavailable" state instead of an unvalidated report. | P7 |
| AC-11 | The TV app shall be usable with the D-pad alone: focus moves between report cards, Back dismisses a visible alert banner and otherwise returns from a report to the live radar, and every focused element shows a ring and a scale change, never colour alone. | P10 |
| AC-12 | Where the README is followed on Linux with the Vega SDK installed and the dataset downloaded, the API, the replayer and the TV app on the Vega Virtual Device shall start with the documented commands within 15 minutes, and the README shall credit SoccerTrack v2 under CC BY 4.0. | E6, D1 |
| AC-13 | Where time allows the full-time report, when the second half ends the API shall request it with the same validation as AC-9 and AC-10, with a match story, key metrics and a training focus. | P6 |

## Out of scope

- Any AWS deployment: IoT Core, DynamoDB, API Gateway, AgentCore, CDK. E5, S2,
  S3 and S5 are not advanced by this spec.
- Computer vision on video (P1, V1–V4). The tracks come from annotations.
- Bedrock Guardrails (S7): it needs an AWS resource and a CDK stack.
- AgentCore: the agent runs inside the API process, so H2 is only partly
  advanced (Bedrock + Strands).
- Presenting a fixture report as if the agent wrote it. If Bedrock is not
  ready, the demo shows the "report unavailable" state or cuts the scene.
- Score, goals, player names or any personal data. SoccerTrack v2 is
  pseudonymised and the app shows teams only as "Home" and "Away".
- Choosing a match or a half from the TV. The replayer is started from the
  command line.
- A local-model fallback for the agent.
- Pro mode (P9).
- EA, FIFA, league, broadcaster or data-provider names, product names such as
  "Match Facts", "Momentum", "PlayStyles" or "HyperMotion", and screenshots or
  clips of FC 27 or of broadcasts, anywhere in the app, the README or the
  video. Labels are Balomer's own; see [design.md](design.md).
- Future work, not in this spec: a "territory per minute" timeline, and
  free-kick geometry (the 9.15 m circle, distance and angle to goal, wall
  distance), which needs set-piece detection first. Source:
  [docs/research/fc27-visual-patterns.md](../../docs/research/fc27-visual-patterns.md).

## Open questions

None blocking. Unknowns that only a run can settle (WebSocket permission on
Vega, animation smoothness, parse time) are listed as risks in
[design.md](design.md).
