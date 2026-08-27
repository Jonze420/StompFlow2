# StompFlow

StompFlow is a browser-based guitar workstation for shaping and practicing
guitar tones locally. It provides a real-time Web Audio effects chain, a
16-step drum machine, a chromatic tuner, local presets, and JSON backup tools.

All audio processing runs in the browser. The current application does not
require a database, authentication, backend API, or third-party runtime
service.

## Current application

The production StompFlow web application lives in:

```text
artifacts/stompflow/
```

The application includes:

- Microphone input through `getUserMedia`
- Local audio-file playback through the Web Audio API
- Distortion, overdrive, delay, reverb, chorus, phaser, tremolo, EQ, and
  compressor effects
- Effect enable/disable, parameter controls, reorder, and removal
- Live oscilloscope
- Synthesized kick, snare, and hi-hat drum sequencer
- Chromatic guitar tuner
- Browser-local preset storage
- JSON import/export for moving local rigs between devices
- Responsive desktop and mobile-browser layouts
- Capacitor Android wrapper with microphone permission support
- Versioned debug APK builds through GitHub Actions

Presets, effect chains, drum patterns, and settings are stored in
`localStorage` on the current browser/device. No audio or preset data is sent
to a server.

## Technology

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- pnpm workspaces
- Native browser Web Audio APIs

The root repository preserves the original working Replit workspace structure.
The API, database, design sandbox, and product-demo artifacts are separate
workspace packages; the StompFlow application does not currently call the API
or database.

## Requirements

- Node.js 24.x
- pnpm 10.x
- A modern browser for normal web use
- HTTPS or localhost for microphone access

The repository does not commit `node_modules`, build output, caches, or
TypeScript build-info files. Install dependencies from the repository root so
pnpm can resolve workspace packages correctly.

## Install

```bash
pnpm install --frozen-lockfile
```

## Typecheck StompFlow

The current Vite configuration requires `PORT` and `BASE_PATH` to be present
when Vite starts or builds:

```bash
PORT=21165 BASE_PATH=/ \
pnpm --filter @workspace/stompflow run typecheck
```

## Run the development app

```bash
PORT=21165 BASE_PATH=/ \
pnpm --filter @workspace/stompflow run dev
```

The Vite server listens on all interfaces at the configured port.

## Build the web app

```bash
PORT=21165 BASE_PATH=/ \
pnpm --filter @workspace/stompflow run build
```

The static build is generated at:

```text
artifacts/stompflow/dist/public/
```

To preview the generated build:

```bash
PORT=4173 BASE_PATH=/ \
pnpm --filter @workspace/stompflow run serve
```

## Android development

The Android wrapper lives in:

```text
artifacts/stompflow/android/
```

It uses Capacitor 8 with the application ID:

```text
com.stompflow.app
```

After changing the web application, rebuild and synchronize the native project:

```bash
PORT=21165 BASE_PATH=/ \
pnpm --filter @workspace/stompflow run build

pnpm --filter @workspace/stompflow run android:sync
```

To build a local debug APK, install JDK 21 and Android SDK 36, then run:

```bash
cd artifacts/stompflow/android
./gradlew assembleDebug
```

The local APK is generated at:

```text
artifacts/stompflow/android/app/build/outputs/apk/debug/app-debug.apk
```

Android build directories, APKs, app bundles, local SDK paths, and keystores
are ignored by Git.

## Automated versioned APKs

The workflow in `.github/workflows/android-apk.yml` runs for pushes to `main`,
pull requests, and manual dispatches. It:

1. Installs the locked pnpm workspace.
2. Typechecks and builds StompFlow.
3. Synchronizes the web build into the committed Android project.
4. Builds a debug APK with JDK 21.
5. Uploads the APK and SHA-256 checksum as a GitHub Actions artifact.

Every run receives a version derived from the GitHub run number and attempt:

```text
version name: 1.0.<run number>.<attempt>
version code: (<run number> × 100) + <attempt>
```

The downloaded artifact is named like:

```text
StompFlow-1.0.42.1.apk
```

These are debug-signed testing builds. A production release still requires a
private release keystore and signing secrets configured in GitHub Actions.

## Browser audio notes

The browser must grant microphone access before live input can be used. Audio
contexts are created after an interaction, following browser autoplay rules.
Headphones are recommended to prevent acoustic feedback when monitoring a
microphone through the effect chain.

Bluetooth devices may introduce noticeable monitoring latency. The current
audio engine uses standard browser Web Audio nodes and is not yet a native
Android audio engine.

## Repository layout

```text
artifacts/stompflow/       # Current StompFlow React/Vite application
artifacts/api-server/      # Separate generic Express health API scaffold
artifacts/stompflow-video/ # Separate StompFlow product-demo artifact
artifacts/mockup-sandbox/  # Separate Replit design-preview tooling
lib/api-client-react/      # Generated API client package
lib/api-spec/              # OpenAPI source and code generation config
lib/api-zod/               # Generated API schemas
lib/db/                    # Generic Drizzle/PostgreSQL scaffold
attached_assets/           # Original standalone HTML prototype
```

## Android audio notes

The Android wrapper declares microphone and audio-settings permissions and
serves the app from Capacitor's secure local origin. Android still asks the user
for microphone access at runtime when live input is selected.

Real-device testing remains important because Android WebView audio latency
varies by device, audio interface, and Bluetooth route. Bluetooth is not
recommended for live monitoring.
