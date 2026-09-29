---
description: Create a new spec (requirements, design, tasks) from the template
argument-hint: <feature>
---

Create the spec for the feature `$1`.

**Ask before you write.** Do not create a single file until you have asked me
your clarifying questions and I have answered them. Aim for the three to five
questions whose answers would actually change the spec: scope boundaries,
which objectives it serves, what the deterministic output is, and what you are
allowed to assume about the pipeline. If something is not decided in
`docs/ARCHITECTURE.md`, ask rather than assume.

Then:

1. Read `docs/OBJECTIVES.md` and `docs/ARCHITECTURE.md` first. If
   `docs/OBJECTIVES.md` is still a placeholder with no real objective IDs, stop
   and tell me — acceptance criteria cannot be linked yet.
2. Copy `specs/_template/` to `specs/$1/`.
3. Fill in `requirements.md`:
   - one user story
   - acceptance criteria in EARS form, each one testable
   - every criterion linked to at least one objective ID from `docs/OBJECTIVES.md`,
     written exactly as it appears there and matching `^(H|P|V|E|S|B|D)\d+$`
     (e.g. `P3`, `S1`)
   - an explicit "out of scope" section
4. Fill in `design.md`: components with real repo paths, the JSON Schema
   contracts this feature adds or changes, the sequence, the risks, and the
   alternatives you rejected with the reason.
5. Fill in `tasks.md`: a checkbox list where one task equals one PR, each with
   the test that proves it. A task that cannot name its test gets split.
   Finish with the AC-to-task coverage table.

Do not write any feature code. The spec is the deliverable.

Show me the three files and stop.
