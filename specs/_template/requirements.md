# <Feature> — Requirements

> Copy this directory to `specs/<feature>/`. Fill it in before any code exists.

## User story

As a **<role>**, I want **<capability>**, so that **<outcome>**.

## Acceptance criteria (EARS)

Every criterion is testable and links to at least one objective ID from
[docs/OBJECTIVES.md](../../docs/OBJECTIVES.md). A criterion with no objective
does not belong in this spec.

EARS patterns:

- **Ubiquitous:** The `<system>` shall `<response>`.
- **Event-driven:** When `<trigger>`, the `<system>` shall `<response>`.
- **State-driven:** While `<state>`, the `<system>` shall `<response>`.
- **Unwanted behaviour:** If `<condition>`, then the `<system>` shall `<response>`.
- **Optional feature:** Where `<feature is included>`, the `<system>` shall `<response>`.

| ID | Criterion | Objectives |
|----|-----------|------------|
| AC-1 | When `<trigger>`, the `<system>` shall `<response>`. | OBJ-? |
| AC-2 | While `<state>`, the `<system>` shall `<response>`. | OBJ-? |
| AC-3 | If `<condition>`, then the `<system>` shall `<response>`. | OBJ-? |

## Out of scope

What this feature deliberately does not do. Be specific: this is the section
that stops scope creep in review.

-
-

## Open questions

Anything that must be answered before design. An unanswered question here blocks
`tasks.md`, not `design.md`.

-
