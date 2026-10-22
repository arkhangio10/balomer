# Local demo — Design

## Runtime topology

Everything runs inside the WSL2 Ubuntu distro on the laptop, against the
Windows checkout mounted at `/mnt/c/.../bolomer`. The Vega SDK only supports
Linux and macOS, and the Virtual Device can only reach the Linux side through
reverse port forwarding.

```
replayer (services/vision) ──ws /ws/edge──▶ API (services/api, :8080) ──ws /ws/tv──▶ TV app on the VVD
                                                 │                                  (reverse port forward 8080)
                                                 └── halftime: agent (services/agent) ──▶ Bedrock (profile balomer)
```

- In WSL, `uv` uses `UV_PROJECT_ENVIRONMENT=$HOME/.venvs/balomer`, so the Linux
  environment never overwrites the Windows `.venv`.
- The TV app is built with `npm run build:app` (release). Metro hot reload is
  not used, because file watching does not work on `/mnt/c`.
- The VVD reaches the API at `ws://127.0.0.1:8080/ws/tv` after
  `vega device start-port-forwarding --port 8080 --forward false`. This path
  was verified with HTTP on 2026-10-20; WebSocket is assumed to work the same way.

## Components

| Component | Path | Change |
|-----------|------|--------|
| Schemas | `packages/contracts/schemas/*.schema.json` | New |
| Python models | `packages/contracts/src/balomer_contracts/models/` | New, generated: one module per schema, re-exported by `balomer_contracts.models`. Schemas that reference each other force a package instead of one file. `packages/contracts` joins the uv workspace as `balomer-contracts`. |
| TS types | `apps/tv/src/contracts.ts` | New, generated |
| Codegen | `Makefile` target `contracts` | New. CI fails if generated files differ from a fresh run. |
| Ingest | `services/vision/src/balomer_vision/soccertrack.py` | New. Streams GSR JSON with `ijson` and writes replay JSONL to `data/replay/`. |
| Replayer | `services/vision/src/balomer_vision/replay.py` | New. CLI that publishes frames, metrics and alerts. |
| Metrics | `services/vision/src/balomer_vision/metrics.py` | New. Pure functions only. |
| Alerts | `services/vision/src/balomer_vision/alerts.py` | New. Pure rules and text templates. |
| API | `services/api/src/balomer_api/app.py` | New. FastAPI WebSocket relay, latest-state cache, halftime trigger. |
| Agent | `services/agent/src/balomer_agent/report.py` | New. Strands `BedrockModel` with structured output, plus a validator. Called in-process by the API. |
| TV app | `apps/tv/` | New. Official Vega `helloWorld` generator output, committed unchanged first. |
| TV code | `apps/tv/src/{App.tsx,theme.ts,pitch.ts,state.ts,feed.ts}`, `apps/tv/src/components/*.tsx` | New |
| CI | `.github/workflows/ci.yml` | New `tv` job: `npm ci`, `jest`, `tsc --noEmit`, `eslint` |
| Docs | `README.md`, `NOTICE`, `docs/ARCHITECTURE.md`, `docs/OBJECTIVES.md`, `docs/DEMO_SCRIPT.md` | Local mode, SoccerTrack v2 credit, revised milestones, 2:50 cap |

## Data contracts

Coordinates are metres with the origin at the centre spot. `x` points to the
right of the main camera and `y` to the near touchline, as in SoccerTrack v2.
Pitch size travels in a `session` message, so a 7-a-side pitch needs no change.

| Schema | Boundary | New or changed |
|--------|----------|----------------|
| `session` — match id, half, pitch length and width, data credit | edge → API → TV | New |
| `phase` — `kickoff` or `end`, half | edge → API → TV | New |
| `frame` — half, clock ms, players `[{id, team, role, x, y}]`, ball `{x, y}` or null, `possession` (`home`, `away` or null) | edge → API → TV | New |
| `metrics` — half, clock ms, `period` (below), and per team: possession %, line height m, width m, depth m, compactness m², plus drawing geometry: `attack_direction` (+1 or −1), `line_x` m, `block` `{x_min, x_max, y_min, y_max}` m | edge → API → TV, and agent input | New |
| `alert` — minute (15, 30, 60, 75), template id, text, evidence | edge → API → TV | New |
| `report` — kind (`halftime` or `fulltime`), status (`ok` or `unavailable`), exactly 3 recommendations `[{problem, adjustment, evidence}]` when `ok` | agent → API → TV | New |
| `message` — `oneOf` envelope over the six above, discriminated by `type` | every WebSocket | New |

