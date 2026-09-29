# 002 · Objectives, toolchain, remote

## Context
The skeleton is green but blocked: `docs/OBJECTIVES.md` is a placeholder, so `/spec` cannot link acceptance criteria and CLAUDE.md forbids feature code. There is no git remote, so CI has never run. `uv`, `make` and `pre-commit` are not on PATH.

This prompt unblocks all three. It writes no feature code.

Respond in English.

## Tasks

### 1. Write `docs/OBJECTIVES.md`
- Use the content in the appendix below. Keep my IDs exactly (H1, P1, V1, E1, S1, B1, D1...). Do not renumber to OBJ-n.
- Read `.claude/commands/spec.md` and `specs/_template/`. If they assume the `OBJ-n` format, update them to accept IDs matching `^(H|P|V|E|S|B|D)\d+$`.
- Commit: `docs: define hackathon objectives and milestones`

### 2. Fix the toolchain
- Install `uv` with the official Astral installer and make sure `~/.local/bin` is on PATH in my shell profile.
- Install `pre-commit` with `uv tool install pre-commit`.
- `make` needs sudo: do NOT run it. Print the exact apt command for me to run.
- Verify: `uv --version`, `pre-commit --version`, and after I install make, `make help` (or the Makefile's default target) and `make check` (or whatever target runs ruff, mypy, pytest).
- If the Makefile or CLAUDE.md references a command that still fails, fix the Makefile, not my environment.
- Commit only if repo files changed: `chore: fix toolchain setup`

### 3. Create the GitHub remote
- Check `gh` is installed and authenticated (`gh auth status`). If not, stop and tell me what to run.
- Check `LICENSE` is Apache-2.0 (D3). If missing, add it.
- Before creating the repo, run gitleaks on the full history and confirm 0 findings (S1). Confirm `data/`, videos and `.env*` are git-ignored (S4).
- STOP and confirm with me: repo name `balomer`, visibility public.
- Then: `gh repo create` with `--source=. --remote=origin --push`.
- Set description and topics with `gh repo edit`. Description: "One camera, one Fire TV, no analyst: live tactical insight for amateur soccer coaches." Topics: fire-tv, vega-os, react-native, aws, amazon-bedrock, computer-vision, soccer, sports-analytics.

### 4. Verify CI (E2)
- Watch the first run with `gh run watch`.
- If it fails, fix it in a branch `fix/ci-first-run`, open a PR, squash merge.
- Branch protection on main (require CI, squash only): only if you can verify the exact API payload against current GitHub docs. Otherwise list the manual steps for me.

### 5. Tag
- When main is green: tag `v0.0.1` (bootstrap) and push the tag. v0.1.0 is reserved for the walking skeleton.

## Rules
- No feature code. No new runtime dependencies.
- Conventional Commits. After the first push, every change goes through a PR.
- Ask before anything that needs sudo, creates external resources, or changes GitHub settings.

## Done when
- [ ] `docs/OBJECTIVES.md` filled, `/spec` accepts the IDs
- [ ] `uv`, `pre-commit`, `make` on PATH; Makefile targets documented in CLAUDE.md all work
- [ ] gitleaks 0 findings on full history
- [ ] Public repo `balomer`, Apache-2.0 visible in About
- [ ] CI green on main
- [ ] Tag `v0.0.1` pushed

## Report format
One table: task, result, evidence (command output line or URL). Then a list of anything I must do manually.

---

## Appendix: content for `docs/OBJECTIVES.md`

```markdown
# Objectives

Every spec, task and PR references at least one ID below. Work that serves no objective is out of scope.

## Mission
Top clubs pay six figures a year for match analysis. Amateur coaches have no analyst at all. Balomer puts one camera above the pitch and a Fire TV in the dressing room, and delivers live tactical insight and a halftime game plan with no analyst required.

## Hackathon
| ID | Objective | Target |
|---|---|---|
| H1 | Win Fire TV Track 1st place | Strong on all 4 criteria |
| H2 | AWS Builder mini challenge | Documented Bedrock + AgentCore + Strands pipeline |
| H3 | Open Source mini challenge | 1 merged or open contribution with tests |
| H4 | Friction logs | 8+ complete entries |
| H5 | Submit early | Submitted by Oct 22, 2026 |

## Product (Tier 1)
| ID | Objective | Target |
|---|---|---|
| P1 | Live player and ball tracking | 15+ fps on the edge |
| P2 | Live 2D radar on Fire TV | Camera-to-TV latency max 2 s |
| P3 | Live stats: possession, shape, line height, compactness | Refresh max 5 s |
| P4 | Alerts | At 15', 30', 60', 75' |
| P5 | Halftime report | Within 60 s of 45': top 3 problems, 1 adjustment each |
| P6 | Full-time report | Match story, key metrics, training focus |
| P7 | Evidence-based recommendations | 100% cite at least one match metric (schema-enforced) |
| P8 | Replay as live | A recorded file runs through the live pipeline |
| P9 | Pro mode (first cut candidate) | One SkillCorner match end to end, radar only |
| P10 | D-pad navigation | Every screen usable with the D-pad alone |

## Computer vision
Measured first on SoccerTrack v2 annotations, then on own footage when available. Revise targets after the first baseline.

| ID | Objective | Target |
|---|---|---|
| V1 | Player detection recall | 90%+ |
| V2 | Team assignment | 95%+ with contrasting bibs |
| V3 | Ball detection | 70%+ of visible frames, gaps interpolated |
| V4 | Pitch position error | Max 1 m at the center |

## Engineering
| ID | Objective | Target |
|---|---|---|
| E1 | Monorepo | apps/, services/, packages/, infra/, specs/, docs/ |
| E2 | CI | On every PR, main always green |
| E3 | Coverage | 80%+ on metrics engine and agent contracts |
| E4 | Versioning | Conventional Commits, squash merges, tags v0.1.0 to v0.4.0, v1.0.0 at submission |
| E5 | Infrastructure as code | 100% of AWS resources in CDK |
| E6 | Judge setup | Demo runs from the README in 15 min |

## Security and privacy
| ID | Objective | Target |
|---|---|---|
| S1 | No secrets in git | gitleaks, 0 findings |
| S2 | CI to AWS | GitHub Actions via OIDC only |
| S3 | Least privilege | One IAM role per service, no wildcards |
| S4 | Video at the edge | Video stays at the edge by default |
| S5 | S3 | Private, encrypted, presigned URLs only |
| S6 | Consent | Signed consent from every filmed player |
| S7 | Guardrails | Bedrock Guardrails on every agent response |
| S8 | Dependencies | 0 high or critical vulnerabilities |

## Business
| ID | Objective | Target |
|---|---|---|
| B1 | Customer discovery | 5 academy coaches + 3 pitch owners interviewed by Oct 11 |
| B2 | Traction | 1 pilot agreement or letter of intent |

## Submission
| ID | Objective | Target |
|---|---|---|
| D1 | Demo video | Max 2:50, public on YouTube, running on VVD or device |
| D2 | Description | Plus product feedback for every tool |
| D3 | Public repo | Apache-2.0 visible in About |
| D4 | Friction log | Plus feature requests |
| D5 | Open Source | Contribution URL + description |

## Data and content rules
- Live mode and demo video: own 7-a-side footage only (adults, signed consent, S6).
- CV development and evaluation: SoccerTrack v2 (CC BY 4.0, attributed).
- Pro mode: SkillCorner Open Data (attributed).
- No broadcast, YouTube or league footage anywhere, including tests.
- No third party trademarks, crests or competitor names in the app or video. Teams are "Home" and "Away".

## Out of scope until Oct 23
Broadcast analysis, other sports, multi-camera, voice, full phone app, Android TV and web ports, WhatsApp delivery.

## Milestones (revised Sep 29)
| Tag | Date | Scope |
|---|---|---|
| v0.1.0 | Oct 4 | Walking skeleton: synthetic tracking → IoT Core → DynamoDB → WebSocket → Vega radar screen. CI green on GitHub. |
| v0.2.0 | Oct 11 | CV baseline on SoccerTrack v2 (V1-V4), replay as live (P8), metrics engine (P3) |
| v0.3.0 | Oct 16 | Agent on AgentCore, halftime report (P5, P7), alerts (P4) |
| v0.4.0 | Oct 19 | Full-time report (P6), Open Source contribution (H3), pro mode (P9, cut first), D-pad polish (P10) |
| v1.0.0 | Oct 22 | Demo video, docs, submission (D1-D5) |

## Key dates
- Oct 4: Open Source target decision (Vega drawing library port vs kloppy)
- Oct 11: B1 interviews done; own footage recorded or switch demo to SoccerTrack v2
- Oct 21, 12:00 pm PT: AWS credits form closes
- Oct 23, 12:00 pm PT: hard deadline
```
