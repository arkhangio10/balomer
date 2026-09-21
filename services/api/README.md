# services/api — API service

FastAPI service that fronts the API Gateway WebSocket: it serves match state to
the Fire TV app and relays live updates produced by the edge worker.

Package skeleton only. No runtime dependencies yet, FastAPI included: a
dependency lands when a spec in `specs/` calls for it.
