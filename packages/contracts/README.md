# packages/contracts — data contracts

**JSON Schema is the single source of truth.** Every message that crosses a
process boundary is defined here as a JSON Schema document, and nowhere else.

Python and TypeScript types are *generated* from those schemas. Never hand-write
a type that mirrors a schema, and never edit generated output: change the schema
and regenerate.

Boundaries covered by these contracts:

- edge worker → AWS IoT Core (tracks, team assignment, pitch coordinates)
- stored metric records in DynamoDB
- agent input and output (evidence in, recommendations out)
- API Gateway WebSocket → Fire TV app

Nothing lives here yet. Schemas arrive with the spec that needs them.
