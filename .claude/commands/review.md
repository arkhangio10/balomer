---
description: Review the current diff against the Definition of Done, SECURITY.md and the spec
---

Review the current diff. $ARGUMENTS

Read first, in this order:

1. The diff: `git diff` for unstaged work, `git diff --cached` for staged, and
   `git diff main...HEAD` if we are on a branch.
2. The Definition of Done in `CLAUDE.md`.
3. `docs/SECURITY.md`.
4. The spec the change belongs to, in `specs/<feature>/`.

Report findings in three buckets, most severe first. For each finding give the
file and line, what is wrong, and the concrete fix.

- **HIGH** — a secret, credential, video, dataset or model weight in the diff;
  a correctness bug; a violation of a security rule; feature code with no spec;
  an acceptance criterion claimed as met that the code does not meet.
- **MED** — a missing or weak test; a new dependency with no stated reason;
  a type hint missing or an unjustified `Any`; `print` instead of `logging`;
  a metric that is not a pure function; a data type hand-written instead of
  generated from a JSON Schema.
- **LOW** — naming, structure, duplication, docs that drifted from the code.

If a bucket is empty, say so rather than padding it. End with a one-line
verdict: ready to merge, or what has to change first.

Do not fix anything. Report only.
