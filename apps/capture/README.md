# apps/capture — camera capture

Host-side capture for the single fixed camera above the pitch. Reads the stream,
hands frames to `services/vision`, and keeps the video on the local machine.

Video never leaves the edge by default. Only coordinates and metrics are
published to AWS. See [../../docs/SECURITY.md](../../docs/SECURITY.md).
