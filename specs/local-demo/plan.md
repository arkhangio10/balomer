# Local demo — Plan for the unblocked tasks

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build every `specs/local-demo` task that does not wait on SoccerTrack v2 access or `aws login`, so a replayed half moves on the Vega Virtual Device with stats, alerts and report screens.

**Architecture:** A FastAPI relay (`/ws/edge` → `/ws/tv`) with a latest-state cache. A replayer CLI turns a replay JSONL into timed messages. Pure metric and alert functions run on the edge. The Vega app holds a single reducer from `message` to screen state and draws it with `View` + `Animated`.

**Tech Stack:** Python 3.12 (uv workspace, Pydantic models generated from `packages/contracts`, FastAPI, uvicorn, websockets, pytest). React Native 0.83 for Vega (`@amazon-devices/react-native-kepler` 4.0.x, Jest, TypeScript 5.8).

**Spec:** [requirements.md](requirements.md), [design.md](design.md), [tasks.md](tasks.md). Read all three first: this plan only adds the decisions they leave open.

**Scope:** T3, T4, T5, T7, T8, T9 and T10, in that order. Out of scope here:
- **T6:** waits on Hugging Face approval for SoccerTrack v2.
- **T11:** waits on `aws login --profile balomer`.
- **T12:** its test needs T6's ingest command.

T8 and T9 can be built and tested now, but their VVD checks need a long replay; see D3 and D4.

## Decisions to confirm before Task 1

The spec leaves these open. Each has a default; the user confirms or changes it before execution starts.

| ID | Question | Default | Status |
|----|----------|---------|--------|
| D1 | What does "an invalid message is rejected" mean on `/ws/edge`? | Drop it, log a warning with the validation error, keep the edge socket open, and never forward it. | Confirmed by the user on 2026-10-22 |
| D2 | What does a late TV get on connect? AC-5 does not name `session` or `phase`, but the TV needs the pitch size. | Send, in this order: latest `session`, latest `phase`, every `block`/`half` snapshot (arrival order), every alert (arrival order), latest `rolling` metrics, latest report, latest frame. A `session` for half 1 clears the whole cache (a new run). A `session` for half 2 clears frame, rolling metrics and phase, and keeps snapshots, alerts and report. | Confirmed by the user on 2026-10-22 |
| D3 | What moves on the TV while T6 is blocked? | A committed synthetic fixture: `services/vision/tests/fixtures/sample_1.jsonl`, 30 frames, 11 players a side, credit `Synthetic test sample`. It is test data only and never appears in the video. It is too short for the T8 and T9 VVD checks. If SoccerTrack access does not arrive, the only way to get a moving demo is a synthetic generator. The spec lists that under "Alternatives rejected", so the user has to reopen the decision. | Confirmed by the user on 2026-10-22 |
| D4 | What happens to T8 and T9, whose VVD checks need T6? | Merge code and tests. Leave the `tasks.md` box unticked. The PR says which check is pending. | Confirmed by the user on 2026-10-22. For the unattended run of 2026-10-22 it also covers T5 and T10: no task gets a VVD check, and every box stays unticked. |
| D5 | Stat-row pulse and halftime stagger (open since session 003) | Keep the spec values: three pulses at 1.12, cards 120 ms apart. | Confirmed by the user on 2026-10-22 |

## Global Constraints

- Python: type hints everywhere, `mypy --strict` passes, `logging`, never `print`. Boundary types come only from `balomer_contracts.models`, never hand-written.
- Metrics and alerts are pure functions: no I/O, no globals, no clock.
- Only coordinates and metrics leave the edge.
- Frames are 200 ms apart. Rolling metrics cover the last 5 minutes and go out every 5 s of match time.
- Periods:
  - blocks are 0–15, 15–30, 30–45, 45–60, 60–75, 75–90;
  - halves are 0–45 and 45–90;
  - the half-2 clock starts at 2 700 000 ms.
- TV:
  - layout 1920x1080, safe area 96 px left and right, 54 px top and bottom, no text below 28 px;
  - only `transform` and `opacity` are animated, with `useNativeDriver: true`; no `setNativeProps`, no new rendering dependency.
- Colours: background `#0B1F17`, lines `rgba(255,255,255,0.35)`, Home `#E69F00` (filled dots), Away `#56B4E9` (rings), ball `#FFFFFF`, alert accent `#F43F5E`.
- Focus is a ring plus a scale change, never colour alone. The ring fades in over 150 ms. The element scales to 1.05, or to 1.025 for large panels. Both return in 100 ms.
- Labels are Balomer's own: Home, Away, Possession, Line height, Width, Depth, Compactness, Alerts, Halftime report, Full-time report. None of the names excluded in design.md "Labels" may appear.
- API: `ws://127.0.0.1:8080/ws/edge` and `/ws/tv`. The VVD reaches it after `vega device start-port-forwarding --port 8080 --forward false`.
- One task = one PR = one squash-merged commit. Conventional Commits. No AI mention anywhere. Every new dependency gets an exact pin and a reason in the PR. Nothing over 1024 KB, and no dataset, video or weights.