- **`period`** is `{kind, from_min, to_min}`, where `kind` is one of:
  - `rolling`: the last 5 minutes, published every 5 s of match time;
  - `block`: 0–15, 15–30, 30–45, 45–60, 60–75, 75–90, published when the block closes;
  - `half`: 0–45 or 45–90, published at the end of the half.
- **Evidence** is a list of `{metric, team, period}` with at least one item. It
  holds references, never numbers.
- **The TV app keeps** the latest `rolling` metrics and a map of every
  `block` and `half` snapshot, keyed by period. It resolves each evidence
  reference against that map. Every number on screen therefore comes from
  `services/vision`, and report numbers stay fixed while the second half plays.
- **Evidence across two blocks:** an alert that compares two blocks cites the
  same metric for both periods, and the banner shows it as `24 m → 18 m`.

## Metrics (pure functions, `services/vision`)

- **Attack direction** per team per half: the opposite of the sign of the team
  goalkeeper's mean `x` over the first 30 s of the half, since the goalkeeper
  stands in front of the goal the team defends. Teams swap ends at halftime.
- **Possession per frame**: the team of the outfield player nearest the ball if
  within 2 m; otherwise it keeps the previous value. **Possession %** is over
  the rolling window and cumulative.
- **Line height**: distance from the team's own goal line to the mean `x` of
  its four deepest outfield players. Four is a parameter: three for 7-a-side.
- **Width, depth, compactness**: extent of the outfield players in `y`, in `x`,
  and their product in m². The `block` rectangle is that same extent in pitch
  coordinates, and `line_x` is the defensive line's `x`. The TV app draws these
  as given and computes nothing.
- **Periods**: every metric is aggregated over the frames of its period. It is
  the mean of the per-frame values, except possession, which is a share of
  frames.

## Replayer

- **One half per run.** It reads `data/replay/<match>_<half>.jsonl` and sends
  `session`, then `phase kickoff`. Without `--start`, it sends the `rolling`
  metrics, `block` snapshots and alerts as play reaches them. It ends with the
  `half` snapshot and `phase end`.
- **`--start MM:SS`**: before the first frame it processes everything earlier
  without sleeping. It publishes only the `block` snapshots, the last `rolling`
  metrics and the alerts for that span, so the API and a connected TV hold the
  history.
- **`--speed N`**: wall time between frames stays 200 ms. The replayer sends
  every N-th frame (rounded), so the clock advances N times faster while the
  TV keeps animating 200 ms steps. Metrics and alerts are still computed over
  every frame.

## Agent

The agent is a function inside the API process: `balomer_agent.report.generate(snapshots) -> Report`.

- The API calls it from a background task when it receives `phase end` for
  half 1, or for half 2 if T11 covers AC-13.
- Its input is the list of `block` and `half` snapshots for the half. Its output
  is a `report`, both as generated models.
- The validator checks:
  - every evidence `(metric, team, period)` is in the input;
  - no text field contains a digit;
  - there are exactly three recommendations.

  On failure the agent is asked once more with the errors; on a second failure,
  `status: unavailable`.
- **Model**: Strands `BedrockModel`, region `us-east-1`, profile `balomer`. The
  model id is the Claude Opus 5.5 inference profile that
  `aws bedrock list-inference-profiles` shows for the account, set through the
  `BEDROCK_MODEL_ID` environment variable.
- **AgentCore**: out of scope. It would be a separate deployment.

## Alerts

When the 0–15, 15–30, 45–60 and 60–75 blocks close, a rule compares that block
with the one before it (at 15', where there is none, with the opponent's same
block). Metrics are normalised by attack direction, so blocks from different
halves compare. The rule picks the largest relative change, cites the metric
for both periods (or both teams), and fills a fixed English template, for
example
`"Home's line dropped since the first quarter-hour — they defend deeper than Away."`
The text never carries a number; the banner shows the numbers by resolving the
evidence references.

## TV app — screens and animations

