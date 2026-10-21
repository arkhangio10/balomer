# 004 · Add the Vega app from the official generator (T2)

## Context
- As of 2026-10-21, 13:20 on the laptop clock (UTC-5): we submit 2026-10-22, and the hard deadline is 2026-10-23 12:00 PT (14:00 on the laptop clock).
- Read the project memory notes `local-first-plan` and `vega-vvd-on-wsl` first.
- Done in session 003:
  - **Spec merged:** PR #9 (`08aafcc`). The research adjustments are in it, and the research lives in `docs/research/`.
  - **T1 merged:** PR #10 (`efadd56`). It added:
    - seven schemas in `packages/contracts/schemas/`;
    - Pydantic models in `balomer_contracts.models`, a package with one module per schema;
    - TS types in `apps/tv/src/contracts.ts`;
    - `make contracts`;
    - a CI step that fails when generated files are stale.
- **Next unchecked task:** T2 in `specs/local-demo/tasks.md`. It covers AC-11 (focus scaffolding) and AC-12.
- **Verified in WSL on 2026-10-21 (Vega CLI 1.4.5, SDK 0.24.12112):**
  - **Generator:** `vega project generate --template helloWorld --name <alnum> --packageId com.balomer.tv --outputDir <dir>`. Template `helloWorld` targets RN 0.83; `helloWorld-rn72` targets RN 0.72.
  - **Reference app:** the hello app in `~/vega-hello` has these `package.json` scripts:
    - `test`: `jest --colors`
    - `lint`: `eslint src test package.json --ext .ts,.tsx`
    - `build:app`: release build
- **`apps/tv/` is not empty.** It already holds `README.md` and the generated `src/contracts.ts`, which starts with `/* eslint-disable */`. Generate into a scratch directory in WSL and copy the output in, so the generator output stays unchanged. Keep `contracts.ts`.
- **`make contracts` runs `json-schema-to-typescript@16.0.0` through `npx`.** Moving it into `apps/tv` `devDependencies` would change the generator output, so leave it out of T2. Ask the user whether it becomes a separate chore.
- **Environment that already works:**
  - **WSL2 `Ubuntu`:**
    - Vega CLI and SDK live in `~/vega`.
    - The Virtual Device only survives inside a long-lived session.
    - The device reaches WSL through reverse port forwarding (`vega device start-port-forwarding --port <p> --forward false`).
    - AWS CLI and `uv` are in `~/.local/bin`.
    - `npm` on `/mnt/c` is slow and has no file watching.
  - **Windows:**
    - `make`, `uv` 0.12.17, `pre-commit`, Node 22.19 and `hf`, which is installed on Windows only, not in WSL.
    - `make check` passes.
  - **Running commands in WSL:** `wsl.exe` re-expands `$VARS`. Write a script, strip CR with `tr -d '\r'`, then run it in WSL.
- **GitHub setup:**
  - **Repo:** `arkhangio10/balomer`, public.
  - **Branch protection:** `main` requires the `check` job and allows squash merges only.
  - **`gh` account:** run `gh auth switch --user arkhangio10` before any `gh` command, and switch back to `AbelMancillaAlicorp` at the end.
  - **Push:** use this per-command override:
    `GIT_CONFIG_COUNT=2 GIT_CONFIG_KEY_0=credential.helper GIT_CONFIG_VALUE_0= GIT_CONFIG_KEY_1=credential.helper GIT_CONFIG_VALUE_1='!gh auth git-credential' git push ...`
  - **CI gotcha:** the gitleaks step leaves an untracked `results.sarif` in the workspace. Any CI check on `git status` must be scoped to its own paths.
- **Waiting on the user.** Check each of these; do not assume it is done:
  - **SoccerTrack v2 access:** on 2026-10-21, `hf download atomscott/soccertrack-v2 ball/117092_1st_ball.npz --repo-type dataset --local-dir <scratch>` (Windows `hf`, account `Arkhangio`) answered "Access denied. This repository requires approval."
  - **`aws login --profile balomer --remote`** in WSL: on 2026-10-21, `aws sts get-caller-identity --profile balomer` answered "The config profile (balomer) could not be found."
  - **The AWS credits form.** The user must do this one.
  - **Friction log:** `docs/FRICTION_LOG.md` still has only the example entry. Remind the user to run `/friction` for the Vega-on-WSL issues in memory note `vega-vvd-on-wsl`, such as the missing `libtinfo5` and the VVD exiting 0 on failure.
  - **Two design choices left unchanged in the spec:**
    - the stat-row pulse: three pulses at scale 1.12, where the research suggests one pulse at 1.04;
    - the halftime card stagger: 120 ms, where the research suggests 50–80 ms.

    Ask the user before changing either.

## Tasks

### 1. Check the pending items
Run both checks above and report the result.

### 2. Run `/task local-demo`
It takes T2. Tests first: the CI `tv` job must run the generated template test, and it fails before `apps/tv/package.json` exists.

Check these first, and stop and ask if any of them blocks:
- **Public packages:** are the generated app's `@amazon-devices/*` packages public on npm (`npm view <pkg> version`)? If not, the CI `tv` job cannot run `npm ci`.
- **Lockfile size:** `package-lock.json` may exceed the 1024 KB large-file cap. Never raise the cap without asking.
- **Build artifacts:** `buildinfo.json` is not git-ignored, and `build/` is. Commit no build artifact.
- **Branch protection:** making the new `tv` job required changes GitHub settings, so ask first.

### 3. Open the PR
Commit, open a PR, wait for CI to go green and squash merge it. Include this prompt file in the PR.

One task per session: stop after the T2 PR is merged and write `docs/prompts/005-...md` for T3.

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
- [ ] The T2 PR is merged with CI green, or the blocker is reported
- [ ] `docs/prompts/005-...md` is written
- [ ] `gh` is switched back to `AbelMancillaAlicorp`

## Report format
One table with three columns: task, result, evidence (a command output line or a URL). Then a list of anything the user must do by hand, including the pending items from Context.