## Review Focus

1. **Rehearsal restart.** The replayer runs half 1 again, and a late TV must not see the previous run's alerts twice. Covered by `test_new_first_half_session_clears_cache` (Task 1) and "a session for half 1 resets the state" (Task 3).
2. **Late TV in the second half.** A TV that connects during half 2 gets the halftime report in its replay, and must stay on `live`. Covered by "a report outside its phase end does not change the screen" (Task 7).
3. **Stoppage time.** Frames after 45:00 in half 1, or after 90:00 in half 2, belong to the half's last block, which closes at the end of the half, not at the minute mark. Covered by `test_block_of_counts_stoppage_time` (Task 4).
4. **Ball missing.** A frame can arrive with `ball: null`. Possession keeps its previous value, and the TV hides the ball and its trail. Covered by `test_possession_keeps_previous` (Task 4) and "a null ball clears ball and trail" (Task 3).
5. **Start order.** The TV may start before the API, or the API may restart. The feed reconnects 1 s after any close, and the replay rebuilds the screen. Covered by `feed.spec.ts` (Task 3).

## How every task runs

- **Branch:** `feat/local-demo-t<N>-<slug>`, from an up-to-date `main` (`git switch main`, then `git pull --ff-only`). In session 004 the permission classifier denied this pull. If that happens again, ask the user to run it.
- **Python checks** run on Windows: `make check`, and it must show `All checks passed!` and `N passed`.
- **TV checks** run in WSL on a native copy, because `npm` on `/mnt/c` is slow:
  ```sh
  rm -rf ~/tv-check && mkdir -p ~/tv-check
  cd /mnt/c/Users/braya/Desktop/project_personal/bolomer
  git ls-files -co --exclude-standard apps/tv | tar -cf - -T - | tar -xf - -C ~/tv-check
  cd ~/tv-check/apps/tv && CI=true npm ci && npm test -- --ci && npx tsc --noEmit && npm run lint
  ```
  `wsl.exe` re-expands `$VARS`. Put commands in a script, strip CR with `tr -d '\r'`, and run it from PowerShell with `wsl.exe -d Ubuntu -- bash /mnt/c/...`.
- **Python in WSL** (uvicorn, replayer): `UV_PROJECT_ENVIRONMENT=$HOME/.venvs/balomer uv sync`, then `uv run ...` with the same variable.
- **VVD checks** need the user's eyes. Build in the WSL copy with `npm run build:app`. Start the device with `vega virtual-device start` in a long-lived session, then `vega device start-port-forwarding --port 8080 --forward false`. Install with `vega run-app <the .vpkg under build/>`. Stop and ask the user what they see; never claim a visual check yourself. If Vega gets in the way, remind them to run `/friction`.
- **PR:**
  - tick the task's box in `tasks.md` only if its "Done when" is fully met (D4);
  - commit body `Spec: specs/local-demo, task T<N> (AC-…)`;
  - run `gh auth switch --user arkhangio10`, push with the credential override from the prompt files, then `gh pr create`, `gh pr checks <n> --watch` (both `check` and `tv` must pass) and `gh pr merge <n> --squash`;
  - run `gh auth switch --user AbelMancillaAlicorp` before the session ends.
- **The first PR also carries:**
  - `docs/prompts/005-local-demo-t3-relay.md` and this plan;
  - a fix to the stale `json-schema-to-typescript` line in design.md "Dependencies": it stays on `npx` by the user's decision.

---

### Task 1: T3 — Relay messages from the edge to the TV (AC-5)

**Files:**
- Create: `services/api/src/balomer_api/app.py`
- Test: `services/api/tests/test_relay.py`
- Modify:
  - `services/api/pyproject.toml`: add `fastapi`, `uvicorn` and `websockets`. uvicorn has no WebSocket support without a WebSocket library.
  - root `pyproject.toml` dev group: add `httpx`, which `TestClient` needs.
  - `uv.lock`.
  - `specs/local-demo/design.md`: the dependency line.

**Interfaces:**
- Consumes: `balomer_contracts.models.Message`.
- Produces:
  - `create_app() -> FastAPI`, which builds a fresh cache per call;
  - module-level `app = create_app()`, for `uvicorn balomer_api.app:app`;
  - `class Relay` with `record(message: Message, raw: str) -> None` and `replay() -> list[str]`, which follows the D2 order and reset rules.

  The relay stores and forwards the raw text it received after validation, not a re-dump, so nulls and number formats reach the TV unchanged.

