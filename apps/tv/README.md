# apps/tv — Fire TV app (Vega OS)

Generated later with Vega Developer Tools. Do not hand-write this app: run the
official generator, commit the result, and only then start on features.

The app is a React Native client for Vega OS. It renders the live 2D radar, the
live stats panel, the minute alerts, and the halftime and full-time reports. It
holds no analysis logic: it subscribes to the API Gateway WebSocket and draws
what arrives.
