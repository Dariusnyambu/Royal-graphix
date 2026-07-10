# Quickest Icon/Splash Setup with @capacitor/assets

## 1. Install
npm install -D @capacitor/assets

## 2. Create a resources folder at project root and place:
mkdir resources
# - resources/icon.png        (1024x1024px, square, no transparency)  
# - resources/icon-only.png   (1024x1024px, logo with safe-zone padding)
# - resources/splash.png      (2732x2732px)

## 3. Generate all sizes automatically
npx capacitor-assets generate --android

This creates all mipmap-* folders automatically.
