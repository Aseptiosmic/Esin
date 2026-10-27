# Esinfy — Müzik İkizini Bul

Android-only, React Native + Expo development-build music discovery app. Esinfy discovers playable tracks through Audius, stores the onboarding collection locally, and offers opt-in anonymous profile matching through Supabase.

## Requirements

- Node.js 20+ and npm
- JDK 17 (including `keytool`)
- Android SDK / build tools and accepted Android SDK licenses
- Android device or emulator, arm64-v8a for the release build
- Audius API token (publicly embedded client token) and a Supabase project

Expo Go is **not** supported. Build and run a native development client with `npx expo run:android`.

## Configure services

1. Copy `.env.example` to `.env`.
2. Set `EXPO_PUBLIC_AUDIUS_TOKEN`, `EXPO_PUBLIC_SUPABASE_URL`, and `EXPO_PUBLIC_SUPABASE_ANON_KEY`. These are client values, not server secrets. The Audius bearer token is embedded in the APK and must be treated as public. Supabase's anon key is public by design; RLS is mandatory.
3. In Supabase Dashboard, enable **Authentication → Allow anonymous sign-ins**.
4. Run [`supabase/schema.sql`](supabase/schema.sql) once in the Supabase SQL editor. Profile rows are RLS-protected; client matching uses the authenticated-only `find_twins` RPC.
5. Create an Audius API token via Audius API plans. Audius discovery hostnames are never hard-coded; requests use `https://api.audius.co/v1`.

## Local development

```bash
npm install
npx expo prebuild --platform android
npx expo run:android
npm run typecheck
npm test
```

The app uses Expo SDK 54, Hermes, New Architecture, Reanimated, SQLite, MMKV, TanStack Query, Zustand, FlashList and React Native Track Player. Native development builds are required for Track Player, MMKV, and the local installer module.

## Supabase and privacy notes

- Anonymous auth sessions are stored through MMKV; no email or phone number is requested.
- Raw profile reads are limited to the caller by RLS. `find_twins` is `SECURITY DEFINER`, excludes the caller, and is executable only by `authenticated` users.
- `pending_sync` is retried when network connectivity returns. Failed profile sync does not discard the on-device collection.
- Songs and downloads are stored in app-private storage; the app does not request shared audio/media storage permissions.

## Release APK and updates

The release script builds an arm64-only, minified APK, signs it, copies it to `web/public/app-release.apk`, and updates the SHA-256 in `web/public/version.json`:

```bash
npm run release
```

The first run generates a signing key and stores signing properties at `android/keystore.properties`. Set `ESINFY_STORE_PASSWORD` / `ESINFY_KEY_PASSWORD` before the first run if you manage your own passwords. For subsequent runs, restore the exact existing keystore and properties before building.

> **CRITICAL: Back up `android/app/esinfy-release.keystore` and `android/keystore.properties` securely, in at least two protected locations. Every APK update must be signed with the exact same keystore and alias. If the keystore or passwords are lost, Android will reject in-place updates and users will have to uninstall the existing app. Never commit either file or put signing passwords in chat.**

The app checks `https://esinfy.vercel.app/version.json` at launch. The release script fills in the APK SHA-256; do not deploy a placeholder hash. The installer requires the user to enable “Install unknown apps” for Esinfy only when an update is requested, downloads to app-private cache, verifies SHA-256, and opens Android's package installer.

## Landing page (Vercel)

Deploy `web/` as the Vercel project root (Next.js pages router). Keep `web/public/app-release.apk` and `web/public/version.json` in the deployed project. `/version.json` is served with no-store cache headers and the APK has Android package MIME and attachment headers. The APK is distributed only from `https://esinfy.vercel.app` (no Play Store integration).

## Build/verification caveats

- The repository's release script fails early with a clear message if JDK / `keytool` is unavailable. Native APK size/signing must be verified on an Android build host; the release script enforces the `< 50 MB` ceiling.
- `npx expo export --platform android --dump-sourcemap` performs JS/Hermes bundle inspection without the Android SDK. The current exported Hermes JS bundle is approximately 4.9 MB and packages only the four required Inter weights.
- Audius attribution is shown on track cards and the player (“Audius'ta aç”); Settings and the landing page include “Powered by Audius”.
