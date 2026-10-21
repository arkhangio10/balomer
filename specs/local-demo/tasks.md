# Local demo — Tasks

One task = one PR = one squash-merged commit. A task that cannot name its test
is not a task yet: split it.

Work them in order with `/task local-demo`. Tick the box only when `make check`
passes and the PR is merged. Python tests run on Windows (`make check`). TV
tests run in WSL (`npm test` in `apps/tv`). Visual checks run on the Vega
Virtual Device.

The order puts a moving radar on the TV first (T1–T5, tag `v0.1.0`), then the
real match, metrics and alerts (T6–T9, `v0.2.0`), then the reports (T10–T11,
`v0.3.0`), then the demo (T12, `v1.0.0`).

- [x] **T1 — Define the boundary schemas and generate the types**
  - Criteria: AC-1
  - Test: `packages/contracts/tests/test_schemas.py::test_examples_validate` — every example in `packages/contracts/examples/` validates; a report with two recommendations, a recommendation without evidence, evidence without a period, and an `ok` report with no recommendations are all rejected
  - Done when: the seven schemas exist; `make contracts` regenerates `models/` and `contracts.ts` with no diff; CI fails on a stale generated file

- [ ] **T2 — Add the Vega app from the official generator**
  - Criteria: AC-11 (focus scaffolding), AC-12
  - Test: `apps/tv/test/App.spec.tsx` — the generated template test passes in the new CI `tv` job
  - Done when: `apps/tv` is the unmodified `helloWorld` output (package id `com.balomer.tv`), and CI runs `npm ci`, `jest`, `tsc --noEmit` and `eslint` on it

- [ ] **T3 — Relay messages from the edge to the TV**
  - Criteria: AC-5
  - Test: `services/api/tests/test_relay.py::test_late_client_gets_latest_state` — a client that connects after two `frame`s, two `rolling` `metrics`, a `block` snapshot and two `alert`s receives the latest frame and rolling metrics, the snapshot and both alerts first, then live messages in order; an invalid message is rejected
  - Done when: `uvicorn balomer_api.app:app` serves `/ws/edge` and `/ws/tv`

- [ ] **T4 — Replay a frame file as live**
  - Criteria: AC-4
  - Test: `services/vision/tests/test_replay.py::test_schedule_respects_speed_and_start` — a pure schedule: with `--start` no earlier frame is sent; at speed N every N-th frame goes out 200 ms apart with the right clock stamps; the order is `session`, `phase kickoff`, frames, `phase end`
  - Done when: `python -m balomer_vision.replay data/replay/<file> --start 0 --speed 1` streams a 30-frame sample to the API. History before `--start` arrives in T7 and T9, once metrics and alerts exist.

- [ ] **T5 — Draw the live radar with animated players and ball**
  - Criteria: AC-6
  - Test: `apps/tv/test/pitch.spec.ts` (metres → pixels at the corners and centre, for 105x68 and 40x25, with every corner inside the 96 px / 54 px safe area) and `apps/tv/test/state.spec.ts` (frames update positions, unknown ids appear, missing ids fade out)
  - Done when: on the VVD, the sample from T4 moves smoothly over the dark tactical pitch, Home as filled orange dots and Away as sky-blue rings, with a ball trail; the PR notes a fluidity check and whether the safe area and 28 px text land as designed (Vega layout units are unverified, see the design risks)

- [ ] **T6 — Ingest SoccerTrack v2 into replay files**
  - Criteria: AC-2, AC-3
  - Test: `services/vision/tests/test_soccertrack.py::test_gsr_fixture_to_frames` — a tiny hand-made GSR-shaped fixture gives 200 ms frames, maps teams by `player_id` across halves, holds gaps of 2 s or less, and drops longer ones
  - Done when: `python -m balomer_vision.soccertrack 117092` writes both halves to `data/replay/` without exceeding 2 GB of RAM, and the TV shows the real match

