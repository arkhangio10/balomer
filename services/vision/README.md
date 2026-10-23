# services/vision — edge worker

Runs on the machine next to the camera. Detection (YOLO), tracking, team colour
assignment, homography to pitch coordinates, and the deterministic metrics built
on top of them.

Everything here is testable without a GPU: keep detection at the edges and the
metrics as small pure functions over coordinates, so they can be unit tested
against fixtures.

In local mode it holds the SoccerTrack v2 ingest (`soccertrack.py`), the replayer
(`replay.py`), and the metrics and alerts (`metrics.py`, `alerts.py`). Detection
and tracking come later.
