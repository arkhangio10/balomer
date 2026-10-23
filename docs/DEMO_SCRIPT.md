# Demo script

Target: 2:50 at most (objective D1), recorded on the Vega Virtual Device.
Nothing is narrated that is not on screen.

The match is SoccerTrack v2 match 117092, replayed as live. Its credit,
`Data: SoccerTrack v2 (CC BY 4.0)`, stays visible on the clock bar in every TV
shot.

## 0:00 — The problem (15 s)

An amateur coach has no analyst. Halftime decisions are made from memory. Text
on a dark card; no third-party footage.

## 0:15 — What runs (20 s)

The laptop terminal: the API, then the replayer starting the first half. Say
what the data is: a university 11-a-side match from SoccerTrack v2, as
annotated tracks with no video, replayed as if it were live. The product
targets one camera over an amateur pitch; this demo feeds the same pipeline
from annotations.

## 0:35 — Live radar (35 s)

TV: 22 dots and the ball moving over the pitch, Home as filled orange dots and
Away as sky-blue rings. Say that SoccerTrack v2 reconstructs the ball track
between events, so the ball moves in straight lines.

## 1:10 — Live stats (35 s)

The stats panel: the possession bar, then line height, width, depth and
compactness with ▲ or ▼ against the previous value. Point at the defensive
lines and team blocks moving on the pitch. Say that every number comes from
small pure functions on the laptop.

## 1:45 — A minute alert (35 s)

Replay with `--start 29:30`. The 30' banner slides in. Read it, then point at
the stat rows that pulse and at the values in its evidence chips. Press Back:
the banner leaves and the alert stays in the history, under 15'.

## 2:20 — The halftime report (20 s)

Only if the agent on Bedrock generates the report (task T11): the three cards
stagger in, and the D-pad moves between them. Read the metric one card cites.
Say plainly that the edge computes every number and the agent writes prose
and may not write a number.

Otherwise cut this scene and give its 20 s to the stats and alert scenes. A
test fixture is never shown as a generated report.

## 2:40 — The close (10 s)

No video was used, only coordinates and metrics. Name the stack in one
sentence: Python on the edge, a FastAPI WebSocket relay, React Native on
Vega OS, and Strands with Bedrock if the report scene stayed.

## Shot list

- [ ] Laptop terminal: the API and the replayer running
- [ ] TV: the radar live, with the credit visible on the clock bar
- [ ] TV: the stats panel and the overlays changing
- [ ] TV: the 30' alert firing, then Back
- [ ] TV: the alert history with 15' and 30'
- [ ] TV: the halftime report, all three cards legible (only with T11)