- [ ] **Step 1: Write the failing tests.** Build messages from `packages/contracts/examples/*.json`, varying `clock_ms` and `period`. The test must be deterministic, so an early TV client proves every edge message was processed before the late one connects:

```python
def test_late_client_gets_latest_state() -> None:
    client = TestClient(create_app())
    with client.websocket_connect("/ws/tv") as early, client.websocket_connect("/ws/edge") as edge:
        sent = [session, kickoff, frame_1, frame_2, rolling_1, rolling_2, block_0_15, alert_15, alert_30]
        for m in sent:
            edge.send_text(json.dumps(m))
        assert [early.receive_json() for _ in sent] == sent
        with client.websocket_connect("/ws/tv") as late:
            assert [late.receive_json() for _ in range(7)] == [
                session, kickoff, block_0_15, alert_15, alert_30, rolling_2, frame_2]
            edge.send_text(json.dumps({"type": "frame"}))      # invalid: dropped (D1)
            edge.send_text(json.dumps(frame_3))
            assert late.receive_json() == frame_3
            assert early.receive_json() == frame_3

def test_new_first_half_session_clears_cache() -> None:
    # after a run with alerts, a new half-1 session -> a late TV receives only [session_again];
    # after a run, a half-2 session -> a late TV receives [session_h2, block_0_15, alert_15, alert_30]
```

- [ ] **Step 2: Run them and confirm they fail.** Run `uv run pytest services/api/tests/test_relay.py -v`. Expected: `ModuleNotFoundError: No module named 'balomer_api.app'`.
- [ ] **Step 3: Implement `app.py`.**
  - **Edge handler:** one `asyncio.Lock` guards each edge message's record and broadcast, and each TV client's registration.
  - **Per-client queue:** each TV client gets an `asyncio.Queue[str]`. Under the lock, the queue is filled with `replay()` and registered *before* `accept()`. A sender loop drains it. With this order, a client registered by the time `websocket_connect` returns misses nothing and receives nothing twice, and a slow TV never blocks the edge.
  - **Disconnect:** remove the queue.
  - **Validation:** `Message.model_validate_json(raw)`; on `ValidationError`, do D1.
- [ ] **Step 4: Run the tests and `make check`; all pass.**
- [ ] **Step 5: Check the server in WSL.** Run `uv run uvicorn balomer_api.app:app --host 127.0.0.1 --port 8080`. A WebSocket upgrade with `curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" -H "Sec-WebSocket-Version: 13" -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" http://127.0.0.1:8080/ws/tv` answers `HTTP/1.1 101 Switching Protocols`. Do the same for `/ws/edge`. <!-- gitleaks:allow: the key is the RFC 6455 sample nonce, not a secret -->
- [ ] **Step 6: Open the PR** (see "How every task runs"), with `fastapi`, `uvicorn`, `websockets` and `httpx`, each pinned and justified.

### Task 2: T4 — Replay a frame file as live (AC-4)

**Files:**
- Create:
  - `services/vision/src/balomer_vision/replay.py`
  - `services/vision/tests/fixtures/sample_1.jsonl` (D3)
- Test: `services/vision/tests/test_replay.py`
- Modify: `services/vision/pyproject.toml` (add `websockets`) and `uv.lock`.

**Interfaces:**
- **Replay file format**, which T6 must also write: line 1 is a `session` message, then one `frame` per line in clock order, with `possession` null.
- **Produces:**
  - `EdgeMessage = Session | Phase | Frame | Metrics | Alert`;
  - `@dataclass(frozen=True) class Send: at_s: float; message: EdgeMessage`, where `at_s` is the wall-clock offset from the first send;
  - `read_replay(path: Path) -> tuple[Session, Iterator[Frame]]`, which streams the file and never loads it whole;
  - `parse_clock(text: str) -> int`, for example `"29:30"` → `1_770_000`;
  - `schedule(session: Session, frames: Iterable[Frame], start_ms: int, speed: float) -> Iterator[Send]`;
  - `async def publish(url: str, sends: Iterable[Send]) -> None`, which sleeps on `time.monotonic()` until each `at_s` and sends `model_dump_json()`;
  - `main(argv: Sequence[str] | None = None) -> int`, with a positional path, `--start MM:SS` (default `00:00`), `--speed N` (default 1, must be ≥ 1) and `--url` (default `ws://127.0.0.1:8080/ws/edge`). It logs the match clock at INFO every 5 s of match time, so the T5 latency check has something to compare against.

- [ ] **Step 1: Write the failing test.** Ten frames at clock 0, 200, …, 1800 ms:

