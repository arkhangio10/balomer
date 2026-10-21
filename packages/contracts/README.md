# packages/contracts — data contracts

**JSON Schema is the single source of truth.** Every message that crosses a
process boundary is defined here as a JSON Schema document, and nowhere else.

Python and TypeScript types are *generated* from those schemas. Never hand-write
a type that mirrors a schema, and never edit generated output: change the schema
and regenerate.

Boundaries covered by these contracts, in the local demo:

- edge (replayer) → API → Fire TV app, over WebSocket: every `message`
- agent input (`metrics` snapshots) and output (`report`)

## Layout

| Path | What lives there |
|------|------------------|
| `schemas/` | The seven schemas. `message.schema.json` is the envelope over the other six. |
| `examples/` | One valid example per message, checked by `tests/test_schemas.py`. |
| `src/balomer_contracts/models/` | Generated Pydantic models. Import them from `balomer_contracts.models`. |
| `../../apps/tv/src/contracts.ts` | Generated TypeScript types for the TV app. |

## Regenerate

```
make contracts
```

CI regenerates both outputs and fails if they differ from what is committed.
