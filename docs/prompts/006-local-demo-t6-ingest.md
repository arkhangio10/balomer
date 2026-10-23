# 006 · Ingest SoccerTrack v2 (T6), then the VVD checks, T11, T12 and the submission

## Context
- As of 2026-10-22, 22:45 on the laptop clock (UTC-5). The hard deadline is 2026-10-23 12:00 PT, which is 14:00 on the laptop clock. The target was to submit on 2026-10-22 (objective H5). There are no open PRs.
- Read the memory notes `local-first-plan` and `vega-vvd-on-wsl` first, then `specs/local-demo/{requirements,design,tasks}.md`.
- **Done in session 005.** All seven tasks of `specs/local-demo/plan.md` ran with subagents, partly unattended. Each was merged as one squash commit with CI `check` and `tv` green:

  | Task | PR | Commit |
  |---|---|---|
  | T3 relay (`services/api`, FastAPI, D1/D2) | #12 | `ebcc2c5` |
  | T4 replayer CLI and the 30-frame synthetic fixture (D3) | #13 | `d0b9d9b` |
  | T5 TV radar (`theme`, `pitch`, `state`, `feed`; dots, ball, clock bar) | #14 | `39a777f` |
  | T7 edge metrics (`metrics.py`; rolling, block and half snapshots in the schedule) | #15 | `c64458e` |
  | T8 TV stats panel, possession bar, defensive lines, team blocks | #16 | `ad0ed8a` |
  | T9 minute alerts (`alerts.py`) and the TV banner, history, pulses and Back | #17 | `b369ef2` |
  | T10 TV report screens against a test-only fixture | #18 | `b5f86c6` |
  | Whole-branch review fix: banners only for live alerts, `phase` cleared on a half-2 session | #19 | `806d106` |

- **Dependencies so far,** all pinned:
  - `fastapi==0.159.1`, `uvicorn==0.54.0` and `websockets==17.3` in `services/api`;
  - `websockets==17.3` in `services/vision`;
  - `httpx==0.28.1` in the dev group.
- **Rulings taken without the user.** They are listed in each PR under "Decisions taken without the user". The ones that matter next:
  - **R7:** the 60' alert compares Home with Away, because a replay run holds one half.
  - **R14:** Back goes through `BackHandler`'s `hardwareBackPress`.
  - **R19:** a banner shows only for an alert that arrives after a frame. A late TV or a `--start` burst lists past alerts in the history without a banner.
  - **D4:** for the unattended run, every `tasks.md` box stays unticked.

## SoccerTrack v2 is unblocked and downloaded
- **Access.** Hugging Face granted access on 2026-10-22, at about 17:29 (account `Arkhangio`).
- **Files.** Only match 117092 was downloaded, without video, into `data/soccertrack-v2/` (git-ignored by the `data/` rule; `git status` stays clean):

  | File | Bytes |
  |---|---|
  | `data/soccertrack-v2/gsr/117092/117092_1st.json` | 2 705 362 626 |
  | `data/soccertrack-v2/gsr/117092/117092_2nd.json` | 2 709 799 141 |
  | `data/soccertrack-v2/ball/117092_1st_ball.npz` | 127 031 |
  | `data/soccertrack-v2/ball/117092_2nd_ball.npz` | 126 093 |

  The command was:
  ```powershell
  hf download atomscott/soccertrack-v2 --repo-type dataset --include "gsr/117092*" --include "ball/117092*" --local-dir data\soccertrack-v2
  ```
  The whole dataset is 145 GB, almost all of it video. Never download `videos/`.
- **Where to read from.** The spec does not fix the raw-data path. `data/soccertrack-v2/` mirrors the dataset layout; have `python -m balomer_vision.soccertrack 117092` read from there. Record this as a decision in the PR.
- **The GSR JSON** starts with an `info` object (`"version": "1.3"`, `"game_time_start": "1 - 00:00"`, `"game_time_stop": "1 - 44:55"`, …) and ends with a `categories` list (the last one is `{"id": 7, "name": "other"}`). Inspect its structure by streaming. **Never `json.load` it:** each half is 2.7 GB, and loading needs about 20 GB of RAM.
- **Disk.** About 117 GB stay free on C:.

## Tasks