```python
def test_schedule_respects_speed_and_start() -> None:
    sends = list(schedule(session, frames, start_ms=0, speed=1))
    assert [s.message.type for s in sends] == ["session", "phase"] + ["frame"] * 10 + ["phase"]
    assert sends[1].message.phase == "kickoff" and sends[-1].message.phase == "end"
    assert [s.at_s for s in sends[2:-1]] == pytest.approx([0.2 * k for k in range(10)])
    fast = [s.message for s in schedule(session, frames, 0, 3) if s.message.type == "frame"]
    assert [f.clock_ms for f in fast] == [0, 600, 1200, 1800]
    late = [s.message for s in schedule(session, frames, 1000, 1) if s.message.type == "frame"]
    assert late[0].clock_ms == 1000 and all(f.clock_ms >= 1000 for f in late)
    assert parse_clock("29:30") == 1_770_000
```

- [ ] **Step 2: Run it and confirm it fails with `ModuleNotFoundError: No module named 'balomer_vision.replay'`.**
- [ ] **Step 3: Implement `replay.py`.**
  - `session` and `phase kickoff` go out at `at_s = 0`.
  - The k-th sent frame goes at `0.2 * k`.
  - `phase end` (same half as the session) goes at `0.2 * n`.
  - The step is `round(speed)`, counted from the first frame at or after `start_ms`.
- [ ] **Step 4: Write the fixture.** Produce `sample_1.jsonl` once with a throwaway script that is not committed: 30 frames, 11 players a side (one goalkeeper each, ids `h1`–`h11` and `a1`–`a11`), straight-line motion, and the ball moving between two Home players. Line 1 is the session `{"match_id": "sample", "half": 1, "pitch_length_m": 105, "pitch_width_m": 68, "credit": "Synthetic test sample"}`. Add a test that `read_replay` reads it into 1 session and 30 valid frames.
- [ ] **Step 5: Run the tests and `make check`; all pass.**
- [ ] **Step 6: Check the CLI in WSL.**
  1. Run uvicorn from Task 1.
  2. In another session, run `uv run python -m websockets ws://127.0.0.1:8080/ws/tv`. This is websockets' interactive client; check `--help` first.
  3. Run `uv run python -m balomer_vision.replay services/vision/tests/fixtures/sample_1.jsonl --start 00:00 --speed 1`. It exits 0 after about 6 s, and the client prints `session`, `phase`, 30 frames and `phase`.
- [ ] **Step 7: Open the PR**, with `websockets` pinned and justified.

### Task 3: T5 — Draw the live radar with animated players and ball (AC-6, AC-11 scaffolding)

**Files:**
- Create:
  - `apps/tv/src/theme.ts`, `pitch.ts`, `state.ts`, `feed.ts`
  - `apps/tv/src/components/Pitch.tsx`, `PlayerDot.tsx`, `Ball.tsx`, `ClockBar.tsx`
- Modify: `apps/tv/src/App.tsx`. Keep `export const App`, because `index.js` imports it.
- Test: `apps/tv/test/pitch.spec.ts`, `state.spec.ts` and `feed.spec.ts`. Rewrite `App.spec.tsx`: it renders the clock bar with the session credit, and has no snapshot.
- Delete: the template's `components/Tile.tsx`, `data/tiles.tsx`, `assets/*.png`, `test/Tile.spec.tsx`, `test/__snapshots__/`, and the `!apps/tv/src/data/` line in the root `.gitignore`. That line exists only for the template's `data/` folder.

**Interfaces:**
- Consumes: the `Message`, `Session`, `Frame`, `Point` and `Player` types from `src/contracts.ts`. Team is `Player['team']`.
- **Produces (`theme.ts`):**
  - `SCREEN = {width: 1920, height: 1080}` and `SAFE = {x: 96, y: 54}`;
  - `CLOCK_BAR_HEIGHT = 72` and `MIN_TEXT = 28`;
  - `RADAR_AREA: Box`: the left 70% of the safe width, below the clock bar;
  - `FRAME_MS = 200`;
  - `colors`, and the focus and banner durations from Global Constraints.
- **Produces (`pitch.ts`):**
  - `interface Box {left: number; top: number; width: number; height: number}`;
  - `fitPitch(lengthM: number, widthM: number, area: Box): Box`: the largest box with the pitch's aspect ratio, centred in `area`;
  - `toScreen(p: {x: number; y: number}, lengthM: number, widthM: number, box: Box): {left: number; top: number}`, where `left = box.left + (x + L/2) / L * box.width` and `top = box.top + (y + W/2) / W * box.height` (+y is the near touchline, at the bottom).
- **Produces (`state.ts`):**
  - `interface Dot {id: string; team: Player['team']; role: Player['role']; x: number; y: number; visible: boolean}`;
  - `interface TvState {session: Session | null; half: 1 | 2 | null; clockMs: number; dots: Record<string, Dot>; ball: Point | null; trail: Point[]; possession: Player['team'] | null}`;
  - `type Action = {kind: 'message'; message: Message}`;
  - `initialState` and `reduce(state: TvState, action: Action): TvState`, which is pure.
