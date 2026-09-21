# Balomer

Turn one fixed camera above an amateur football pitch into live tactical
analysis on a Fire TV.

## Hackathon

Amazon "Build, Ship, Shape" Developer Hackathon.

- **Fire TV** track
- **AWS Builder** mini challenge
- **Open Source** mini challenge

## What it does

- **Live 2D radar** — players and ball as dots on a pitch, teams separated by colour
- **Live stats** — possession, territory and pressure, updating during play
- **Minute alerts** — at 15', 30', 60' and 75'
- **Halftime report** — three recommendations, each grounded in a measured number
- **Full-time report** — the match, summarised

## Architecture

```
camera → edge worker → AWS → Fire TV app
```

The edge worker (`services/vision`) runs on a laptop beside the pitch: YOLO
detection, tracking, team colour assignment, homography to pitch coordinates,
and deterministic metrics computed as small pure functions.

AWS carries the rest: IoT Core for ingest, DynamoDB for match state, a Strands
agent on AgentCore backed by Bedrock with a Knowledge Base and Guardrails, and
an API Gateway WebSocket pushing to the client.

The Fire TV app (`apps/tv`) is a React Native client on Vega OS. It draws what
arrives; it holds no analysis logic.

**Only coordinates and metrics leave the edge. Video stays on the local machine
by default.** See [docs/SECURITY.md](docs/SECURITY.md).

Detail: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Setup and run

> Placeholder. This section gets real, reproducible steps — camera, edge worker,
> AWS deployment and Fire TV install — as the walking skeleton lands.

Prerequisites: Python 3.12, [uv](https://docs.astral.sh/uv/), `make`, git.

```sh
git clone <repo-url>
cd balomer
cp .env.example .env    # fill in your own values
make setup              # sync the workspace and install git hooks
make check              # lint, type check, tests
```

Deploying the AWS side and building the Fire TV app are not wired up yet.

## Repository

| Path | What lives there |
|------|------------------|
| `apps/tv/` | Fire TV app, Vega OS. Generated later with Vega Developer Tools. |
| `apps/capture/` | Host-side camera capture. |
| `services/vision/` | Edge worker: detection, tracking, homography, metrics. |
| `services/api/` | FastAPI service behind the WebSocket API. |
| `services/agent/` | Strands agent on AgentCore. |
| `packages/contracts/` | JSON Schema contracts. Source of truth for boundary types. |
| `infra/` | AWS CDK app in Python. |
| `specs/` | One directory per feature: requirements, design, tasks. |
| `docs/` | Objectives, architecture, security, hackathon logs, demo script. |

## Development

Spec-driven: requirements → design → tasks → code. One task per pull request,
tests first for anything deterministic, Conventional Commits, squash merge onto
`main`. See [CLAUDE.md](CLAUDE.md).

## License

[Apache-2.0](LICENSE). See [NOTICE](NOTICE).
