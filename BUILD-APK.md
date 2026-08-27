# Build the StompFlow Android APK

This package contains the complete StompFlow web app, Capacitor Android project,
and GitHub Actions workflow for producing a versioned debug APK.

## Upload the package

Keep the folder structure and hidden files intact. The repository root should
contain:

- `.github/workflows/android-apk.yml`
- `artifacts/stompflow/android/`
- `artifacts/stompflow/package.json`
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`

If you are using Git locally:

```bash
unzip StompFlow2-apk-ready.zip
cd StompFlow2
git add .
git commit -m "Upload StompFlow APK build package"
git push origin main
```

If the destination repository already contains a different project, review the
changes before pushing. Do not force-push unless you intentionally want to
replace the existing `main` branch.

## Start the GitHub build

The workflow starts automatically when the package is pushed to `main`.
Alternatively:

1. Open the repository's **Actions** tab.
2. Select **Build Android APK**.
3. Select **Run workflow**, choose `main`, and confirm.

The workflow uses Node.js 24, pnpm 10.26.1, Java 21, Android SDK platform 36,
and Build Tools 36.0.0. It runs the web typecheck, builds the web assets,
syncs them into Capacitor, and assembles the Android debug APK.

## Download the result

When the run succeeds, open the run and download its artifact. It contains:

- `StompFlow-1.0.<run-number>.<attempt>.apk`
- The matching `.sha256` checksum file

The APK is signed with the Android debug key and is suitable for testing or
sideloading, not Google Play production release.

## Optional local build

On a machine with Node.js, pnpm, Java 21, Android SDK 36, and Build Tools
36.0.0 installed:

```bash
pnpm install --frozen-lockfile
pnpm --filter @workspace/stompflow run typecheck
pnpm --filter @workspace/stompflow run build
pnpm --filter @workspace/stompflow run android:sync
cd artifacts/stompflow/android
./gradlew assembleDebug
```

The local APK is written to:

```text
artifacts/stompflow/android/app/build/outputs/apk/debug/app-debug.apk
```