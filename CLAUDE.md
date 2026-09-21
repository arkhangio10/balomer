# Balomer

One fixed camera above an amateur football pitch becomes live tactical analysis
on a Fire TV: live 2D radar, live stats, alerts at 15'/30'/60'/75', a halftime
report with three evidence-based recommendations, and a full-time report.

Entry for the Amazon "Build, Ship, Shape" Developer Hackathon: Fire TV track,
plus the AWS Builder and Open Source mini challenges. Deadline 2026-10-23
12:00 PT; we submit 2026-10-22.

Pipeline: camera → edge worker (YOLO, tracking, team colours, homography,
deterministic metrics) → AWS (IoT Core, DynamoDB, Strands agent on AgentCore
with Bedrock + Knowledge Base + Guardrails, API Gateway WebSocket) → Fire TV app
on Vega OS. **Only coordinates and metrics leave the edge. Video stays local.**

## Repo map

| Path | What lives there |
|------|------------------|
| `apps/tv/` | Fire TV app, Vega OS. Generated later with Vega Developer Tools. |
| `apps/capture/` | Host-side camera capture. |
| `services/vision/` | Edge worker: detection, tracking, homography, metrics. |
| `services/api/` | FastAPI service behind the WebSocket API. |
| `services/agent/` | Strands agent on AgentCore. |
| `packages/contracts/` | JSON Schema. Single source of truth for boundary types. |
| `infra/` | AWS CDK app in Python. |
| `specs/` | One directory per feature: requirements, design, tasks. |
| `docs/` | Objectives, architecture, security, hackathon logs, demo script. |

Longer version: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Methodology

Spec-driven: **requirements → design → tasks → code**. Walking skeleton first —
get one thin slice running end to end before deepening any part of it.

One task per session. `/spec <feature>` writes the spec; `/task <feature>` takes
the next unchecked task in `specs/<feature>/tasks.md`, tests first; `/review`
reviews the diff; `/friction` logs an Amazon tool that got in the way.

Tests first for anything deterministic. The metrics are the product: they get
unit tests against fixtures, not a manual look at the screen.

## Commands

| Command | What it does |
|---------|--------------|
| `make setup` | `uv sync` and install the git hooks |
| `make lint` | `ruff check` and `ruff format --check` |
| `make format` | `ruff check --fix` and `ruff format` |
| `make typecheck` | `mypy` in strict mode |
| `make test` | `pytest` with coverage |
| `make check` | lint, typecheck and test — the gate before every commit |
| `make hooks` | `pre-commit run --all-files` |

Python 3.12, uv workspace. Tool versions are pinned in `pyproject.toml`.

## Coding standards

- Type hints everywhere. `mypy --strict` passes. An `Any` needs a comment saying why.
- Pydantic for data models. Types that cross a process boundary are **generated**
  from the JSON Schemas in `packages/contracts/`, never hand-written.
- `logging`, never `print`.
- Metrics are small pure functions over coordinates: no I/O, no globals, no
  clock. That is what makes them testable and what keeps the reports honest.
- Deterministic on the edge, generative in the cloud. The agent reads numbers and
  writes prose; it never produces a number.
- Delete the code you replace. No commented-out blocks.

## Security

- Video never leaves the edge. Coordinates and metrics only.
- Secrets live in `.env`, which is git-ignored and denied to Claude Code.
  `.env.example` documents the names and holds no values.
- `gitleaks` runs pre-commit and in CI. Large files are capped at 1024 KB.
- AWS: named profile locally, OIDC in CI. Never a long-lived key in the repo.

Full rules: [docs/SECURITY.md](docs/SECURITY.md).

## Git

- Trunk-based on `main`. Short-lived branches, small PRs, squash merge.
- Conventional Commits, enforced on `commit-msg` by `commitizen`.
- No AI co-authorship or AI mention in commit messages or PR descriptions.
- Never push, force push or rewrite history without asking.

## Definition of Done

A change is done when all of these hold:

1. It traces to a task in `specs/<feature>/tasks.md`, and that task's acceptance
   criteria are met.
2. The test was written first and fails without the change.
3. `make check` passes, with the output shown.
4. Type hints everywhere; no unjustified `Any`.
5. No new dependency, or the PR states why it is needed.
6. No secret, video, dataset or model weight in the diff.
7. Docs updated if behaviour or setup changed.
8. The checkbox in `tasks.md` is ticked.

## Never

- Never read, print or edit `.env` files or AWS credentials.
- Never hardcode secrets, or commit video, datasets or model weights.
- Never write feature code without a spec in `specs/`.
- Never add a dependency without stating why.
- Never invent Vega, Fire TV or AWS APIs. If you are not sure an API exists, say
  so and give me the doc link to check.
- Never push, force push or rewrite git history without asking.
- When an Amazon tool causes friction, remind me to run `/friction` — that log is
  part of the hackathon submission and it is worthless if written from memory.
