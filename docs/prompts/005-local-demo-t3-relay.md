# 005 · Relay messages from the edge to the TV (T3)

## Context
- As of 2026-10-21, 15:30 on the laptop clock (UTC-5): we submit 2026-10-22, and the hard deadline is 2026-10-23 12:00 PT (14:00 on the laptop clock).
- Read the project memory notes `local-first-plan` and `vega-vvd-on-wsl` first.
- Done in session 004:
  - **T2 merged:** PR #11 (`7ddeff6`). It added:
    - `apps/tv/`: the unmodified `helloWorld` output (`--name balomertv --packageId com.balomer.tv`, RN 0.83), plus `package-lock.json` and the Jest snapshot;
    - a CI `tv` job: `npm ci`, `npm test -- --ci`, `npx tsc --noEmit`, `npm run lint`;
    - `!apps/tv/src/data/` in the root `.gitignore`, because the `data/` rule hid the template's `src/data/`. Any other directory named `data` is still ignored, so check `git check-ignore -v` when you add one;
    - a pre-commit exclusion for three generator files (`.eslintrc`, `.gitignore`, `metro.config.js`), so the whitespace hooks leave them byte-identical.
  - **Branch protection:** `main` now requires both `check` and `tv`.
  - **`json-schema-to-typescript`:** the user decided it stays on `npx`. The line in `specs/local-demo/design.md` (Dependencies) that says "Until T2 adds `apps/tv/package.json`, `make contracts` runs it with `npx`" is now stale. Fix that line in the T3 PR.
  - **Local `main` is behind.** In session 004 the permission classifier denied `git pull --ff-only` after the merge. Start with `git switch main` and `git pull --ff-only`; if it is denied again, ask the user to run it.
- **Next unchecked task:** T3 in `specs/local-demo/tasks.md`. It covers AC-5.
  - **Test:** `services/api/tests/test_relay.py::test_late_client_gets_latest_state`. A client that connects after two `frame`s, two `rolling` `metrics`, a `block` snapshot and two `alert`s receives the latest frame and rolling metrics, the snapshot and both alerts first, then live messages in order. An invalid message is rejected.
  - **Done when:** `uvicorn balomer_api.app:app` serves `/ws/edge` and `/ws/tv`.
  - **Design:**
    - the code goes in `services/api/src/balomer_api/app.py`: a FastAPI WebSocket relay with a latest-state cache;
    - the API listens on port 8080;
    - the VVD reaches `ws://127.0.0.1:8080/ws/tv` through `vega device start-port-forwarding --port 8080 --forward false`;
    - the halftime trigger belongs to T11, not T3.
  - **Validation:** validate every edge message with the generated `balomer_contracts.models.Message`. Never hand-write a boundary type.
  - **Dependencies:** `fastapi` and `uvicorn` (api), and `httpx` (dev, for `TestClient`). Pin exact versions, like the ones in `pyproject.toml`, and state each one in the PR. Read each version from `uv add` output or PyPI; do not guess.
- **Two gaps in the spec. Ask the user before you write the test:**
  - **Rejection:** neither the design nor AC-5 says what rejecting an invalid message means: an error reply, closing the edge socket (and with which code), or dropping the message and logging it.
  - **Late `session`:** AC-5 lists the latest frame, rolling metrics, report, snapshots and alerts. It does not mention `session`, yet a late TV needs the pitch size from it to draw anything. The same question applies to the latest `phase`.
- **Environment that already works:**
  - **WSL2 `Ubuntu`:**
    - Vega CLI and SDK live in `~/vega`; the CLI binary is `~/vega/bin/vega`.
    - The Virtual Device only survives inside a long-lived session.
    - AWS CLI and `uv` are in `~/.local/bin`.
    - Inside WSL, `uv` uses `UV_PROJECT_ENVIRONMENT=$HOME/.venvs/balomer`.
    - `npm` on `/mnt/c` is slow and has no file watching. For TV checks, copy `apps/tv` into a WSL directory first.
  - **Windows:**
    - `make`, `uv` 0.12.17, `pre-commit`, Node 22.19 and `hf`, which is installed on Windows only, not in WSL.
    - `make check` passes.
  - **Running commands in WSL:** `wsl.exe` re-expands `$VARS`. Write a script, strip CR with `tr -d '\r'`, then run it from PowerShell with `wsl.exe -d Ubuntu -- bash /mnt/c/...`. From Git Bash, `/mnt/c/...` paths get rewritten to `C:/Program Files/Git/mnt/c/...`.