- **Produces (`feed.ts`):**
  - `API_URL = 'ws://127.0.0.1:8080/ws/tv'` and `RECONNECT_MS = 1000`;
  - `connect(url: string, onMessage: (m: Message) => void, makeSocket: (url: string) => WebSocket = u => new WebSocket(u)): () => void`. The returned function closes the socket and stops reconnecting.

- [ ] **Step 1: Write the failing tests.**
  - **`pitch.spec.ts`**, for 105x68 and for 40x25 in `RADAR_AREA`:
    - the four corners `(±L/2, ±W/2)` map to the box corners, and `(0, 0)` maps to the box centre;
    - box width / height equals L / W within 1e-9;
    - every corner has `96 ≤ left ≤ 1824` and `54 ≤ top ≤ 1026`.
  - **`state.spec.ts`:**
    - a frame with `h1` and `a1` sets both dots to visible at their coordinates, along with `possession`, `half` and `clockMs`;
    - a next frame without `a1` and with a new `h2` sets `a1.visible === false` (kept, so it can fade out) and adds `h2` as visible;
    - `a1` coming back sets it visible again;
    - the ball trail holds the last 3 previous positions, newest first;
    - a null ball clears ball and trail;
    - a session for half 1 resets the state to `initialState` with that session.
  - **`feed.spec.ts`**, with a fake socket class and `jest.useFakeTimers()`:
    - a JSON message reaches `onMessage` parsed;
    - after `onclose`, a new socket is made at `RECONNECT_MS` and not at 999 ms;
    - after the returned function is called, no new socket is made.
- [ ] **Step 2: Run them with the TV checks and confirm they fail because the modules are missing.**
- [ ] **Step 3: Implement.**
  - `App` holds `useReducer(reduce, initialState)` and connects the feed in a `useEffect`.
  - Pitch lines, boxes and the centre circle are `View`s with borders.
  - Each `PlayerDot` owns an `Animated.ValueXY`. On a new position it runs `Animated.timing` over `FRAME_MS` with `Easing.linear`, through `transform` translate and with `useNativeDriver: true`. It fades its opacity in and out on `visible`.
  - The `Ball` has three ghost dots at opacity 0.45, 0.25 and 0.1, and a halo in the possession team's colour.
  - The clock bar shows `MM:SS`, the half and `session.credit`.
- [ ] **Step 4: Run the TV checks and `make check`; all pass.**
- [ ] **Step 5: Check on the VVD with the user.** Run uvicorn and the Task 2 replayer with the fixture at speed 1, and record in the PR:
  - whether the motion is smooth with 22 dots;
  - the delay between the replayer's logged clock and the clock bar (must be ≤ 2 s);
  - whether the safe area and the 28 px text land as designed, which also settles whether layout units are px or dp (a design risk);
  - whether the TV recovers when uvicorn restarts.

  If the WebSocket fails, check the Vega manifest privileges before adding any, then `/friction`.
- [ ] **Step 6: Open the PR.**

### Task 4: T7 — Compute and publish the tactical metrics (AC-7)

**Files:**
- Create: `services/vision/src/balomer_vision/metrics.py`
- Test: `services/vision/tests/test_metrics.py`
- Modify: `replay.py` and `test_replay.py`.

**Interfaces:**
- Consumes: `Frame`, `Player`, `Metrics`, `TeamMetrics`, `Teams`, `Period` and `Block` from `balomer_contracts.models`, and `schedule` from Task 2.
- **Produces (`metrics.py`):**
  - `Team = Literal["home", "away"]`.
  - `possession(frame: Frame, previous: Team | None, radius_m: float = 2.0) -> Team | None`: the team of the nearest *outfield* player, if within `radius_m`. Otherwise, or when the ball is null, `previous`.
  - `attack_direction(goalkeeper_x: Sequence[float]) -> Literal[1, -1]`: `-1` if the mean x is greater than 0, else `1`. The goalkeeper stands in front of the goal the team defends, and this matches `examples/metrics.json`.
  - `defensive_line(outfield_x: Sequence[float], direction: Literal[1, -1], pitch_length_m: float, n: int = 4) -> tuple[float, float]`, returning `(line_height, line_x)`. The deepest `n` players are the ones nearest the own goal at `-direction * L/2`, or all of them when there are fewer than `n`. `line_x` is their mean, and `line_height = direction * line_x + L/2`.
  - `@dataclass(frozen=True) class Shape: width: float; depth: float; compactness: float; block: Block`, and `shape(outfield: Sequence[Player]) -> Shape`: the extent in y, the extent in x, their product, and the min/max box.
  - `block_of(clock_ms: int, half: Literal[1, 2]) -> Period`: the stoppage-time rule above.
  - `rolling_period(clock_ms: int, half: Literal[1, 2]) -> Period`: from `max(half_start_min, t − 5)` to `t`, in minutes.
  - `aggregate(samples: Sequence[dict[Team, TeamSample]], period: Period, half: Literal[1, 2], clock_ms: int) -> Metrics`, where `TeamSample` is a frozen dataclass holding one frame's `possessed: bool`, `line_height`, `line_x`, `shape` and `attack_direction`.
    - `possession` = frames possessed / all frames × 100. A frame with no possession counts for neither team.
    - Every other value, including the block bounds, is the mean over the frames.