- [ ] **T7 — Compute and publish the tactical metrics**
  - Criteria: AC-7
  - Test: `services/vision/tests/test_metrics.py` — on fixed coordinates:
    - possession by the nearest player within 2 m;
    - line height of the four deepest outfield players from the own goal;
    - width, depth and compactness;
    - attack direction from the goalkeeper;
    - `line_x` and `block` geometry;
    - aggregation over a period (mean, and share of frames for possession).
  - Done when: the replayer publishes `rolling` metrics every 5 s of match time, `block` and `half` snapshots when they close, `frame.possession` on every frame, and the history before `--start`

- [ ] **T8 — Show stats and tactical overlays on the TV**
  - Criteria: AC-7
  - Test: `apps/tv/test/StatsPanel.spec.tsx` — renders both teams' values from a `metrics` message and shows ▲ or ▼ against the previous one; `apps/tv/test/state.spec.ts` — metrics reach the overlays
  - Done when: on the VVD, the possession bar, the defensive lines and the team blocks animate as metrics change

- [ ] **T9 — Fire minute alerts and highlight their evidence**
  - Criteria: AC-8, AC-11 (Back on a banner)
  - Test:
    - `services/vision/tests/test_alerts.py` — exactly one alert per minute mark, no digits in the text, and every evidence `(metric, team, period)` refers to a published snapshot;
    - `apps/tv/test/AlertBanner.spec.tsx` — two periods of the same metric render as `24 m → 18 m`; with fake timers, an 8-word alert leaves after 5 s and a 14-word alert after 6.62 s;
    - `apps/tv/test/state.spec.ts` — Back while a banner is visible dismisses it; a new alert replaces a visible banner; every alert stays in the history, newest first.
  - Done when: replaying from 29:30 at speed 1, the 30' banner slides in, its stat rows pulse, it leaves on its own or on Back, and the history lists the 15' and 30' alerts

- [ ] **T10 — Build the report screens against a fixture**
  - Criteria: AC-9 (TV side), AC-10 (unavailable state), AC-11
  - Test: `apps/tv/test/ReportScreen.spec.tsx` — three cards with resolved evidence; D-pad focus moves between cards; only the focused card has its ring at opacity 1 and scale 1.025; Back returns to `live`; the `unavailable` status shows no recommendations
  - Done when: on the VVD, a fixture report staggers in and is navigable with the remote alone

- [ ] **T11 — Generate the halftime report with the agent on Bedrock**
  - Criteria: AC-9, AC-10, AC-13
  - Test: `services/agent/tests/test_report_validation.py` — the validator rejects an unknown `(metric, team, period)` and any digit in the text; with a stub model, one retry happens and then the status becomes `unavailable`; `services/api/tests/test_halftime.py` — `phase end` for half 1 triggers exactly one report
  - Done when: replaying from 44:00, a report generated by Bedrock (profile `balomer`) reaches the TV within 60 s of `phase end`. Blocked until `aws login` works.

- [ ] **T12 — Make the demo reproducible and credited**
  - Criteria: AC-12
  - Test: `services/vision/tests/test_cli_help.py` — every command in the README's demo section exists and prints its help
  - Done when: README demo steps, the SoccerTrack v2 credit in README and NOTICE, ARCHITECTURE and OBJECTIVES updated for local mode, DEMO_SCRIPT trimmed to 2:50, and none of the names or images excluded under "Labels" in design.md appear in `apps/tv/src`, the README or DEMO_SCRIPT

## Coverage check

Every AC in `requirements.md` appears against at least one task above. Fill this
in last and keep it accurate.

| AC | Task |
|----|------|
| AC-1 | T1 |
| AC-2 | T6 |
| AC-3 | T6 |
| AC-4 | T4 |
| AC-5 | T3 |
| AC-6 | T5 |
| AC-7 | T7, T8 |
| AC-8 | T9 |
| AC-9 | T10, T11 |
| AC-10 | T10, T11 |
| AC-11 | T2, T9, T10 |
| AC-12 | T2, T12 |
| AC-13 | T11 |
