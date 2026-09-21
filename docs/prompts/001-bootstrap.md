# Prompt 001: Bootstrap the Balomer repository

Save this prompt verbatim as docs/prompts/001-bootstrap.md before anything else.

## Context
You are working on Balomer, my entry for the "Build, Ship, Shape" Amazon
Developer Hackathon (Devpost): Fire TV track, plus the AWS Builder and Open
Source mini challenges. Hard deadline: Oct 23, 2026, 12:00 pm PT.
Target submission: Oct 22.

Balomer turns one fixed camera above an amateur football pitch into live
tactical analysis on a Fire TV: live 2D radar, live stats, alerts at
15'/30'/60'/75', a halftime report with 3 evidence-based recommendations,
and a full-time report.

Pipeline: camera → edge worker (YOLO detection, tracking, team colors,
homography, deterministic metrics) → AWS (IoT Core, DynamoDB, Strands agent
on AgentCore with Bedrock + Knowledge Base + Guardrails, API Gateway
WebSocket) → Fire TV app on Vega OS (React Native). Only coordinates and
metrics leave the edge. Video stays local by default.

Methodology: spec-driven development (requirements → design → tasks),
walking skeleton first, one task per session, tests first for deterministic
code, trunk-based git with small squash-merged PRs and Conventional Commits.

## Scope of THIS task
Bootstrap the repository only. Do NOT write feature code, data contracts or
AWS resources. Do NOT create the Vega app: apps/tv is generated later with
the official Vega tools.

Plan first: show me the full file tree and key decisions, wait for my
approval, then execute.

## Deliverables

### 1. Structure
balomer/
├── apps/
│   ├── tv/              README only: "Generated later with Vega Developer Tools"
│   └── capture/         README only
├── services/
│   ├── api/             FastAPI service, package skeleton only
│   ├── vision/          edge worker, package skeleton only
│   └── agent/           Strands agent, package skeleton only
├── packages/
│   └── contracts/       README: JSON Schema is the single source of truth;
│                        Python and TypeScript types are generated from it
├── infra/               AWS CDK app in Python, skeleton only, no stacks
├── specs/_template/     requirements.md, design.md, tasks.md
├── docs/
│   ├── prompts/
│   ├── OBJECTIVES.md    placeholder, I will paste the content
│   ├── ARCHITECTURE.md  pipeline above + repo map
│   ├── SECURITY.md
│   ├── FRICTION_LOG.md
│   ├── FEATURE_REQUESTS.md
│   ├── PRODUCT_FEEDBACK.md
│   └── DEMO_SCRIPT.md
├── .claude/
│   ├── settings.json
│   └── commands/        spec.md, task.md, review.md, friction.md
├── .github/
│   ├── workflows/ci.yml
│   ├── dependabot.yml
│   └── pull_request_template.md
├── CLAUDE.md
├── README.md
├── LICENSE              Apache-2.0, full text
├── NOTICE               "Copyright 2026 [COPYRIGHT HOLDER]"
├── Makefile
├── pyproject.toml       uv workspace root
├── .pre-commit-config.yaml
├── .editorconfig
├── .gitignore
└── .env.example

### 2. Python
- Python 3.12, uv workspace with members services/* and infra.
- Each service: pyproject.toml, src/ layout, py.typed, tests/ with one
  smoke test.
- Tooling: ruff (lint + format), mypy strict, pytest with pytest-cov.
- Pin tool versions. No runtime dependencies beyond what a skeleton needs.

### 3. CLAUDE.md (under 150 lines, it loads every session)
Sections: project summary, repo map, methodology and workflow, commands
(Makefile targets), coding standards (type hints everywhere, Pydantic for
data models, logging not print, small pure functions for metrics), security
rules, git rules, Definition of Done, and a "Never" list:
- Never read, print or edit .env files or AWS credentials.
- Never hardcode secrets or commit video, datasets or model weights.
- Never write feature code without a spec in specs/.
- Never add a dependency without stating why.
- Never invent Vega, Fire TV or AWS APIs. If unsure, say so and give me
  the doc link to check.
- Never push, force push or rewrite git history without asking.
- When an Amazon tool causes friction, remind me to run /friction.

### 4. .claude/settings.json
Include the official $schema reference and use the current Claude Code
permission rule syntax.
- deny: reading .env and .env.* (except .env.example), anything under
  secrets/, ~/.aws; git push --force; rm -rf.
- ask: git push, git reset, gh, aws, cdk deploy, any package install.
- allow: git status/diff/log/add/commit, make, uv run for pytest/ruff/mypy,
  pre-commit run.

### 5. Slash commands
- /spec <feature>: create specs/<feature>/ from the template. Acceptance
  criteria in EARS format, each linked to an objective ID from
  docs/OBJECTIVES.md. Ask me clarifying questions before writing.
- /task <feature>: take the next unchecked task in
  specs/<feature>/tasks.md. Write tests first, implement, run make check,
  show the diff, propose a Conventional Commit message. One task only.
- /review: review the current diff against the Definition of Done,
  SECURITY.md and the spec. Report findings as HIGH / MED / LOW.
- /friction: append an entry to docs/FRICTION_LOG.md with: date, tool, task
  attempted, steps taken, expected vs actual result, severity, workaround,
  actionable suggestion.

### 6. Templates
- specs/_template: requirements (user story, EARS acceptance criteria,
  objective IDs, out of scope), design (components, data contracts,
  sequence, risks), tasks (checkbox list, one task = one PR, each with its
  test).
- FRICTION_LOG.md and FEATURE_REQUESTS.md (description, why it matters,
  priority: Critical / Important / Nice-to-have), each with one example
  entry marked as an example.
- PRODUCT_FEEDBACK.md: one section per tool with the 5 hackathon questions:
  what we used it for, what worked well, what needs work, onboarding from
  zero to hello world, would we build with it again and why.

### 7. Quality and security gates
- .pre-commit-config.yaml: gitleaks, ruff, ruff-format,
  check-added-large-files (max 1024 KB), end-of-file-fixer,
  trailing-whitespace, check-yaml, Conventional Commit check on commit-msg.
- ci.yml on push and PR to main: gitleaks, uv sync, ruff, mypy, pytest with
  coverage. Workflow permissions: contents: read. Use action major version
  tags; pin to commit SHAs only if you can verify them, otherwise add a TODO
  in SECURITY.md.
- dependabot.yml: GitHub Actions and Python dependencies, weekly.
- .gitignore: .env*, !.env.example, mp4/mov/avi/mkv, data/, pt/onnx/engine
  weights, cdk.out/, node_modules/, .venv/, caches,
  .claude/settings.local.json, CLAUDE.local.md.
- Makefile targets: setup, lint, format, typecheck, test, check (all),
  hooks.

### 8. README.md
Title, one-line mission, hackathon tracks, architecture summary, a "Setup
and run" section (placeholder, required by the hackathon rules), repo map,
license. No badges that do not work yet.

## Finish
1. Run make setup, make check and pre-commit run --all-files. All must pass.
2. Create one local commit on main: "chore: bootstrap repository
   structure". Do not push.
3. Summarize: files created, commands that passed, anything you were
   unsure about.
