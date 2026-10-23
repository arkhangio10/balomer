# Friction log

Every time an Amazon tool gets in the way, it gets an entry here. Written while
it is still fresh, not reconstructed at the end. Append with `/friction`.

Severity: **Blocker** (could not proceed) · **Major** (cost more than an hour or
forced a design change) · **Minor** (annoying, worked around quickly).

---

## [EXAMPLE — delete once there is a real entry] Vega simulator will not start after a clean install

- **Date:** 2026-09-20
- **Tool:** Vega Developer Tools 1.x
- **Task attempted:** Run the generated starter app on the Vega simulator for the first time.
- **Steps taken:** Installed the tools, created the app from the template, ran the simulator start command, retried after a reboot.
- **Expected:** The simulator window opens and the starter app renders.
- **Actual:** The command exits with a non-zero status and no message. Nothing in the log directory.
- **Severity:** Blocker
- **Workaround:** None found on the first day; unblocked the next morning after a full reinstall.
- **Actionable suggestion:** Print the reason for the failure, or at minimum the path of the log file, instead of exiting silently. A `--verbose` flag that actually says what step failed would have saved the day.

## Vega SDK on WSL2 needs undocumented packages

- **Date:** 2026-10-20
- **Tool:** Vega CLI 1.4.5, Vega SDK 0.24.12112, Vega Virtual Device, on WSL2 Ubuntu 24.04
- **Task attempted:** Install the Vega SDK and run a hello world app on the Vega Virtual Device from a Windows laptop.
- **Steps taken:** Installed the SDK in WSL2 Ubuntu 24.04 (the SDK supports Linux and macOS, not Windows). Added the user to the `kvm` group, installed `jq` (the installer needs it), `lz4`, `watchman` and `cpu-checker`, then the emulator's missing libraries one by one.
- **Expected:** The installer lists or installs every system package the emulator needs.
- **Actual:** The emulator also needed `libpulse0`, `libnss3`, `libnspr4` and `libtinfo5`. Ubuntu 24.04 has no `libtinfo5`; it came from jammy-updates (`6.3-2ubuntu0.3`). None of these is in the Amazon docs.
- **Severity:** Major
- **Workaround:** Install the four packages by hand, `libtinfo5` from the jammy-updates archive.
- **Actionable suggestion:** List every runtime package of the Virtual Device on the install page, per Ubuntu release, and have the installer check for them. Say whether WSL2 is supported; it works once the packages are there.

## `vega virtual-device start` exits 0 when the device did not start

- **Date:** 2026-10-20
- **Tool:** Vega CLI 1.4.5
- **Task attempted:** Start the Virtual Device from a script and continue when it is up.
- **Steps taken:** Ran `vega virtual-device start` and checked its exit code.
- **Expected:** A non-zero exit code when the device fails to boot.
- **Actual:** It printed "Deadline reached ... unresponsive" and exited 0. The reason was only in `virtual_device.err` in the instance directory.
- **Severity:** Major
- **Workaround:** Read `virtual_device.err` after every start, and check `vega virtual-device status`.
- **Actionable suggestion:** Exit non-zero on a boot timeout, and print the path of `virtual_device.err` with its last lines.

## The Virtual Device dies with the shell session that started it

- **Date:** 2026-10-20
- **Tool:** Vega Virtual Device, Vega CLI 1.4.5, on WSL2
- **Task attempted:** Start the device from one command, then install and run the app from later commands.
- **Steps taken:** Ran `vega virtual-device start` through `wsl.exe` from Windows, then `vega run-app` in a new `wsl.exe` call.
- **Expected:** The device keeps running until `vega virtual-device stop`.
- **Actual:** The emulator stopped as soon as the `wsl.exe` session that launched it ended.
- **Severity:** Major
- **Workaround:** Keep one long-lived session open for the whole device session (a terminal, or a background process that waits).
- **Actionable suggestion:** Detach the emulator from the launching session, or document that it is tied to it, with a `--detach` option.

## The `helloWorld` template's `metro.config.js` ships diff markers

- **Date:** 2026-10-21
- **Tool:** Vega CLI 1.4.5, `vega project generate --template helloWorld`
- **Task attempted:** Generate the Fire TV app and commit the generator output unchanged.
- **Steps taken:** Generated the project and ran the repository's pre-commit hooks on it.
- **Expected:** Clean generated files.
- **Actual:** `metro.config.js` contained stray `+` diff markers and trailing whitespace, so the hooks flagged it.
- **Severity:** Minor
- **Workaround:** Removed the stray markers and whitespace by hand.
- **Actionable suggestion:** Lint the templates before release; a whitespace check on the generated project would catch it.

## The ESLint rule warns on the imports the Vega docs require

