# <Feature> — Tasks

One task = one PR = one squash-merged commit. A task that cannot name its test
is not a task yet: split it.

Work them in order with `/task <feature>`. Tick the box only when `make check`
passes and the PR is merged.

- [ ] **T1 — <short imperative title>**
  - Criteria: AC-?
  - Test: `services/<svc>/tests/test_<x>.py::<test name>` — <what failure it catches>
  - Done when: <observable outcome, not "code written">

- [ ] **T2 — <short imperative title>**
  - Criteria: AC-?
  - Test: `...`
  - Done when: <...>

- [ ] **T3 — <short imperative title>**
  - Criteria: AC-?
  - Test: `...`
  - Done when: <...>

## Coverage check

Every AC in `requirements.md` appears against at least one task above. Fill this
in last and keep it accurate.

| AC | Task |
|----|------|
| AC-1 | T? |
