# Decisions and implementation notes

## Product / platform

- Android only. Expo SDK 54, React Native 0.81, TypeScript strict mode, Hermes and New Architecture are enabled. Expo Go is deliberately unsupported because Track Player, MMKV and `esinfy-installer` require native code.
- Package is `com.esinfy.app`; release metadata is set to 1.0.1 / versionCode 2 so the configured minimum version (2) does not force a newly built release to update itself.
- There is no Play Store, analytics, advertising, Firebase, bundled music or Skia. Art images are remote and disk cached.
- The UI uses a dark cinematic palette, four locally bundled Inter weights only, and app-private local audio storage. The Inter variable font source is sliced by selecting only Regular, Medium, SemiBold and Bold assets.

## Audio / native choices

- `react-native-track-player` 4.1.2 was selected for Android background playback and remote media controls. Expo prebuild successfully generated the project and the manifest plugin adds `MusicService` with `foregroundServiceType="mediaPlayback"`. **A Gradle build/runtime integration test remains necessary on a host with JDK 17 and Android SDK; this environment has neither `java` nor the Android SDK.**
- The local Expo module `modules/esinfy-installer` provides version, unknown-source permission and FileProvider install methods. The path provider serves only app-private files/cache.
- Expo FileSystem legacy download-resumable API is used because it supports progress callbacks and `.part` → final-file rename. A two-slot queue caps background download concurrency.
- MMKV v3 is used for durable flags and Supabase's auth storage adapter; SQLite uses `PRAGMA user_version` and a compact repository instead of an ORM.
- Expo Image is used with disk cache, blurhash placeholder and transition. Native Image Colors extracts the player backdrop accent.

## Services / safety

- The Audius token and Supabase anon key are public client configuration values. The Audius bearer value is embedded in the APK; it is not a secret. Supabase table access is protected with RLS and twin matching is exposed through an authenticated-only RPC; service-role credentials are never shipped.
- If Supabase sync fails, `pending_sync` is retained and retried on network recovery. Onboarding requires an internet connection to fetch the initial music catalogue; a subsequent profile write failure does not prevent local onboarding completion.
- APK update version metadata is cached and checked with a 5-second timeout; network failure with no cached version allows app use. APK content is verified against SHA-256 before passing the FileProvider URI to Android.
- The release script generates a local ignored JKS only when absent. Every future update has to reuse the exact JKS. Keystore and passwords must be backed up outside Git.
- `web/public/version.json` currently has a zero SHA placeholder until a signed release exists; `scripts/release.sh` replaces it after APK creation. Do not deploy the placeholder as a real release manifest.

## Bundle / dependency review

- `npx expo export --platform android --dump-sourcemap` completed. Hermes JavaScript output: about **4.88 MB**. Export includes exactly four Inter font assets (about 1.37 MB uncompressed), not all 18 weights/italics from the font package. Android native library size and final APK size remain unmeasured until Gradle release build; arm64-only, R8 and resource shrinking are configured, and the release script fails if APK size is 50 MB or above.
- Largest source-map source groups (unminified source sizes; not APK contributions) observed in bundle inspection: `react-native` (~2.42 MiB), `lucide-react-native` (~1.74 MiB), `react-native-reanimated` (~0.83 MiB), `@supabase/auth-js` (~0.44 MiB), `expo-router` (~0.40 MiB), `react-native-svg` (~0.27 MiB), `react-native-gesture-handler` (~0.26 MiB), `@shopify/flash-list` (~0.21 MiB), `@react-navigation/core` (~0.19 MiB), and `@tanstack/query-core` (~0.17 MiB). These are source map input sizes; Hermes bytecode is 4.88 MB total and R8 affects native bytecode, so this list should not be interpreted as final APK contribution sizes.
- `npx expo-doctor` passed 16 of 18 checks. The two remaining checks require Expo/RN Directory network endpoints unavailable in this sandbox; no local config or dependency mismatch was reported by the other checks.
- Vitest covers score percentage bounds, zero denominators, cosine, TF-IDF fallback and normal RPC-score selection.

## Known follow-up before public release

- Run `scripts/release.sh` on an Android build host, resolve any Gradle / native runtime issues there, check real release APK size and verify playback, installer, offline file and Android 14/15 notification behavior on devices.
- Set actual Supabase and Audius configuration in the Vercel/Build environment and run the SQL once in the Supabase project.
- Deploy the signed APK and matching computed `version.json` together. Never publish a version manifest whose `apk_sha256` does not match its APK.
