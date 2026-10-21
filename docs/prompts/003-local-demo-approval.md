# 003 · Approve the local-demo spec and start T1

## Context
- As of 2026-10-21: we plan to submit 2026-10-22, and the hard deadline is 2026-10-23 12:00 PT (14:00 on the laptop clock, UTC-5).
- On 2026-10-20 the plan pivoted to a fully local demo. The agent calls Bedrock from the laptop, and nothing else is deployed to AWS. Read the project memory notes `local-first-plan` and `vega-vvd-on-wsl` first.
- The spec is written but **not committed**. It lives on branch `spec/local-demo`: `specs/local-demo/requirements.md`, `design.md` and `tasks.md`.
- **The user approved the spec on 2026-10-21, provided the adjustments in task 1 are applied.** Do not ask for approval again.
- The design research behind the adjustments is untracked in the repo root:
  - the report: `reports/Gráficos y métricas de FC 27.md`
  - its notes: `research_notes/Gráficos y métricas de FC 27/`
- Environment that already works:
  - **WSL2 `Ubuntu`:**
    - Vega CLI 1.4.5 and SDK 0.24.12112 in `~/vega`.
    - The Virtual Device only survives inside a long-lived session: start it and run apps from the same session.
    - The device reaches WSL through `vega device start-port-forwarding --port <p> --forward false`.
    - AWS CLI 2.38.2 and `uv` 0.12.17 are in `~/.local/bin`.
  - **Windows:** `make` 4.4.1, `uv` 0.12.17 and `pre-commit`. `make check` passes.
  - **Running commands in WSL:** `wsl.exe` re-expands `$VARS`. Write a script, strip CR with `tr -d '\r'`, then run it in WSL.
- GitHub setup:
  - **Repo:** `arkhangio10/balomer`, public.
  - **Branch protection:** `main` requires the `check` job and allows squash merges only.
  - **`gh` account:** it is shared with Alicorp work. Run `gh auth switch --user arkhangio10` before any `gh` command, and switch back to `AbelMancillaAlicorp` at the end.
  - **Push credentials:** Git Credential Manager only holds the Alicorp login, so push with this per-command override:
    `GIT_CONFIG_COUNT=2 GIT_CONFIG_KEY_0=credential.helper GIT_CONFIG_VALUE_0= GIT_CONFIG_KEY_1=credential.helper GIT_CONFIG_VALUE_1='!gh auth git-credential' git push ...`
- Waiting on the user. Check each of these; do not assume it is done:
  - **SoccerTrack v2 access** (Hugging Face, account `Arkhangio`). Run `hf download atomscott/soccertrack-v2 ball/117092_1st_ball.npz --repo-type dataset --local-dir <scratch>`. "Access denied" means the user has not accepted the terms yet.
  - **`aws login --profile balomer --remote`** in WSL. Check it with `aws sts get-caller-identity --profile balomer`.
  - **The AWS credits form.** The user must do this one.

## Tasks

### 1. Apply the research adjustments to the spec
Edit `specs/local-demo/design.md`, and also `requirements.md` and `tasks.md` wherever an acceptance criterion or a test changes. Cite the research report as the source.
- **Team colours** (Okabe-Ito): Home `#E69F00` as filled dots, Away `#56B4E9` as ring dots. Shape is the second cue, because the two colours have almost the same luminance (WCAG 1.4.1). The dark tactical background stays.
- **TV layout:** keep a safe area of 96 px left and right and 54 px top and bottom. Text is at least 28 px.
- **Alerts:**
  - Enter in 300 ms, ease-out, with `translateY` and `opacity`.
  - Stay on screen for `max(5 s, 0.33 s × words + 2 s)`, about 6–7 s.
  - Exit in 200–250 ms.
  - Back dismisses an alert, and an alert history is kept.
  - Update AC-8 and AC-11 and the tests in T9 and T10 to match.
- **Focus:** a pre-drawn ring that fades in with `opacity`, plus `scale` 1.05 (1.025 for large panels). Focus is never shown by colour alone.
- **Names:** own labels everywhere. Never use EA, FIFA, league, broadcaster or data-provider names, nor product names such as "Match Facts", "Momentum", "PlayStyles" or "HyperMotion". No screenshots or clips of FC 27 or of broadcasts in the app, README or video.
- **Future, out of scope for this spec:** a "territory per minute" timeline, and free-kick geometry (9.15 m circle, distance and angle to goal, wall distance), which needs set-piece detection.
- **Coverage table:** keep it complete.

### 2. Decide where the research lives
Ask the user. Proposed answer: move the report to `docs/research/fc27-visual-patterns.md` and the notes to `docs/research/notes/`, then delete `reports/` and `research_notes/` from the repo root. Respect the 1024 KB cap per file.

### 3. Commit the spec through a PR
- On `spec/local-demo`, commit `docs(spec): add local-demo spec`. Include this prompt file and the research, if the user kept it.
- Run `make check` and show the output. Open a PR, wait for the `check` job to go green, and squash merge it.

### 4. Start T1
Run `/task local-demo`. It takes T1: the boundary schemas and generated types. Tests come first. One task per session, as `CLAUDE.md` says: stop after the T1 PR is merged and write `docs/prompts/004-...md` for the next task.

## Rules
- Follow `CLAUDE.md`:
  - spec before code and tests first;
  - Conventional Commits;
  - no AI co-authorship or AI mention in commits or PRs;
  - every change goes through a PR;
  - never push to `main` directly;
  - never rewrite history.
- Ask before anything that needs sudo, creates external resources or changes GitHub settings.
- Never invent Vega, Fire TV or AWS APIs. Cite the documentation page.
- When an Amazon tool causes friction, remind the user to run `/friction`.
- No dataset, video or model weights in any diff. `data/` is git-ignored.

## Done when
- [ ] The spec has the adjustments and the coverage table is complete
- [ ] The research has a decided home, or has been removed
- [ ] The spec PR is merged and CI is green
- [ ] The T1 PR is merged, or the blocker is reported
- [ ] `gh` is switched back to `AbelMancillaAlicorp`

## Report format
One table with three columns: task, result, evidence (a command output line or a URL). Then a list of anything the user must do by hand, including the pending items from Context.