### 1. Check the pending item
In WSL, run `aws configure list-profiles` and `aws sts get-caller-identity --profile balomer`. At 01:47 the profile did not exist. Report the result; T11 needs it.

### 2. T6, with `/task local-demo`
It covers AC-2 and AC-3. Tests first.
- **Test:** `services/vision/tests/test_soccertrack.py::test_gsr_fixture_to_frames`. A tiny hand-made GSR-shaped fixture must:
  - give 200 ms frames;
  - map teams by `player_id` across halves;
  - hold gaps of 2 s or less;
  - drop longer gaps.
- **Done when:** `python -m balomer_vision.soccertrack 117092` writes both halves to `data/replay/` without exceeding 2 GB of RAM, and the TV shows the real match.
- **Output format.** The replay format is fixed by T4. Line 1 is a `session` message (`match_id` `117092`, pitch 105 x 68, credit `Data: SoccerTrack v2 (CC BY 4.0)`). Then comes one `frame` per line in clock order, with `possession` null. The half-2 clock starts at 2 700 000 ms. Coordinates are metres from the centre spot.
- **Dependencies.** design.md names `ijson` (to stream the JSON) and `numpy` (to read the `.npz`). Pin each exactly and state the reason in the PR.
- **The whole-branch review asks T6 to guarantee two things:**
  - each team's goalkeeper role appears in the first 30 s of each half, or `attack_direction` raises an error;
  - at least one outfield player per team in every frame, or `shape` raises an error.

  Exclude referees and the `other` category. Add both cases to the T6 test.
- **Check in WSL.** Replay the real half into uvicorn: `uv run python -m balomer_vision.replay data/replay/117092_1.jsonl --start 00:00 --speed 1`. Record the RAM peak of the ingest, using `/usr/bin/time -v` or equivalent.
- **The first PR also commits this prompt file.**

### 3. VVD session with the user
It needs the user's eyes. Run T5, T8, T9 and T10 in one sitting, now that a 45-minute replay exists.
- **Start the device in the user's own terminal.** It dies with the `wsl.exe` session that launched it:
  ```sh
  source ~/vega/env
  vega virtual-device start
  vega device start-port-forwarding --port 8080 --forward false
  vega run-app <path to balomertv_x86_64.vpkg>
  ```
  Check each command's `--help` first. `virtual-device start` exits 0 even on "Deadline reached", so read `virtual_device.err`.
- **Build** the `.vpkg` with `npm run build:app` in a native WSL copy, as in plan.md "How every task runs". It lands in `build/x86_64-release/`.
- **T5:**
  - motion is smooth with 22 dots;
  - the delay between the replayer's logged clock and the clock bar is ≤ 2 s;
  - the safe area and the 28 px text land as designed, which settles px vs dp;
  - the TV recovers after a uvicorn restart;
  - whether WebSocket needs a manifest privilege;
  - dots on the left goal line may overhang the 96 px margin.
- **T8:**
  - the bar, lines and blocks animate;
  - the ▲/▼ glyphs render;
  - the rows fit the 486 px panel;
  - `scaleX: 0` renders at 0% possession.
- **T9:** from `--start 29:30`:
  - the 30' banner slides in, its rows pulse, and it leaves on its own or on Back;
  - Back with no banner falls through;
  - the history lists 15' and 30' without overflowing;
  - with R19, the 15' alert from the `--start` burst shows in the history without a banner.
- **T10:** send `packages/contracts/examples/phase.json` and then `report_ok.json` through `/ws/edge` with `uv run python -m websockets ws://127.0.0.1:8080/ws/edge`. Check:
  - the cards stagger in;
  - D-pad focus moves between them, with the first card focused;
  - the ring and the 1.025 scale show;
  - Back returns to the radar without closing the app;
  - also send `report_unavailable.json`.

  This is a fixture: it is never shown as a generated report and never appears in the video.
- **Record what the user sees in a docs PR** and tick each box whose check passes, including T3, T4 and T7, whose "Done when" is already met. A failure becomes a `fix(tv): …` PR traced to its task, tests first.

### 4. T11, only if task 1 shows the `balomer` profile
Run `/task local-demo`. Bedrock through Strands `BedrockModel`, profile `balomer`, model from `BEDROCK_MODEL_ID`.
- The whole-branch review asks T11 to cap or clip the report text: the report area does not clip, and the schema has no `maxLength`.
- Without credentials, the demo shows the "report unavailable" state or cuts that scene. A fixture is never shown as a generated report.

