# Security

## The rule that shapes the system

Video never leaves the edge. The camera stream and every decoded frame stay on
the local machine. What is published to AWS is coordinates and metrics: numbers
that describe positions and play, not images of people.

Anything that would change this needs an explicit decision recorded here first.

## Secrets

- Secrets live in `.env`, which is git-ignored and which Claude Code is denied
  read and edit access to in `.claude/settings.json`. `.env.example` documents
  the variable names and holds no values.
- Nothing under `secrets/` is readable by Claude Code, and nothing under
  `~/.aws` is either.
- `gitleaks` runs as a pre-commit hook and again in CI on every push and pull
  request. A commit that trips it does not land.
- AWS credentials are never inlined. Local work uses a named AWS profile; CI
  uses GitHub OIDC when it needs AWS at all, never long-lived keys.

## Never committed

Video (`*.mp4`, `*.mov`, `*.avi`, `*.mkv`), datasets (`data/`), and model
weights (`*.pt`, `*.onnx`, `*.engine`). `check-added-large-files` caps additions
at 1024 KB as a second line of defence.

## Supply chain

- All Python tool versions are pinned with `==`. `uv.lock` is committed and CI
  runs `uv sync --locked`, so CI fails if the lock drifts from `pyproject.toml`.
- pre-commit hook revisions are pinned to tags and reviewed by hand. Dependabot
  does not bump them.
- Dependabot watches GitHub Actions and the `uv` ecosystem weekly.
- Workflow permissions are `contents: read`. No workflow gets write scope
  without a note here explaining why.

### TODO: pin GitHub Actions to commit SHAs

`.github/workflows/ci.yml` pins actions to major version tags
(`actions/checkout@v7`, `gitleaks/gitleaks-action@v3`, `astral-sh/setup-uv@v10`).
A tag is mutable: whoever controls the action repository can move it.

These were not pinned to commit SHAs because the SHAs could not be verified from
a trusted source at bootstrap time. Before the repository is made public, resolve
each tag to its commit SHA, confirm the SHA against the upstream release page,
and replace the tag with `@<sha> # vX.Y.Z`.

### Note on `gitleaks-action`

`gitleaks/gitleaks-action` is distributed under a commercial end-user licence.
It is free for personal and public repositories; organisation accounts need a
`GITLEAKS_LICENSE`. If Balomer moves under an organisation, either buy the
licence or replace the CI step with the pinned gitleaks binary or the
`gitleaks-docker` pre-commit hook, which carry no such requirement.

## Reporting

This is a hackathon entry, not a production service. If you find something,
open an issue. Do not include a real secret in the report.
