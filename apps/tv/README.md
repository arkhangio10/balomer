# apps/tv — Fire TV app (Vega OS)

Generated with Vega CLI 1.4.5 (SDK 0.24.12112) and committed unchanged, apart
from `package-lock.json` and the Jest snapshot that the first `npm test` wrote:

```sh
vega project generate --template helloWorld --name balomertv \
  --packageId com.balomer.tv --outputDir <scratch dir>
```

`src/contracts.ts` is not part of the template: `make contracts` generates it
from `packages/contracts/schemas/`.

The app is a React Native client for Vega OS. It renders the live 2D radar, the
live stats panel, the minute alerts, and the halftime and full-time reports. It
holds no analysis logic: it subscribes to the API's WebSocket and draws what
arrives.

## Checks

Run them in WSL or Linux. CI runs the same steps in the `tv` job.

```sh
npm ci
npm test
npx tsc --noEmit
npm run lint
```
