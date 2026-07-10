# Android Permissions for Royal Graphix

The following permissions should be added to:
`android/app/src/main/AndroidManifest.xml`

After running `npx cap add android`, open the file and add inside `<manifest>`:

```xml
<!-- REQUIRED: Internet access for Supabase and Google Sheets -->
<uses-permission android:name="android.permission.INTERNET" />

<!-- REQUIRED: Check network state before API calls -->
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

The following are OPTIONAL and only needed if you add those features later:

```xml
<!-- Only if you add camera upload to admin portfolio -->
<uses-permission android:name="android.permission.CAMERA" />

<!-- Only if you add file upload features -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
```

## Activity Configuration (already auto-set by Capacitor)
Inside `<activity>`:
```xml
android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
android:windowSoftInputMode="adjustResize"
android:exported="true"
```
