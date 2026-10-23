# Feature requests

Things an Amazon tool does not do yet that Balomer needed. One entry per
request, written as a request and not as a complaint.

Priority: **Critical** (blocked us) · **Important** (cost real time or forced a
worse design) · **Nice-to-have** (would have been pleasant).

---

## [EXAMPLE — delete once there is a real entry] Headless Vega simulator for CI

- **Description:** A way to run the Vega simulator without a display, so a smoke test of the Fire TV app can run in GitHub Actions.
- **Why it matters:** Right now the TV app is the only part of Balomer with no automated check. Every regression in it is found by hand, minutes before a demo.
- **Priority:** Important

## Supported Vega SDK on Windows through WSL2

- **Description:** Support and document the Vega SDK and the Virtual Device on WSL2: the system packages, KVM, and keeping the emulator alive after the launching session ends.
- **Why it matters:** Many hackathon developers are on Windows. Getting Balomer to its first hello world on the Virtual Device took four undocumented packages, a `libtinfo5` from an older Ubuntu release, and a long-lived shell.
- **Priority:** Important

## Logical screen size in the Fire TV and Vega layout docs

- **Description:** State next to the safe-area numbers that Vega lays out in dp, and that a 1080p screen is 960x540 dp. Show `useWindowDimensions()` in the layout guide.
- **Why it matters:** The TV app was designed in 1920x1080 pixels from the design guidelines and rendered at twice the size on the Virtual Device, on the last day.
- **Priority:** Important

## Vega Jest preset mocks that behave like React Native

- **Description:**
  - give the `BackHandler` mock a `default` export;
  - return a subscription from `Dimensions.addEventListener`;
  - flatten arrays in `StyleSheet.flatten`;
  - document that `requestAnimationFrame` runs on `setTimeout`.
- **Why it matters:** Each of these cost a debugging round, and each forces a workaround into every test file that touches Back, window size or styles.
- **Priority:** Important

## Exit codes and port forwards that can be trusted in scripts

- **Description:**
  - `vega virtual-device start` should exit non-zero on a boot timeout;
  - `vega run-app <vpkg> <appId>` should work when the app is not installed yet;
  - port forwards should survive app installs, or the CLI should warn when they drop.
- **Why it matters:** The demo is started by a script. A silent failure in any of these three left the TV with no data and no message.
- **Priority:** Important

## One clear path to invoke a Bedrock model on a new account

- **Description:** Before the first call, say in `list-inference-profiles` or the console which models the account can invoke, and that a valid payment method is required for a Marketplace subscription.
- **Why it matters:** The models listed as `ACTIVE` returned, in turn: "being verified", "not available for this account", and "INVALID_PAYMENT_INSTRUMENT". The generated report could not be shown in the demo.
- **Priority:** Critical
