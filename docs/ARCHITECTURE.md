# Architecture

Balomer turns one fixed camera above an amateur football pitch into live
tactical analysis on a Fire TV: a live 2D radar, live stats, alerts at 15', 30',
60' and 75', a halftime report with three evidence-based recommendations, and a
full-time report.

## Local mode (this release)

Since 2026-10-20 everything runs on one laptop, inside WSL2 Ubuntu, and nothing
is deployed to AWS. A recorded SoccerTrack v2 match stands in for the camera.
The Vega Virtual Device reaches the API through reverse port forwarding.

```
ingest (once)   GSR JSON + ball .npz ──stream──▶ data/replay/117092_{1,2}.jsonl

replayer (services/vision) ──ws /ws/edge──▶ API (services/api, :8080) ──ws /ws/tv──▶ TV app on the VVD
                                                                                    (reverse port forward 8080)
```

- **Ingest** (`balomer_vision.soccertrack`): streams each half's annotations
  and writes one frame every 200 ms, in metres from the centre spot.
- **Replayer** (`balomer_vision.replay`): publishes the frames as live, one
  every 200 ms, with the metrics, block snapshots and minute alerts as play
  reaches them.
- **API** (`balomer_api.app`): relays every message to the TV, and sends a TV
  that connects late the latest frame and metrics plus every snapshot and alert
  so far.
- **TV app** (`apps/tv`): draws the radar, the stats panel, the alerts and the
  report screens.
- **Agent** (`services/agent`): the halftime report on Bedrock, through Strands,
  called inside the API process. Not wired in this release.

The spec is [specs/local-demo/](../specs/local-demo/); its
[design](../specs/local-demo/design.md) holds the contracts, metrics and
screens.

## Target pipeline (after the hackathon)

```
camera
  │
  ▼
edge worker  (services/vision, on the machine next to the pitch)
  │  YOLO detection → tracking → team colours → homography → deterministic metrics
  │
  │  coordinates and metrics only — video stays local
  ▼
AWS
  ├─ IoT Core            ingest from the edge
  ├─ DynamoDB            match state and metric history
  ├─ Strands agent       on AgentCore, with Bedrock + Knowledge Base + Guardrails
  └─ API Gateway (WS)    push to the client
  │
  ▼
Fire TV app  (apps/tv, Vega OS, React Native)
   live radar · live stats · minute alerts · halftime and full-time reports
```

## The split that matters

**Deterministic on the edge, generative in the cloud.** Every number the system
shows is computed by a small pure function in `services/vision`. The agent in
`services/agent` never produces a number: it reads metrics and writes prose and
recommendations grounded in them. That boundary is what makes the output
testable and what keeps the reports honest.

**Only coordinates and metrics leave the edge.** Video stays on the local
machine by default. The local demo uses no video at all. See
[SECURITY.md](SECURITY.md).

## Repository map

| Path | What lives there |
|------|------------------|
| `apps/tv/` | Fire TV app on Vega OS, generated with the Vega CLI. |
| `apps/capture/` | Host-side camera capture. Not used in local mode. |
| `services/vision/` | Edge worker: SoccerTrack v2 ingest, replayer, metrics and alerts. |
| `services/api/` | FastAPI WebSocket relay between the edge and the TV. |
| `services/agent/` | Strands agent for the reports. Not wired yet. |
| `packages/contracts/` | JSON Schema contracts. Source of truth for all boundary types. |
| `infra/` | AWS CDK app in Python. Not used in local mode. |
| `specs/` | One directory per feature: requirements, design, tasks. |
| `docs/` | Objectives, architecture, security, hackathon logs, demo script. |
| `.claude/` | Claude Code settings and slash commands. |

## Data contracts

JSON Schema in `packages/contracts/` is the single source of truth. Python and
TypeScript types are generated from it. A boundary without a schema is a bug.

## Not decided yet

These are open and must not be assumed by any spec until they are resolved here:

- Which YOLO model and at what input resolution the edge worker can hold frame rate.
- Homography calibration: manual pitch-corner picking versus line detection.
- Whether halftime report generation runs on AgentCore or as a scheduled invocation.
