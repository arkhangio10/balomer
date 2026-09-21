---
description: Append an entry to the friction log about an Amazon tool
argument-hint: <tool and what went wrong>
---

Append a new entry to `docs/FRICTION_LOG.md` about: $ARGUMENTS

Append it at the end of the file, below the existing entries. Do not edit or
reorder anything already there. If the example entry is still present and there
is now a real entry, tell me it can be deleted, but do not delete it yourself.

Use today's real date. Fill every field, and ask me for anything you do not
know rather than guessing what I saw:

- **Date:** YYYY-MM-DD
- **Tool:** the tool and its version
- **Task attempted:** what I was trying to do, in one sentence
- **Steps taken:** what I actually did, including what I retried
- **Expected:** what should have happened
- **Actual:** what happened, with the real error text if there is one
- **Severity:** Blocker, Major or Minor
- **Workaround:** what unblocked it, or "none found"
- **Actionable suggestion:** the specific change to the tool that would have
  prevented this — a message, a flag, a doc page. Write it so the team that owns
  the tool could act on it without asking a follow-up question.

Redact any secret, account ID or endpoint that appears in the error text.