### 5. T12
README demo steps, the SoccerTrack v2 credit in README and NOTICE, ARCHITECTURE and OBJECTIVES in local mode, and DEMO_SCRIPT trimmed to 2:50. Its test is `services/vision/tests/test_cli_help.py`. Then tag `v1.0.0` (objective E4).

### 6. Submission (`docs/OBJECTIVES.md` "Submission")
The user does most of these.
- **D1:** video of 2:50 at most, public on YouTube, running on the VVD.
- **D2:** description, plus product feedback for every tool (`docs/PRODUCT_FEEDBACK.md`).
- **D3:** public repo with Apache-2.0 visible in About. Not verified yet.
- **D4:** friction log and feature requests. **`docs/FRICTION_LOG.md` still has only the example entry.**
- **D5:** Open Source contribution URL and description. Its status is unknown.
- The AWS credits form.

### Known limitations
- **Running half 2 twice** leaves the previous run's 60' and 75' alerts and its 45–90 snapshots in the relay and on the TV (M1). The workaround is to run half 1 again, or restart the API and relaunch the app.
- **Every figure on screen** comes from `services/vision`. The ball track in SoccerTrack v2 is interpolated between events; say so in the README and the video.

## Friction to log with `/friction`
- Vega on WSL (memory note `vega-vvd-on-wsl`):
  - the missing `libtinfo5`;
  - the VVD exiting 0 on failure;
  - the emulator dying with its `wsl.exe` session.
- The `helloWorld` template's `metro.config.js` ships stray `+` diff markers and trailing whitespace.
- **The Vega Jest preset's `BackHandler` mock is unusable.** `index.js` reads `require('./Libraries/Utilities/BackHandler').default`, but `jest/mocks/BackHandler.js` has no `default`. The override needs the `.kepler` path (`Libraries/Utilities/BackHandler.kepler`).
- The Vega Jest preset runs `requestAnimationFrame` on `setTimeout`, so component tests need fake timers.
- The ESLint rule `@amazon-devices/kepler/sdl-package-version-check-imports` warns on every direct `@amazon-devices/react-native-kepler` import that the Vega docs require.

## Environment
- **WSL `Ubuntu`:**
  - the Vega CLI is `~/vega/bin/vega`; run `source ~/vega/env` first;
  - `uv` and the AWS CLI are in `~/.local/bin`;
  - `uv` uses `UV_PROJECT_ENVIRONMENT=$HOME/.venvs/balomer`.
- **Running commands in WSL.** `wsl.exe` re-expands `$VARS`. Write a script, strip CR with `tr -d '\r'`, and run it from PowerShell with `wsl.exe -d Ubuntu -- bash /mnt/c/...`. A server started in that script dies when the call returns, so start uvicorn and its clients inside one script.
- **TV checks** run on a native copy (plan.md "How every task runs"): `npm ci`, then `npm test -- --ci`, `npx tsc --noEmit` and `npm run lint`.
- **GitHub:**
  - the repo is `arkhangio10/balomer`; `main` requires `check` and `tv`, and allows squash merges only;
  - run `gh auth switch --user arkhangio10` before any `gh` command, and switch back to `AbelMancillaAlicorp` at the end;
  - push with `GIT_CONFIG_COUNT=2 GIT_CONFIG_KEY_0=credential.helper GIT_CONFIG_VALUE_0= GIT_CONFIG_KEY_1=credential.helper GIT_CONFIG_VALUE_1='!gh auth git-credential' git push ...`;
  - branch with `git fetch origin` and then `git switch -c <branch> origin/main`.

## Rules
- Follow `CLAUDE.md`:
  - spec before code and tests first;
  - Conventional Commits;
  - no AI co-authorship or AI mention in commits or PRs;
  - every change through a PR;
  - never push to `main`;
  - never rewrite history.
- Ask before anything that needs sudo, creates external resources or changes GitHub settings.
- Never invent Vega, Fire TV or AWS APIs. Cite the doc page, the `vega ... --help` output, or the installed `.d.ts`.
- No dataset, video or model weights in any diff. `data/` is git-ignored; check `git status` before every commit.

## Report format
One table with three columns: task, result, evidence (a command output line or a URL). Then a list of anything the user must do by hand.
