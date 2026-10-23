# Product feedback

Structured answers to the five hackathon questions, one section per Amazon tool.
Filled in as we go, not at the end.

The five questions:

1. What did we use it for?
2. What worked well?
3. What needs work?
4. What was onboarding like, from zero to hello world?
5. Would we build with it again, and why?

The friction behind "what needs work" is in [FRICTION_LOG.md](FRICTION_LOG.md),
with the exact error messages.

---

## Vega OS and Vega Developer Tools

1. **What we used it for:**
   - Vega CLI 1.4.5 and SDK 0.24.12112 to generate the Fire TV app from the `helloWorld` template, build release `.vpkg` packages, and run them on the Vega Virtual Device.
   - React Native for Vega (`@amazon-devices/react-native-kepler` 4.0.x) for the screens: the core `Animated` API with the native driver, `TVFocusGuideView` for D-pad focus, and `BackHandler` for the remote's Back button.
   - The Vega Jest preset and ESLint plugin, in CI.
2. **What worked well:**
   - The generator gives a working React Native project with Jest, TypeScript and ESLint, so CI ran the TV checks from the first day.
   - `vega --help` and every subcommand's `--help` are complete and come with examples.
   - One `npm run build:app` builds the release package for three architectures.
   - WebSocket from the app to the laptop needed no manifest privilege.
   - `vega device` gives the tools to debug a device: `is-port-forwarded`, `run-cmd`, `start-log-stream`, `is-app-running`.
3. **What needs work:**
   - No Windows support, and the WSL2 setup needs undocumented packages.
   - `virtual-device start` exits 0 when the device did not boot.
   - The emulator dies with its launching shell.
   - `run-app` with an app id fails with a raw `TypeError`.
   - A reverse port forward was found off without any message.
   - Layout units are dp (960x540 on a 1080p screen), which the TV design guidance does not say.
   - Four Jest preset mocks differ from React Native (`BackHandler`, `Dimensions`, `StyleSheet.flatten`, `requestAnimationFrame`).
4. **Onboarding, zero to hello world:** One day on 2026-10-20, in WSL2 Ubuntu 24.04 on Windows. Once the four missing system packages and the `kvm` group were in place, generate, build, install and launch worked as documented.
5. **Would we build with it again, and why:** Yes. Once set up, the build, install and device tools are complete, and React Native made a 10-foot UI with focus and animation quick to write. We would start from a Linux or macOS machine and a script that checks the port forward.

## Fire TV

1. **What we used it for:** The target screen. The Fire TV design guidelines set the layout: the 5% safe area, minimum text size, focus that is a ring plus a scale change (never colour alone), and D-pad-only navigation. We ran on the Vega Virtual Device, not on a physical Fire TV.
2. **What worked well:** The guidelines are concrete enough to turn into constants: safe-area margins, text size, focus treatment. The Virtual Device's on-screen remote tests D-pad and Back without hardware.
3. **What needs work:** The guidelines give sizes in pixels on a 1920x1080 screen. Vega lays out in dp, at half that, and nothing on the page says so.
4. **Onboarding, zero to hello world:** Covered by the Vega section above: the Virtual Device is the Fire TV for development.
5. **Would we build with it again, and why:** Yes. A TV in the dressing room is the right screen for a coach at halftime.

## Amazon Bedrock (models, Knowledge Base, Guardrails)

1. **What we used it for:** The halftime report. Claude Sonnet 4.6 (`us.anthropic.claude-sonnet-4-6`) in `us-east-1`, through the Converse API, called by Strands with structured output. Knowledge Base and Guardrails were not used: they need deployed AWS resources, which the local-mode pivot of 2026-10-20 cut.
2. **What worked well:**
   - `aws bedrock list-inference-profiles` shows every cross-region profile and its status in one call.
   - The same Converse request shape works for every model, so changing models is one environment variable.
3. **What needs work:**
   - Access is only discovered by calling. Models listed as `ACTIVE` answered "your account is currently being verified", then "not available for this account ... contact AWS Sales".
   - The model that did answer a test call then failed in the real run with "INVALID_PAYMENT_INSTRUMENT ... Your AWS Marketplace subscription for this model cannot be completed".
   - The generated report could not be shown in the demo.
4. **Onboarding, zero to hello world:** The first successful call came within minutes of signing in, but only after recovering the root sign-in and creating CLI credentials with `aws login`. A real run then hit the payment requirement.
5. **Would we build with it again, and why:** Yes, for the Converse API and the model choice. We would set up billing and model access on the first day, not the last.

## Strands Agents and AgentCore

1. **What we used it for:** Strands Agents 1.62.0 with `BedrockModel`. `Agent(..., callback_handler=None)` and `agent(prompt, structured_output_model=Draft)` turn the first half's metric snapshots into three recommendations as a Pydantic model; our validator then checks them. AgentCore was not used: the agent runs inside the API process in local mode.
2. **What worked well:**
   - Structured output straight into a Pydantic model.
   - The package is typed (`py.typed`), so `mypy --strict` passes without stubs.
   - The model is one constructor argument, and a stub function replaces it in tests.
3. **What needs work:**
   - The dependency tree is large for one model call: MCP, OpenTelemetry and watchdog come with it.
   - Credentials from `aws login` need `botocore[crt]` and `AWS_DEFAULT_REGION` in the environment, which the Strands docs do not mention.
4. **Onboarding, zero to hello world:** The installed package's signatures and docstrings were enough to write the agent; the older `Agent.structured_output` method warns that it is deprecated.
5. **Would we build with it again, and why:** Yes. Structured output plus a validator is the pattern we needed to keep the agent from writing numbers.

## AWS IoT Core

Not used in this release. The local-mode pivot of 2026-10-20 replaced the edge-to-cloud ingest with a local WebSocket relay; see [ARCHITECTURE.md](ARCHITECTURE.md).

## AWS CDK, DynamoDB and API Gateway

Not used in this release, for the same reason: nothing is deployed to AWS except the Bedrock call.

## AWS CLI (`aws login`) and AWS Sign-In

1. **What we used it for:** `aws login --profile balomer --remote` for short-lived CLI and SDK credentials, with no access keys in the repository.
2. **What worked well:** `aws login` gives temporary credentials from a console session with no long-lived keys. `--remote` works from WSL by pasting a code.
3. **What needs work:**
   - The root MFA recovery flow sent us back to the password page with "Authentication failed" before any password was typed.
   - Python needs `botocore[crt]` and `AWS_DEFAULT_REGION` to use an `aws login` profile; the CLI needs neither.
4. **Onboarding, zero to hello world:** Short once signed in. Signing in took most of the effort, because of a passkey registered months earlier.
5. **Would we build with it again, and why:** Yes. Temporary credentials from a console session are the right default for a laptop.
