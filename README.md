# Hikma Mobile Application

The Hikma Health platform is a mobile electronic health record system designed for organizations working in low-resource settings to collect and access patient health information. The platform is a lightweight Android application that supports offline functionality and multiple languages including Arabic, Spanish, and English. The medical workflows are designed to be intuitive and allow for efficient patient registration and data entry in low-resource, dynamic, and mobile settings. You can see a user demo here: https://www.youtube.com/watch?v=kTL1OyF63tA

This repository contains the client-side code for Hikma Health's mobile application. The corresponding server-side code is located at https://github.com/hikmahealth/hikma-health-backend. Please feel free to file feature requests and bugs at either location.

This app is built using React Native and can be compiled for either iOS or Android, although we do most of our testing on Android. 

# Local Frontend Setup

Requirements: local backend is running, and local db is populated with a clinic and a user.

Fork frontend repository to your organization and clone

**Point the selected instance to your local backend:**
-----------------------------------------------------------
In src/components/Login.tsx:
If present, comment out the useEffect hook (lines 32-44)
Change line 21 where the selectedInstance variable is defined, to this:
```
 const [selectedInstance, setSelectedInstance] = useState({ name: 'local', url: 'http://10.0.2.2:8080' });
```

If you have 404 errors, you can try using [your_ip:8080] for the instance url, but [10.0.2.2] is an alias set up for local android development that works for most configurations.

**Android Studio Setup**
------------------------
Download Android Studio and open the frontend repository there
From AS, Open the Android Virtual Device (AVD) Manager by clicking on the icon below, found in the right portion of the top toolbar


Within the AVD Manager, add the device(s) you would like to run in the emulator.
(The app has been developed using a Nexus 7 Tablet and a Nexus 5X phone)
Once added, click the green play button action on the right of the list to launch the AVD in the emulator

in the android/app/ directory: 
```
keytool -genkey -v -keystore debug.keystore
  -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000
```

If the debug.keystore file gets generated in the build directory, move it to the android/app directory.

In your .bash_profile , set the following environment variables:
```
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Open a terminal in the frontend project, and
```
Npm install
```
(with the android emulator running)
```
React-native run-android
```

This should run the app on the emulator that you have running, and you should be able to login with the email and password of the local user that you created in the local backend setup.

**Tips and Tricks**
-------------------
Doublepress the ‘R’ key with the emulator in the foreground in order to recompile the app after making changes in the codebase.

Sometimes you'll want to clear the device database when testing things - maybe you added some test data that you don't want to sync to your local psql db. To do this:
change this line in `DatabaseInitialization.ts:`
```
    const dropAllTables = false;
```
to
```
    const dropAllTables = true;
```

Reload the app, and then be sure to change this line back and reload the app again.

Managing Releases
-----------------
There is an older version of the application on the Google Play Store, but releases and updates have historically been handled by manually building APK files within Android Studio and sharing with clinics  

