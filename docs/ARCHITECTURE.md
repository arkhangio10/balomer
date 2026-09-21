# Architecture

Balomer turns one fixed camera above an amateur football pitch into live
tactical analysis on a Fire TV: a live 2D radar, live stats, alerts at 15', 30',
60' and 75', a halftime report with three evidence-based recommendations, and a
full-time report.

## Pipeline

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
machine by default. See [SECURITY.md](SECURITY.md).

## Repository map

| Path | What lives there |
|------|------------------|
| `apps/tv/` | Fire TV app on Vega OS. Generated later with Vega Developer Tools. |
| `apps/capture/` | Host-side camera capture. |
| `services/vision/` | Edge worker: detection, tracking, homography, metrics. |
| `services/api/` | FastAPI service behind the WebSocket API. |
| `services/agent/` | Strands agent on AgentCore. |
| `packages/contracts/` | JSON Schema contracts. Source of truth for all boundary types. |
| `infra/` | AWS CDK app in Python. |
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