- **GitHub setup:**
  - **Repo:** `arkhangio10/balomer`, public.
  - **Branch protection:** `main` requires `check` and `tv`, and allows squash merges only.
  - **`gh` account:** run `gh auth switch --user arkhangio10` before any `gh` command, and switch back to `AbelMancillaAlicorp` at the end.
  - **Push:** use this per-command override:
    `GIT_CONFIG_COUNT=2 GIT_CONFIG_KEY_0=credential.helper GIT_CONFIG_VALUE_0= GIT_CONFIG_KEY_1=credential.helper GIT_CONFIG_VALUE_1='!gh auth git-credential' git push ...`
  - **CI gotcha:** the gitleaks step leaves an untracked `results.sarif` in the workspace. Any CI check on `git status` must be scoped to its own paths.
- **Waiting on the user.** Check each of these; do not assume it is done:
  - **SoccerTrack v2 access:** on 2026-10-21 at 15:00, `hf download atomscott/soccertrack-v2 ball/117092_1st_ball.npz --repo-type dataset --local-dir <scratch>` (Windows `hf`, account `Arkhangio`) still answered "Access denied. This repository requires approval."
  - **`aws login --profile balomer --remote`** in WSL: on 2026-10-21 at 15:00, `aws configure list-profiles` listed only `default`, and `aws sts get-caller-identity --profile balomer` answered "The config profile (balomer) could not be found."
  - **The AWS credits form.** The user must do this one.
  - **Friction log:** `docs/FRICTION_LOG.md` still has only the example entry. Remind the user to run `/friction` for:
    - the Vega-on-WSL issues in memory note `vega-vvd-on-wsl`, such as the missing `libtinfo5` and the VVD exiting 0 on failure;
    - the `helloWorld` template's `metro.config.js`, which ships with stray `+` diff markers in its header comment and trailing whitespace.
  - **Two design choices left unchanged in the spec:**
    - the stat-row pulse: three pulses at scale 1.12, where the research suggests one pulse at 1.04;
    - the halftime card stagger: 120 ms, where the research suggests 50–80 ms.

    Ask the user before changing either.

## Tasks

### 1. Check the pending items
Sync `main`, run both checks above and report the result.

### 2. Run `/task local-demo`
It takes T3. Tests first: `test_late_client_gets_latest_state` must fail before `balomer_api.app` exists, with a `ModuleNotFoundError` or a missing route, not with a broken import of the test's own helpers.

Ask about both spec gaps above before writing the test.

### 3. Open the PR
Commit, open a PR, wait for CI (`check` and `tv`) to go green and squash merge it. Include this prompt file in the PR.

One task per session: stop after the T3 PR is merged and write `docs/prompts/006-...md` for T4.

## Rules
- Follow `CLAUDE.md`:
  - spec before code and tests first;
  - Conventional Commits;
  - no AI co-authorship or AI mention in commits or PRs;
  - every change goes through a PR;
  - never push to `main` directly;
  - never rewrite history.
- Ask before anything that needs sudo, creates external resources or changes GitHub settings.
- Never invent Vega, Fire TV or AWS APIs. Cite the documentation page, or the `vega ... --help` output.
- When an Amazon tool causes friction, remind the user to run `/friction`.
- No dataset, video or model weights in any diff. `data/` is git-ignored.

## Done when
- [ ] The pending items are checked and reported
- [ ] The T3 PR is merged with CI green, or the blocker is reported
- [ ] `docs/prompts/006-...md` is written
- [ ] `gh` is switched back to `AbelMancillaAlicorp`

## Report format
One table with three columns: task, result, evidence (a command output line or a URL). Then a list of anything the user must do by hand, including the pending items from Context.
