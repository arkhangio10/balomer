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
