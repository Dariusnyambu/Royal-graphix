## IMPORTANT: Two separate builds

This project uses two different build commands:

| Command | Used for | Vite base | Asset paths |
|---|---|---|---|
| `npm run build` | Vercel website | `/` | `/assets/index-ABC.js` |
| `npm run build:android` | Capacitor APK | `./` | `./assets/index-ABC.js` |

**Never push an Android build (`base: './'`) to Vercel.**
Vercel must always use `npm run build` (the default).

Install cross-env first (one time):
```bash
npm install -D cross-env
```

# Royal Graphix — Android Build Guide

Complete guide to building the Android APK and AAB from this project.

---

## Prerequisites

Install these on your development machine before starting:

| Tool | Version | Download |
|---|---|---|
| Node.js | 18+ | nodejs.org |
| Android Studio | Latest | developer.android.com/studio |
| Android SDK | API 34 | Installed via Android Studio |
| Java (JDK) | 17 | Bundled with Android Studio |

**After installing Android Studio**, open it once and let it install the SDK components.
Then set the `ANDROID_HOME` environment variable:

```bash
# macOS / Linux — add to ~/.zshrc or ~/.bashrc
export ANDROID_HOME=$HOME/Library/Android/sdk          # macOS
export ANDROID_HOME=$HOME/Android/Sdk                  # Linux
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Windows — add to System Environment Variables
ANDROID_HOME = C:\Users\YourName\AppData\Local\Android\Sdk
```

---

## Step 1 — Install dependencies

```bash
npm install
```

This installs React, Vite, and all Capacitor packages listed in package.json.

---

## Step 2 — Set environment variables

Copy `.env.example` to `.env` and fill in your real Supabase keys:

```bash
cp .env.example .env
```

Then edit `.env`:
```env
VITE_SUPABASE_URL=https://ynrzdflcroelgcrvktbh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/YOUR_ID/exec
VITE_APP_NAME=Royal Graphix
VITE_APP_URL=https://royalgraphix.co.ke
```

> **Important:** Environment variables are baked into the JavaScript at build time.
> You MUST set them correctly BEFORE running `npm run build`.

---

## Step 3 — Build the React app

```bash
npm run build
```

This runs `vite build` and outputs the production bundle to `dist/`.
The `base: './'` in vite.config.js ensures all asset paths are relative,
which is required for the Android WebView filesystem.

---

## Step 4 — Add Android platform (first time only)

```bash
npx cap add android
```

This generates the `android/` folder with a full Gradle project.
Only needed once — if `android/` already exists, skip this step.

---

## Step 5 — Patch the Android project (first time only)

```bash
bash android-setup/patch-android.sh
```