- **Date:** 2026-10-22
- **Tool:** `@amazon-devices/eslint-plugin-kepler`, rule `@amazon-devices/kepler/sdl-package-version-check-imports`
- **Task attempted:** Keep `npm run lint` clean in CI.
- **Steps taken:** Imported `BackHandler` and `TVFocusGuideView` from `@amazon-devices/react-native-kepler`, as the Vega docs do.
- **Expected:** No warning for the documented import.
- **Actual:** A warning on every such import: "@amazon-devices/react-native-kepler is a system distributed library. This is not an error...".
- **Severity:** Minor
- **Workaround:** Accept the warnings; lint has 0 errors.
- **Actionable suggestion:** Warn once per project, or link to the exact rule option that silences it once understood.

## The Vega Jest preset's `BackHandler` mock has no `default`

- **Date:** 2026-10-22
- **Tool:** Vega Jest preset in `@amazon-devices/react-native-kepler` 4.0.x
- **Task attempted:** Test Back handling in the TV app with Jest.
- **Steps taken:** Called `BackHandler.addEventListener` in a component under test, then looked for the mock to override.
- **Expected:** The preset's mock works for the documented import.
- **Actual:** `index.js` reads `require('./Libraries/Utilities/BackHandler').default`, but `jest/mocks/BackHandler.js` has no `default`.
- **Severity:** Minor
- **Workaround:** `jest.mock` of `Libraries/Utilities/BackHandler.kepler` returning `{__esModule: true, default: {addEventListener: jest.fn()}}`.
- **Actionable suggestion:** Export a `default` from the mock, with `addEventListener` returning `{remove}`.

## The Vega Jest preset runs `requestAnimationFrame` on `setTimeout`

- **Date:** 2026-10-22
- **Tool:** Vega Jest preset in `@amazon-devices/react-native-kepler` 4.0.x
- **Task attempted:** Test `Animated` components (banner, cards) with Jest.
- **Steps taken:** Rendered the components and waited for their animations.
- **Expected:** Animations settle in tests, or the docs say how to drive them.
- **Actual:** `requestAnimationFrame` runs on `setTimeout`, so tests only settle with fake timers.
- **Severity:** Minor
- **Workaround:** `jest.useFakeTimers()` and `advanceTimersByTime` in every component test.
- **Actionable suggestion:** Document it on the testing page, with a fake-timer example.

## Vega lays out in dp, and the TV design guidance speaks in pixels

- **Date:** 2026-10-23
- **Tool:** Vega OS on the Vega Virtual Device (SDK 0.24.12112), Fire TV design guidelines
- **Task attempted:** Lay out a 1920x1080 screen with the documented safe area (96 px left and right, 54 px top and bottom).
- **Steps taken:** Sized every element in a 1920x1080 coordinate space, built a release `.vpkg` and ran it on the Virtual Device.
- **Expected:** A 1920x1080 layout fills a 1080p screen.
- **Actual:** Everything rendered at twice the size; only the top-left quarter was visible. Layout units are dp: a 1080p screen is 960x540.
- **Severity:** Major
- **Workaround:** Scale the root view by `window.width / 1920` from `useWindowDimensions()`.
- **Actionable suggestion:** State the layout unit and the logical screen size (960x540 dp at 1080p) next to the safe-area numbers in the design guidelines and the Vega layout docs.

## `vega run-app` with an app id fails with a JavaScript error

- **Date:** 2026-10-23
- **Tool:** Vega CLI 1.4.5
- **Task attempted:** Install and launch the app on the Virtual Device in one command.
- **Steps taken:** Ran `vega run-app build/x86_64-release/balomertv_x86_64.vpkg com.balomer.tv.main`, as `vega run-app --help` shows for the `[appId]` positional.
- **Expected:** The app installs and launches.
- **Actual:** "Vega operation FAILED due to an irrecoverable error: Cannot read properties of undefined (reading 'trim')", exit 253. The log shows `[uninstallApp]: Error - TypeError: Cannot read properties of undefined (reading 'trim')`: it tried to uninstall an app that was not installed.
- **Severity:** Major
- **Workaround:** `vega run-app <vpkg>` without the app id: "Successfully launched the app".
- **Actionable suggestion:** Skip the uninstall when the app is not installed, and never surface a raw `TypeError` as the only message.

## The reverse port forward was off with no error

- **Date:** 2026-10-23
- **Tool:** Vega CLI 1.4.5, `vega device start-port-forwarding`
- **Task attempted:** Let the app on the Virtual Device reach the laptop's API on port 8080.
- **Steps taken:** Ran `vega device start-port-forwarding --port 8080 --forward false` (it printed `8080`, exit 0), then installed and launched the app.
- **Expected:** The forward stays on until stopped.
- **Actual:** About half an hour later, `vega device is-port-forwarded --port 8080 --forward false` printed `false`. HTTP from the device to the API failed (`000`), and the app never connected, with no message anywhere.
- **Severity:** Major
- **Workaround:** Start the forward again after `run-app` and check it with `is-port-forwarded`. Then HTTP returned `200` and the app connected.
- **Actionable suggestion:** Keep forwards across app installs, or print a warning when an install or launch drops them. `run-app` could re-apply active forwards.