- **Produces (`replay.py`):**
  - `schedule` now fills `possession` on every frame it sends;
  - it inserts `Metrics` sends: `rolling` at every 5 s of match clock, `block` when the next block begins or at the end of the half, and `half` before `phase end`;
  - all metrics are computed over every frame, sent or skipped;
  - before `start_ms` it sends only the closed `block` snapshots and the last `rolling`, at `at_s = 0`, after `phase kickoff`.

- [ ] **Step 1: Write the failing tests in `test_metrics.py`:**
  - `test_possession_nearest_within_two_metres`: ball at (0, 0), away outfield at (1.0, 0), home outfield at (1.5, 0), and a home goalkeeper at (0.5, 0) that is ignored. The result is `"away"`.
  - `test_possession_keeps_previous`: the nearest player is 2.5 m away → `previous`; a null ball → `previous`.
  - `test_attack_direction`: `[-48.0, -47.5]` → `1`; `[49.0]` → `-1`.
  - `test_defensive_line`: home, direction 1, L 105, x `[-30, -25, -20, -9, 0, 10]` → `(31.5, -21.0)`; away, direction −1, x `[30, 29, 28, 27, 5, 0]` → `(24.0, 28.5)`.
  - `test_shape`: x spans −24.1…12.1 and y spans −22.0…22.8 → width 44.8, depth 36.2, compactness ≈ 1621.76, and the matching block.
  - `test_block_of_counts_stoppage_time`: half 1 at 46:00 → block 30–45; half 2 at 92:00 → block 75–90; half 2 at 45:00 → block 45–60.
  - `test_rolling_period`: 10:00 → 5–10; 2:00 → 0–2; half 2 at 47:00 → 45–47.
  - `test_aggregate`: four samples with home possessed in three and none in one → home 75.0, away 0.0, and the means of the other values.
- [ ] **Step 2: Add `test_schedule_publishes_metrics` to `test_replay.py`.** Use 16:00 of frames, with 5 players a side.
  - A `rolling` goes out at each 5 s of match clock.
  - The `block` 0–15 goes out before the first frame at or after 15:00.
  - `half` comes right before `phase end`.
  - Every sent frame has `possession` set once a player has been within 2 m.
  - With `start_ms` = 15:30, the first frame is preceded by exactly `session`, `phase kickoff`, the 0–15 block and one `rolling`.
- [ ] **Step 3: Run them and confirm they fail with `ModuleNotFoundError: No module named 'balomer_vision.metrics'` and with the missing metrics in the schedule test.**
- [ ] **Step 4: Implement `metrics.py`, then extend `schedule`.**
- [ ] **Step 5: Run the tests and `make check`; all pass.**
- [ ] **Step 6: Check in WSL** that replaying the fixture prints one `rolling` metrics message at 0:05 in the websockets client.
- [ ] **Step 7: Open the PR.**

### Task 5: T8 — Show stats and tactical overlays on the TV (AC-7)

**Files:**
- Create: `apps/tv/src/components/StatsPanel.tsx`, `PossessionBar.tsx`, `DefensiveLine.tsx` and `TeamBlock.tsx`.
- Modify: `state.ts`, `theme.ts` and `App.tsx`.
- Test: `apps/tv/test/StatsPanel.spec.tsx` and `state.spec.ts`.

**Interfaces:**
- **Adds to `TvState`:** `rolling: Metrics | null`, `previousRolling: Metrics | null` and `snapshots: Record<string, Metrics>`.
- **Adds to `state.ts`:**
  - `periodKey(p: Period): string`, which returns `` `${p.kind}:${p.from_min}-${p.to_min}` ``;
  - `resolveEvidence(e: Evidence, state: TvState): number | undefined`, which reads `snapshots[periodKey(e.period)].teams[e.team][e.metric]`.
- **Adds to `theme.ts`:**
  - `METRIC_LABEL: Record<Evidence['metric'], string>`;
  - `formatValue(metric: Evidence['metric'], value: number): string`. It rounds the value and adds `%` for possession (`54%`), ` m` for line height, width and depth (`24 m`), and ` m²` for compactness.