This script:
- Adds INTERNET and ACCESS_NETWORK_STATE permissions
- Sets brand colours (#050505 / #C8102E)
- Configures SDK versions (min=22, target=34)
- Creates network_security_config.xml (HTTPS-only enforcement)
- Sets the theme to NoActionBar (WebView fills the full screen)

Only run once after `npx cap add android`.

---

## Step 6 — Add app icons

```bash
npm install -D @capacitor/assets
mkdir -p resources
```

Place these files in the `resources/` folder:
- `resources/icon.png` — 1024×1024px, square logo, no transparency
- `resources/icon-only.png` — 1024×1024px with safe-zone padding for adaptive icons
- `resources/splash.png` — 2732×2732px splash image (or solid colour)

Then generate all icon sizes:
```bash
npx capacitor-assets generate --android
```

---

## Step 7 — Sync Capacitor

```bash
npm run cap:sync
# or: npx cap sync android
```

This copies `dist/` into the Android project and updates native plugins.
Run this every time you rebuild the web app.

---

## Step 8 — Open in Android Studio

```bash
npm run cap:open
# or: npx cap open android
```

Android Studio opens the `android/` project.
Wait for Gradle sync to finish (status bar at bottom).

---

## Generating an APK (for testing)

### Debug APK (unsigned, for testing on your device)

In Android Studio:
- **Build → Build Bundle(s) / APK(s) → Build APK(s)**

Or via command line (from project root):
```bash
npm run build && npm run cap:sync
npm run apk:debug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`

Install on a connected device:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Release APK (for distribution outside Play Store)

```bash
npm run build && npm run cap:sync
npm run apk:release
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

> The release build must be signed. See the Signing section below.

---

## Generating an AAB (for Google Play Store)

AAB (Android App Bundle) is required for new Google Play submissions.

```bash
npm run build && npm run cap:sync
npm run aab:release
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

---

## Signing the Release Build

You need a keystore file to sign release builds.

### Create a keystore (one-time)

```bash
keytool -genkey -v -keystore royal-graphix-release.keystore \
  -alias royalgraphix -keyalg RSA -keysize 2048 -validity 10000
```

Store this file safely — **losing it means you can never update your Play Store listing**.

### Configure signing in Android Studio

1. Open the `android/` project in Android Studio
2. **Build → Generate Signed Bundle / APK**
3. Select your keystore file, enter passwords
4. Choose `release` build variant
5. Select APK or AAB

### Or configure in `android/app/build.gradle`

```gradle
android {
    signingConfigs {
        release {
            storeFile file('../../royal-graphix-release.keystore')
            storePassword 'your_store_password'
            keyAlias 'royalgraphix'
            keyPassword 'your_key_password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
        }
    }
}
```

---

## package.json Scripts Reference

| Script | Command | Purpose |
|---|---|---|
| `npm run build` | `vite build` | Build React app to dist/ |
| `npm run cap:sync` | `npx cap sync android` | Copy dist/ to Android + update plugins |
| `npm run cap:copy` | `npx cap copy android` | Copy dist/ only (no plugin update) |
| `npm run cap:open` | `npx cap open android` | Open Android Studio |
| `npm run android` | `build + sync + open` | Full pipeline in one command |
| `npm run apk:debug` | `gradlew assembleDebug` | Build debug APK |
| `npm run apk:release` | `gradlew assembleRelease` | Build signed release APK |
| `npm run aab:release` | `gradlew bundleRelease` | Build AAB for Google Play |
| `npm run cap:live` | `cap run android --livereload` | Live reload on device |

---

## Complete First-Time Setup (copy-paste sequence)

```bash
# 1. Install all dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your real Supabase keys

# 3. Build the web app
npm run build

# 4. Add Android platform
npx cap add android

# 5. Patch the Android project
bash android-setup/patch-android.sh

# 6. Add icons (place icon.png in resources/ first)
npm install -D @capacitor/assets
npx capacitor-assets generate --android

# 7. Sync Capacitor
npx cap sync android

# 8. Open Android Studio
npx cap open android
# Wait for Gradle sync, then: Build → Build APK(s)
```

---

## Complete Subsequent Build Sequence

After making changes to the React app:

```bash
npm run build          # 1. Rebuild the React app
npm run cap:sync       # 2. Sync to Android
npm run cap:open       # 3. Open Android Studio (or run apk:debug)
```

Or in one command:
```bash
npm run android
```

---

## Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| White screen in app | Asset paths absolute | Confirm `base: './'` in vite.config.js |
| Routing broken (blank on navigate) | BrowserRouter in WebView | Already fixed: main.jsx uses HashRouter on native |
| Supabase auth fails | HTTP context | Already fixed: androidScheme: 'https' in capacitor.config.ts |
| App can't reach internet | Missing permission | Run `bash android-setup/patch-android.sh` |
| Gradle sync fails | Wrong Java version | Use JDK 17 (bundled with Android Studio Giraffe+) |
| env variables undefined | .env not set before build | Set .env, then re-run `npm run build` |
| `npx cap` not found | @capacitor/cli not installed | Run `npm install` |
| Icons not showing | Not generated | Run `npx capacitor-assets generate --android` |