Style: dark tactical board. Colours, safe area, motion, focus and labels follow
the research in
[docs/research/fc27-visual-patterns.md](../../docs/research/fc27-visual-patterns.md)
(section "En un televisor…" and the legal section). Its primary sources are the
[Fire TV design guidelines](https://developer.amazon.com/docs/fire-tv/design-and-user-experience-guidelines.html),
[Vega focus management](https://developer.amazon.com/docs/vega/0.24/focus-management.html),
[Vega Animated](https://developer.amazon.com/docs/react-native-vega/0.83/animated.html)
and [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

- **Theme** (`theme.ts`):
  - background `#0B1F17`
  - pitch lines `rgba(255,255,255,0.35)`
  - Home orange `#E69F00`, drawn as filled dots
  - Away sky blue `#56B4E9`, drawn as ring dots
  - ball `#FFFFFF`
  - alert accent `#F43F5E`
- **Team colours** come from the Okabe-Ito palette. On `#0B1F17` they reach
  7.63:1 (Home) and 7.44:1 (Away), but only 1.02:1 against each other: their
  luminance is almost the same. Shape is therefore the second cue (WCAG 1.4.1):
  Home is filled, Away is a ring, and the team blocks repeat it (Home a
  translucent fill, Away an outline).
- **Layout**: 1920x1080. Nothing sits in the outer 5%: the safe area leaves
  96 px left and right and 54 px top and bottom. Inside it, the radar fills
  about 70% of the width on the left, the stats panel sits on the right, and a
  clock bar runs along the top. No text is smaller than 28 px.
- **No new rendering dependency.** Lines, boxes and the centre circle are
  `View`s with borders and `borderRadius`. All motion uses the core `Animated`
  API with `useNativeDriver: true`, which Vega documents as supported, so only
  `transform` and `opacity` are animated. `setNativeProps` crashes on RN 0.83
  and is not used.

| Element | Animation |
|---|---|
| Player dot | `Animated.ValueXY` per id. On each frame, `Animated.timing` to the new screen point with duration equal to the frame interval (200 ms) and `Easing.linear`, so motion is continuous rather than stepped. It fades in on first sight and fades out when it leaves the replay. |
| Ball | Same as a player dot, plus a trail of three ghost dots at the previous positions (opacity 0.45, 0.25, 0.1). Its halo takes the colour of the team in `possession`. |
| Defensive lines | One thin vertical line per team at its line height, moved with `Animated.spring` when `metrics` arrive. |
| Team blocks | A box per team (scaled `View`) spanning width × depth, tweened on `metrics`: a translucent fill for Home, an outline for Away. |
| Stats panel | Possession bar via `scaleX`. Values cross-fade and show ▲ or ▼ against the previous value. Below the stats, the alert history lists every alert so far, newest first, with its minute badge and text. |
| Alert banner | Enters under the clock bar in 300 ms with an ease-out curve: `translateY` −32 → 0 px and opacity 0 → 1. It shows the minute badge, the text and the evidence chips with their values, and the referenced stat rows and overlays pulse three times (scale 1 → 1.12). It stays for `max(5 s, 0.33 s × words + 2 s)`, where a word is a whitespace-separated token of the text: about 6–7 s for the 12–15-word templates. It exits in 220 ms with an ease-in curve. Back dismisses it early. A new alert replaces a visible banner. Every alert, dismissed or expired, stays in the alert history. |
| Halftime | The radar dims to 30% opacity and an "Analysing the first half…" pulse shows while the agent works. The three cards then stagger in (`translateY` 40 → 0 and opacity, 120 ms apart). The focused card shows the focus treatment below. |
| Report unavailable | A static card that says the report failed validation. Nothing is invented. |

- **Focus**: every focusable element has a ring drawn in advance (a `View`
  with a border, always mounted) at opacity 0. On focus the ring fades to
  opacity 1 in 150 ms and the element scales to 1.05, or to 1.025 for large
  panels such as the report cards; both return in 100 ms on blur. Focus is
  never shown by colour alone, because Vega asks for a physical change that
  survives high-contrast mode. `borderWidth` is never animated, since the
  native driver only animates `transform` and `opacity`.
- **Labels**: every label is Balomer's own (Home, Away, Possession, Line
  height, Width, Depth, Compactness, Alerts, Halftime report, Full-time
  report). The app, the README and the video never use EA, FIFA, league,
  broadcaster or data-provider names, nor product names such as "Match Facts",
  "Momentum", "PlayStyles" or "HyperMotion", and never show screenshots or
  clips of FC 27 or of broadcasts. The only third-party credit is the
  SoccerTrack v2 line that CC BY 4.0 requires. The research borrows interaction
  patterns, never art, names or fonts.

- **Pure logic**:
  - `pitch.ts`: pitch metres → screen pixels.
  - `state.ts`: a reducer from `message` to screen state.
  - Both carry no analysis logic and are unit-tested with Jest.
- **Navigation**: screen state lives in `App` (`live`, `halftime`,
  `fulltime`). Focus uses `TVFocusGuideView` and `hasTVPreferredFocus`, and
  Back uses `BackHandler` (`hardwareBackPress`), all from
  `@amazon-devices/react-native-kepler`. The handler returns `true` only when
  it handled Back, so otherwise the system closes the app.
  Back dismisses a visible alert banner first; otherwise it returns from a
  report to `live`.
- **Credit line**: shown on the clock bar, `Data: SoccerTrack v2 (CC BY 4.0)`.

## Sequence

```
ingest (once): GSR JSON + ball .npz ──stream──▶ data/replay/117092_{1,2}.jsonl      deterministic
replayer → API: session, phase kickoff, [history up to --start], frame every 200 ms  deterministic
replayer → API: rolling metrics every 5 s; block snapshots; alerts 15' 30' 60' 75'  deterministic
replayer → API: half snapshot, phase end                                             deterministic
API → TV: every message, plus the latest state, all snapshots and all alerts on connect
API on phase end (half 1) → agent: block + half snapshots                           generative
agent → Bedrock (structured output) → validator → report → API → TV                 generative, validated
```

## Dependencies

Each one is stated in the PR that adds it.

- `ijson` (vision): streams a 2.7 GB JSON; `json.load` needs about 20 GB of RAM.
- `numpy` (vision): reads the ball `.npz` files.
- `websockets` (vision): the replayer's WebSocket client.
- `fastapi`, `uvicorn` and `websockets` (api): the WebSocket server; uvicorn needs a WebSocket library.
- `httpx` (dev): needed by FastAPI's `TestClient`.
- `strands-agents` (agent): the agent SDK the architecture names, covering H2.
- `pydantic` (contracts): the generated models.
- `datamodel-code-generator` (dev): Python codegen.
- `json-schema-to-typescript`: TS codegen. `make contracts` runs it with
  `npx` at a pinned version, by the user's decision; it is not a dependency
  of `apps/tv`.

## Risks

| Risk | Impact | What we do about it |
|------|--------|---------------------|
| WebSocket on Vega needs a manifest privilege the docs do not mention | No live data on the TV | T5 connects to the API first thing on the VVD; add a privilege only if the run fails, and log `/friction` |
| 23 parallel timing animations every 200 ms drop frames | Jumpy radar | Measure on the VVD; fall back to 400 ms frames or drop the ball trail |
| Dataset access is gated and the download is 5.4 GB | Ingest blocked | The user accepts the terms on Hugging Face; download in the background as soon as access works |
| The ball track is reconstructed between events, not measured | The ball moves in straight lines | Say so in the README and the video; possession uses a 2 m radius |
| Teams swap ends at halftime and `team_side` is the side of the pitch | Home and Away flip in half 2 | Map teams by `player_id` across halves; test it |
| AWS login or Bedrock access is not ready | No halftime report | The user unblocks it in parallel today; everything else is built first; the report screen is built against a fixture that is never shown as a generated report |
| `/mnt/c` is slow for `npm` and has no file watching | Slow TV loop | Release builds only; Jest for logic |
| The research left three Vega points unverified: whether layout units are px (1920x1080) or dp (960x540), the system font, and whether `Easing` curves match React Native | Wrong sizes or timings on the device | Every size and duration lives in `theme.ts`; T5 checks the safe area and the 28 px text on the VVD before T8 builds on them |
| SoccerTrack v2 is 11 v 11 at university level, while the product targets 7-a-side amateurs | Story mismatch in the video | Pitch size and line count are parameters; the video says what the data is |

## Alternatives rejected

- `react-native-svg` and Reanimated: supported on Vega, but three new
  dependencies and a babel plugin, and `View` plus `Animated` covers the radar.
- A synthetic match generator: the user chose real tracks.
- `json.load` on GSR: needs about 20 GB of RAM.
- The provider's `tracker_box_data.xml`: an uncurated raw export; GSR is the curated version.
- Computing possession on the TV: the TV holds no analysis logic.
- Letting the agent write numbers: P7 and the edge/cloud split forbid it, so
  evidence is by reference.