## Two more Vega Jest preset mocks break `useWindowDimensions`

- **Date:** 2026-10-23
- **Tool:** Vega Jest preset in `@amazon-devices/react-native-kepler` 4.0.x
- **Task attempted:** Test that the app scales its root view with `useWindowDimensions()`.
- **Steps taken:** Rendered `App` in Jest and read the root view's style.
- **Expected:** `useWindowDimensions` works and `StyleSheet.flatten` flattens style arrays, as in React Native.
- **Actual:**
  - `Dimensions.addEventListener` is a bare `jest.fn()` returning `undefined`, so `useWindowDimensions` throws "Cannot read properties of undefined (reading 'remove')" on unmount.
  - The `StyleSheet` mock's `flatten` is `(style) => style`, so arrays come back unflattened.
- **Severity:** Minor
- **Workaround:** Make `Dimensions.addEventListener` return `{remove}` in the test, and merge style arrays by hand.
- **Actionable suggestion:** Return a subscription from `addEventListener`, and implement `flatten` as React Native does.

## AWS root sign-in recovery loops back to the password page

- **Date:** 2026-10-23
- **Tool:** AWS Sign-In (root user, passkey MFA)
- **Task attempted:** Sign in as root to run `aws login`, after losing access to the registered passkey.
- **Steps taken:** On "Additional verification required" chose "Trouble signing in?", then "Continue to sign in", solved the captcha, and landed on "Root user sign in" with "Authentication failed". Then went through the AWS Support form, whose answer described "Troubleshoot MFA" and "Sign in using alternative factors".
- **Expected:** A direct path to the email and phone verification.
- **Actual:** The flow restarted at the password page with "Authentication failed", before any password was typed. It did not say that the password had to be entered again.
- **Severity:** Major
- **Workaround:** Entered the password again and continued to the alternative factors (email, then a phone call).
- **Actionable suggestion:** Do not show "Authentication failed" when the recovery flow asks for the password again; say "Enter your password to continue to alternative verification".

## Python cannot use `aws login` credentials without extra setup

- **Date:** 2026-10-23
- **Tool:** AWS CLI 2.38.2 `aws login`, boto3 and botocore 1.43.118
- **Task attempted:** Call Bedrock from Python (Strands `BedrockModel`) with the profile that `aws login --profile balomer` created.
- **Steps taken:** `aws sts get-caller-identity --profile balomer` worked in the CLI. Then from Python with `AWS_PROFILE=balomer`.
- **Expected:** Python reads the same profile the CLI reads.
- **Actual:**
  - First: "Using the login credential provider requires an additional dependency. You will need to pip install "botocore[crt]"".
  - With `botocore[crt]`: `botocore.exceptions.NoRegionError: You must specify a region.`, raised while refreshing the login credentials, although the Bedrock client had a region. botocore reads `AWS_DEFAULT_REGION`, not `AWS_REGION`.
- **Severity:** Major
- **Workaround:** Add `botocore[crt]`, and export `AWS_DEFAULT_REGION=us-east-1`.
- **Actionable suggestion:** Mention both requirements in `aws login help` and on the SDK credentials page, and have `aws login --region` save the region in the profile.

## Bedrock model access: verification, unavailable models, then a payment error

- **Date:** 2026-10-23
- **Tool:** Amazon Bedrock Runtime (`Converse`, `ConverseStream`), `us-east-1`
- **Task attempted:** Generate the halftime report with a Claude model through Strands.
- **Steps taken:** Listed the inference profiles (all `ACTIVE`) and sent one-word test calls with `maxTokens: 5`. Then ran the report through Strands with `us.anthropic.claude-sonnet-4-6`.
- **Expected:** A model listed as `ACTIVE` can be invoked, or the error says how to get access.
- **Actual:**
  - "Your account is currently being verified. Verification normally takes less than 2 hours."
  - A minute later, for several Claude models: "is not available for this account. ... contact AWS Sales". Claude Sonnet 4.6 answered.
  - The report call then failed: "Model access is denied due to INVALID_PAYMENT_INSTRUMENT: A valid payment instrument must be provided. Your AWS Marketplace subscription for this model cannot be completed at this time."
- **Severity:** Blocker (for the generated report)
- **Workaround:** None in time: the account needs a valid payment method. The demo cuts the report scene.
- **Actionable suggestion:** Show model availability and the payment requirement in `list-inference-profiles` or the console before the first call, and say on the first successful call that a Marketplace subscription is pending.
