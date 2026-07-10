#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Royal Graphix — Android Post-Setup Patch Script
#
# PURPOSE:
# After running `npx cap add android`, Capacitor generates a
# default Android project. This script customises it for
# Royal Graphix: sets permissions, brand colours, SDK versions,
# and app name. Run it ONCE after the initial `npx cap add android`.
#
# USAGE:
#   bash android-setup/patch-android.sh
#
# REQUIREMENTS:
#   - Must be run from the project root (where package.json is)
#   - The android/ folder must already exist (from npx cap add android)
# ═══════════════════════════════════════════════════════════════

set -e

# Verify we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "android" ]; then
  echo "❌ Run this from the project root AFTER 'npx cap add android'"
  exit 1
fi

echo "Patching Android project for Royal Graphix..."

MANIFEST="android/app/src/main/AndroidManifest.xml"
STRINGS="android/app/src/main/res/values/strings.xml"
COLORS="android/app/src/main/res/values/colors.xml"
STYLES="android/app/src/main/res/values/styles.xml"
GRADLE="android/app/build.gradle"
NETWORK_SECURITY="android/app/src/main/res/xml/network_security_config.xml"

# ── 1. Android Permissions ─────────────────────────────────────
# INTERNET: required for Supabase, Google Sheets, and Unsplash images.
# ACCESS_NETWORK_STATE: lets the app check if network is available
# before attempting API calls, preventing crash on no-network launch.
if ! grep -q "android.permission.INTERNET" "$MANIFEST"; then
  sed -i 's|<application|<uses-permission android:name="android.permission.INTERNET" />\n    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />\n\n    <application|' "$MANIFEST"
  echo "  + Added INTERNET + ACCESS_NETWORK_STATE permissions"
else
  echo "  = Permissions already present"
fi

# ── 2. App name ────────────────────────────────────────────────
sed -i 's|<string name="app_name">.*</string>|<string name="app_name">Royal Graphix</string>|' "$STRINGS"
echo "  + App name: Royal Graphix"

# ── 3. Brand colours ───────────────────────────────────────────
mkdir -p "$(dirname "$COLORS")"
cat > "$COLORS" << 'COLORS_XML'
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- Status bar background -->
    <color name="colorPrimaryDark">#050505</color>
    <!-- Action bar / primary brand colour -->
    <color name="colorPrimary">#C8102E</color>
    <!-- Accent: FABs, checkboxes, etc. -->
    <color name="colorAccent">#C8102E</color>
    <!-- Splash screen / WebView background while loading -->
    <color name="ic_launcher_background">#050505</color>
</resources>
COLORS_XML
echo "  + Brand colours: #050505 background, #C8102E accent"

# ── 4. App theme (dark, no action bar) ─────────────────────────
mkdir -p "$(dirname "$STYLES")"
cat > "$STYLES" << 'STYLES_XML'
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- Main theme: hides the native action bar so only the WebView shows -->
    <style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
        <item name="colorPrimary">@color/colorPrimary</item>
        <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
        <item name="colorAccent">@color/colorAccent</item>
        <item name="android:windowBackground">@color/ic_launcher_background</item>
    </style>

    <!-- Splash screen theme (Android 12+) -->
    <!-- Capacitor 6 uses the Android SplashScreen API automatically -->
    <style name="AppTheme.NoActionBarLaunch" parent="Theme.SplashScreen">
        <item name="android:background">@color/ic_launcher_background</item>
        <item name="windowSplashScreenBackground">@color/ic_launcher_background</item>
        <item name="postSplashScreenTheme">@style/AppTheme</item>
    </style>
</resources>
STYLES_XML
echo "  + Theme configured (dark, no action bar)"

# ── 5. Network security config ────────────────────────────────
# Supabase (*.supabase.co) and Google Apps Script both use HTTPS.
# This config explicitly allows them while blocking all plain HTTP.
# It also allows all HTTPS by default (for CDN-hosted images, etc.)
mkdir -p "$(dirname "$NETWORK_SECURITY")"
cat > "$NETWORK_SECURITY" << 'NETWORK_XML'
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <!-- Block all cleartext (HTTP) traffic by default -->
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>

    <!-- Explicitly allow Supabase HTTPS (already HTTPS, just documenting) -->
    <domain-config cleartextTrafficPermitted="false">
        <domain includeSubdomains="true">supabase.co</domain>
        <domain includeSubdomains="true">script.google.com</domain>
        <domain includeSubdomains="true">script.googleusercontent.com</domain>
        <domain includeSubdomains="true">images.unsplash.com</domain>
    </domain-config>
</network-security-config>
NETWORK_XML
echo "  + Network security config: HTTPS-only enforced"

# ── 6. Reference network_security_config in AndroidManifest ──
if ! grep -q "networkSecurityConfig" "$MANIFEST"; then
  sed -i 's|<application|<application\n        android:networkSecurityConfig="@xml/network_security_config"|' "$MANIFEST"
  echo "  + network_security_config referenced in AndroidManifest"
fi

# ── 7. SDK versions in build.gradle ──────────────────────────
# minSdkVersion 22 = Android 5.1+ (covers ~99% of active devices)
# compileSdkVersion 34 = Android 14 (latest stable)
# targetSdkVersion 34 = required for new Google Play submissions
sed -i 's/compileSdkVersion [0-9]*/compileSdkVersion 34/' "$GRADLE"
sed -i 's/targetSdkVersion [0-9]*/targetSdkVersion 34/' "$GRADLE"
sed -i 's/minSdkVersion [0-9]*/minSdkVersion 22/' "$GRADLE"
echo "  + SDK: minSdk=22, compileSdk=34, targetSdk=34"

echo ""
echo "Android project patched successfully!"
echo ""
echo "Next steps:"
echo "  1. Generate app icons:"
echo "     npm install -D @capacitor/assets"
echo "     mkdir -p resources"
echo "     # place resources/icon.png (1024x1024) and resources/splash.png (2732x2732)"
echo "     npx capacitor-assets generate --android"
echo ""
echo "  2. Build debug APK:"
echo "     npm run build && npm run android"
echo ""
echo "  3. Or open in Android Studio:"
echo "     npm run build && npx cap sync android && npx cap open android"
