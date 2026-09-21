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