- [ ] **Step 1: Write the failing tests.**
  - **`StatsPanel.spec.tsx`:**
    - given `previous` and `current` rolling metrics, it renders both teams' five values through `formatValue`;
    - it shows `▲` where a value rose and `▼` where it fell, and nothing where it is unchanged;
    - with both possessions at 0, the possession bar's `scaleX` is 0.5 and never `NaN`.
  - **`state.spec.ts`:**
    - a `rolling` metrics message moves the old `rolling` to `previousRolling`;
    - `block` and `half` snapshots land under `periodKey`;
    - `resolveEvidence` returns the snapshot value.
- [ ] **Step 2: Run them with the TV checks and confirm they fail.**
- [ ] **Step 3: Implement.**
  - The possession bar animates `scaleX` from `home / (home + away)`.
  - The values cross-fade.
  - Each team's `DefensiveLine` sits at `toScreen({x: line_x, y: 0})` and moves with `Animated.spring`.
  - `TeamBlock` scales a `View` to the block: a translucent fill for Home, an outline for Away.
- [ ] **Step 4: Run the TV checks and `make check`; all pass.**
- [ ] **Step 5: Run the VVD check only with a replay longer than 15 s** (D3). Otherwise the PR says it is pending, and the box stays unticked (D4).
- [ ] **Step 6: Open the PR.**

### Task 6: T9 — Fire minute alerts and highlight their evidence (AC-8, AC-11 Back)

**Files:**
- Create:
  - `services/vision/src/balomer_vision/alerts.py`
  - `apps/tv/src/components/AlertBanner.tsx` and `AlertHistory.tsx`
- Modify: `replay.py`, `state.ts`, `App.tsx`, and `StatsPanel.tsx`, `DefensiveLine.tsx` and `TeamBlock.tsx` (pulse).
- Test:
  - `services/vision/tests/test_alerts.py`
  - `apps/tv/test/AlertBanner.spec.tsx` and `state.spec.ts`

**Interfaces:**
- **Produces (`alerts.py`):**
  - `TEMPLATES: dict[str, str]`, mapping a template id to a text with `{team}` and `{other}` slots;
  - `minute_alert(minute: Literal[15, 30, 60, 75], current: Metrics, previous: Metrics | None) -> Alert`.
- **The rule for `minute_alert`:**
  - **With `previous`:** across both teams and the five metrics, pick the largest `|c − p| / p` with `p > 0`. Cite that metric for that team in both periods.
  - **At 15', where `previous` is None:** pick the metric with the largest `|home − away| / max(home, away)`, and cite it for both teams in the current block.
  - **The "before" block:** for 60' it is half 1's 30–45 block.
- **Every template:**
  - is English, 12–15 words, with no digit;
  - uses Balomer's labels only;
  - claims nothing that its evidence does not cite.
- **The replayer** sends the alert right after the block snapshot it is built on. Before `start_ms`, it also sends the alerts for that span.
- **Adds to `TvState`:** `alerts: Alert[]` (newest first) and `banner: Alert | null`.
- **Adds to `Action`:** `{kind: 'back'}` and `{kind: 'bannerExpired'}`.
- **Adds to `state.ts`:**
  - `bannerDurationMs(text: string): number`, which is `Math.max(5000, 330 * words + 2000)`, where words are whitespace-separated tokens;
  - `handlesBack(state: TvState): boolean`.
- **Back on Vega:** `App` uses `useTVEventHandler` from `@amazon-devices/react-native-kepler` and dispatches `back` when `eventType === 'back'`. The type says only `eventKeyAction?: -1 | 1 | 0 | number`, so check on the VVD which value fires once per press. If Back also closes the app, consume it with `BackHandler.addEventListener('hardwareBackPress', …)` returning `handlesBack(state)`. `BackHandler` is exported by the same package (`Libraries/Utilities/BackHandler.d.ts`). Cite the Vega doc page for whichever API you use.

- [ ] **Step 1: Write the failing tests** (from tasks.md T9):
  - **`test_alerts.py`:**
    - over a full scheduled half, exactly one alert per minute mark, and none at 45 or 90;
    - no template, and no generated text, contains a digit;
    - every evidence `(metric, team, period)` has a `block` snapshot sent earlier in the schedule.
  - **`AlertBanner.spec.tsx`:**
    - evidence citing `line_height` for 0–15 (24.0) and 15–30 (18.0) renders `24 m → 18 m`;
    - with fake timers, an 8-word alert calls `onExpire` at 5000 ms and not at 4999;
    - a 14-word alert calls it at 6620 ms.
  - **`state.spec.ts`:**
    - Back with a visible banner clears `banner` and keeps the alert in `alerts`;
    - a new alert replaces the visible banner;
    - `bannerExpired` clears it;
    - the history is newest first;
    - `handlesBack` is true only while a banner is visible (Task 7 extends it).
