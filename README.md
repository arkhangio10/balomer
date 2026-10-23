# Balomer

Turn one fixed camera above an amateur football pitch into live tactical
analysis on a Fire TV.

This release runs everything on one laptop. A recorded match from SoccerTrack v2
replays as if it were live, through the same edge, API and TV code that a camera
would feed.

## Hackathon

Amazon "Build, Ship, Shape" Developer Hackathon.

- **Fire TV** track
- **AWS Builder** mini challenge
- **Open Source** mini challenge

## What it does

- **Live 2D radar** — players and ball move on a pitch drawn to scale: Home as
  filled orange dots, Away as sky-blue rings
- **Live stats** — possession, defensive line height, width, depth and
  compactness over the last 5 minutes, with each team's defensive line and
  block drawn on the pitch
- **Minute alerts** — at 15', 30', 60' and 75', each citing the metrics behind it
- **Halftime report** — three recommendations, each a problem and one
  adjustment citing a measured metric. Claude Sonnet 4.6 on Amazon Bedrock
  writes them through Strands, and a validator rejects any evidence that is not
  in the input and any digit in the text

## Architecture

```
replayer (services/vision) ──ws /ws/edge──▶ API (services/api, :8080) ──ws /ws/tv──▶ TV app on the Vega Virtual Device
```

The edge worker (`services/vision`) turns SoccerTrack v2 annotations into
replay files, computes every metric and alert as small pure functions, and
publishes them. The API (`services/api`) relays each message to the TV and
sends the state so far to a TV that connects late. The Fire TV app (`apps/tv`)
is a React Native client on Vega OS. It draws what arrives; it holds no
analysis logic.

**Only coordinates and metrics leave the edge.** The demo uses no video at all:
it reads annotations. See [docs/SECURITY.md](docs/SECURITY.md).

The AWS deployment (IoT Core, DynamoDB, AgentCore, API Gateway) is the target
architecture, not part of this release. Detail:
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Run the demo

You need Linux or WSL2 Ubuntu with:

- Python 3.12 and [uv](https://docs.astral.sh/uv/);
- Node.js 20 or later, with npm;
- the Vega SDK and the Vega Virtual Device, with the `vega` CLI on your `PATH`
  ([Vega developer guides](https://developer.amazon.com/docs/vega/0.24/dev-guides-overview.html)).
  Tested with Vega CLI 1.4.5 and SDK 0.24.12112;
- the [Hugging Face CLI](https://huggingface.co/docs/huggingface_hub/guides/cli)
  (`hf`), logged in to an account that has accepted the SoccerTrack v2 terms;
- for the halftime report, an AWS account with a valid payment method (Bedrock
  sells Claude through an AWS Marketplace subscription) and access to Claude
  Sonnet 4.6 in `us-east-1`, and the AWS CLI v2 signed in with
  `aws login --profile balomer`.

Run each step from the repository root, each server in its own terminal.

1. Install the Python workspace:

   ```sh
   git clone https://github.com/arkhangio10/balomer.git
   cd balomer
   uv sync
   ```

2. Download match 117092 without its video, about 5.4 GB. Never download
   `videos/`: the whole dataset is 145 GB.

   ```sh
   hf download atomscott/soccertrack-v2 --repo-type dataset --include "gsr/117092*" --include "ball/117092*" --local-dir data/soccertrack-v2
   ```

3. Write the replay files `data/replay/117092_1.jsonl` and `117092_2.jsonl`.
   This takes a few minutes. It streams the 2.7 GB JSON of each half and stays
   under 200 MB of RAM.

   ```sh
   uv run python -m balomer_vision.soccertrack 117092
   ```

4. Start the API (terminal 1). When the first half ends, it asks Bedrock for
   the halftime report with the profile and model below.

   ```sh
   export AWS_PROFILE=balomer
   export AWS_DEFAULT_REGION=us-east-1
   export BEDROCK_MODEL_ID=us.anthropic.claude-sonnet-4-6
   uv run uvicorn balomer_api.app:app --host 127.0.0.1 --port 8080
   ```

5. Build the TV app, start the Virtual Device, forward its port 8080 to the
   laptop and install the app (terminal 2). Keep this terminal open: the
   device stops when its session ends. `vega virtual-device start` can exit 0
   after printing "Deadline reached"; then the device did not start, and its
   `virtual_device.err` says why.

   ```sh
   cd apps/tv
   npm ci
   npm run build:app
   vega virtual-device start
   vega device start-port-forwarding --port 8080 --forward false
   vega run-app build/x86_64-release/balomertv_x86_64.vpkg com.balomer.tv.main
   ```

6. Replay the first half as live (terminal 3):

   ```sh
   uv run python -m balomer_vision.replay data/replay/117092_1.jsonl --start 00:00 --speed 1
   ```

   `--start 29:30` starts just before the 30' alert, after sending the
   metrics and alerts before it. `--speed 4` plays four times faster. The
   second half is `data/replay/117092_2.jsonl`.

## Known limitations

- **Halftime report only.** Nothing generates the full-time report yet.
  Without Bedrock credentials, the TV stays on "Analysing the first half…"
  after the first half and the API logs the error; Back returns to the radar.
  The demo never shows a test fixture as a generated report.
- **The ball moves in straight lines.** SoccerTrack v2 reconstructs the ball
  track between events instead of measuring it on every frame. Possession, the
  team of the nearest outfield player within 2 m, inherits that.
- **Substitutions overlap.** A player missing for 2 s or less keeps their last
  position, so a substituted player can stay on screen for up to 2 s after the
  substitute appears.
- **Running the second half twice** keeps the previous run's 60' and 75' alerts
  and its second-half snapshots. Run the first half again, or restart the API
  and relaunch the app.

## Data

The demo match is from
[SoccerTrack v2](https://huggingface.co/datasets/atomscott/soccertrack-v2),
licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The
TV shows `Data: SoccerTrack v2 (CC BY 4.0)` on its clock bar. Balomer converts
the annotations (pitch coordinates, roles, team sides and the ball track) into
its own replay format. The data is not in this repository: `data/` is
git-ignored and you download it yourself. The release is pseudonymised, and the
app shows teams only as Home and Away.

## Development

Prerequisites: Python 3.12, [uv](https://docs.astral.sh/uv/), `make`, git.

```sh
make setup              # sync the workspace and install git hooks
make check              # lint, type check, tests
```

The TV app's checks run in `apps/tv`: see [apps/tv/README.md](apps/tv/README.md).

Spec-driven: requirements → design → tasks → code. One task per pull request,
tests first for anything deterministic, Conventional Commits, squash merge onto
`main`. See [CLAUDE.md](CLAUDE.md) and [specs/local-demo/](specs/local-demo/).

## Repository

| Path | What lives there |
|------|------------------|
| `apps/tv/` | Fire TV app on Vega OS, generated with the Vega CLI. |
| `apps/capture/` | Host-side camera capture. Not used in local mode. |
| `services/vision/` | Edge worker: SoccerTrack v2 ingest, replayer, metrics and alerts. |
| `services/api/` | FastAPI WebSocket relay between the edge and the TV. |
| `services/agent/` | Strands agent that writes the halftime report on Bedrock. |
| `packages/contracts/` | JSON Schema contracts. Source of truth for boundary types. |
| `infra/` | AWS CDK app in Python. Not used in local mode. |
| `specs/` | One directory per feature: requirements, design, tasks. |
| `docs/` | Objectives, architecture, security, hackathon logs, demo script. |

## License

[Apache-2.0](LICENSE). See [NOTICE](NOTICE).
