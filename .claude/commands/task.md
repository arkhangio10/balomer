---
description: Implement the next unchecked task from a spec, tests first
argument-hint: <feature>
---

Work exactly one task from `specs/$1/tasks.md`.

1. Read `specs/$1/requirements.md`, `specs/$1/design.md` and
   `specs/$1/tasks.md`. Take the **first unchecked** task. Say which one it is
   and which acceptance criteria it covers. If there is no unchecked task, say
   so and stop.
2. **Write the test first.** Run it and show me that it fails, and that it
   fails for the right reason. A test that passes before the implementation
   exists is not the test for this task.
3. Implement the smallest change that makes it pass. Type hints everywhere.
   Pydantic for data models. `logging`, never `print`. Metrics as small pure
   functions.
4. Run `make check`. Do not declare anything passing without the output.
5. Show me the full diff.
6. Propose a Conventional Commit message: `<type>(<scope>): <subject>`, with the
   spec and task in the body. Do not commit until I say so. Do not push.

One task. If you find a second thing that needs doing, tell me and leave it.