- [ ] **Step 2: Run both suites and confirm they fail because the modules are missing.**
- [ ] **Step 3: Implement.**
  - The banner enters in 300 ms with ease-out (`translateY` −32 → 0 and opacity 0 → 1).
  - It calls `onExpire` at `bannerDurationMs` and exits in 220 ms with ease-in.
  - The cited stat rows and overlays pulse three times at 1.12 (D5).
- [ ] **Step 4: Run `make check` and the TV checks; all pass.**
- [ ] **Step 5: The VVD check** ("from 29:30 at speed 1") needs a 30-minute replay. Pending under D3/D4 unless T6 has landed.
- [ ] **Step 6: Open the PR.**

### Task 7: T10 — Build the report screens against a fixture (AC-9 TV side, AC-10 unavailable, AC-11)

**Files:**
- Create: `apps/tv/src/components/ReportScreen.tsx`, `ReportCard.tsx` and `FocusRing.tsx`.
- Modify: `state.ts` and `App.tsx`.
- Test: `apps/tv/test/ReportScreen.spec.tsx` and `state.spec.ts`.

**Interfaces:**
- **Adds to `TvState`:** `phase: Phase | null`, `report: Report | null` and `screen: 'live' | 'halftime' | 'fulltime'`.
- **Screen rules:**
  - `phase end` for half 1 → `halftime`, with the report possibly still null. While it is null, the radar dims to 30% and an "Analysing the first half…" pulse shows.
  - A `report` is stored. It changes the screen only while the latest phase is the matching `end`: halftime for half 1, fulltime for half 2.
  - `phase kickoff` → `live`.
  - Back on `halftime` or `fulltime` → `live`.
  - `handlesBack` is also true off `live`.
  - `phase end` for half 2 leaves the screen unchanged; T11 decides on the full-time report.
- **`FocusRing`:**
  - props `{focused: boolean; large: boolean}`;
  - an always-mounted bordered `View` whose opacity animates 0 → 1 in 150 ms;
  - its parent scales to 1.025 when `large`, else 1.05, and both return in 100 ms.
- **`ReportScreen`:**
  - an `ok` report renders three cards, each with problem, adjustment and evidence chips, for example `Line height · Away · 15–30' · 24 m`, resolved with `resolveEvidence`;
  - the first card has `hasTVPreferredFocus`;
  - the cards sit inside a `TVFocusGuideView` and stagger in 120 ms apart (D5);
  - an `unavailable` report renders one static card saying the report failed validation, with no recommendations.
- **The fixture** lives in the test file as a typed `ReportOk` constant. Nothing in `src/` holds a report.

- [ ] **Step 1: Write the failing tests.**
  - **`ReportScreen.spec.tsx`:**
    - three cards with their resolved evidence text;
    - each card is focusable, and only the first has `hasTVPreferredFocus`;
    - after `fireEvent(card2, 'focus')` and running fake timers, only card 2's ring has opacity 1 and scale 1.025, and the others have 0 and 1;
    - the `unavailable` report renders no recommendation text.
  - **`state.spec.ts`:**
    - phase end h1 → `halftime` with a null report;
    - then a report → stored, screen still `halftime`;
    - Back → `live`;
    - a late replay `[session h2, phase kickoff h2, report]` stays on `live`.
- [ ] **Step 2: Run them with the TV checks and confirm they fail.**
- [ ] **Step 3: Implement.** Jest may not advance `useNativeDriver` animations under fake timers. If so, export `focusTarget(focused: boolean, large: boolean): {ringOpacity: number; scale: number}` from `theme.ts`, assert on it, and assert that each card passes the right `focused`. Say so in the PR.
- [ ] **Step 4: Run the TV checks and `make check`; all pass.**
- [ ] **Step 5: Check on the VVD with the user.** With uvicorn running, send `packages/contracts/examples/phase.json` and then `report_ok.json` through `/ws/edge` with the websockets client. The cards stagger in, focus moves with the D-pad, every focused card shows the ring and the scale, and Back returns to the radar. Record it in the PR. This is a fixture: it is never shown as a generated report and never appears in the video.
- [ ] **Step 6: Open the PR.**

---

## Coverage of this plan

| AC | Task here | Still open after this plan |
|----|-----------|----------------------------|
| AC-4 | Task 2 | History of alerts before `--start`: Task 6 |
| AC-5 | Task 1 | — |
| AC-6 | Task 3 | — |
| AC-7 | Tasks 4, 5 | T8 VVD check (D3/D4) |
| AC-8 | Task 6 | T9 VVD check (D3/D4) |
| AC-9 | Task 7 (TV side) | T11 (Bedrock) |
| AC-10 | Task 7 (unavailable state) | T11 (validator, retry) |
| AC-11 | Tasks 3, 6, 7 | — |
| AC-2, AC-3 | — | T6 (SoccerTrack access) |
| AC-12, AC-13 | — | T12, T11 |
