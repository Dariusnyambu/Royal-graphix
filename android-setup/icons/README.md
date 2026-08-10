# Royal Graphix — App Icon Setup

## Required icon sizes for Android

After running `npx cap add android`, place PNG icons at:

```
android/app/src/main/res/
├── mipmap-mdpi/       ic_launcher.png        48x48
│                      ic_launcher_round.png  48x48
├── mipmap-hdpi/       ic_launcher.png        72x72
│                      ic_launcher_round.png  72x72
├── mipmap-xhdpi/      ic_launcher.png        96x96
│                      ic_launcher_round.png  96x96
├── mipmap-xxhdpi/     ic_launcher.png        144x144
│                      ic_launcher_round.png  144x144
└── mipmap-xxxhdpi/    ic_launcher.png        192x192
                       ic_launcher_round.png  192x192
```

## Fastest way to generate all sizes

1. Go to: https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html
2. Upload `app-icon-template.svg` or your custom logo PNG (at least 512x512)
3. Download the ZIP — it contains all sizes
4. Copy the `res/` folder contents into `android/app/src/main/res/`

## Splash Screen

Capacitor 6 uses the Android 12+ Splash Screen API automatically.
No separate splash PNG needed. The background colour from capacitor.config.ts
(`#050505`) is used as the splash background.

If you want a logo on the splash screen, add:
```
android/app/src/main/res/drawable/splash.xml
```
as an adaptive icon XML pointing to your vector drawable.

## Alternative: @capacitor/assets (recommended)

Run:
```bash
npm install -D @capacitor/assets
npx capacitor-assets generate --android
```

This auto-generates all icon sizes from a single source file.
Place your source image at:
```
resources/icon.png       (1024x1024, no padding)
resources/splash.png     (2732x2732)
resources/icon-only.png  (1024x1024, with safe-zone padding)
```
