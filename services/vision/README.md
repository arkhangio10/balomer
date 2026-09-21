# services/vision — edge worker

Runs on the machine next to the camera. Detection (YOLO), tracking, team colour
assignment, homography to pitch coordinates, and the deterministic metrics built
on top of them.

Everything here is testable without a GPU: keep detection at the edges and the
metrics as small pure functions over coordinates, so they can be unit tested
against fixtures.

Package skeleton only. No runtime dependencies yet.
