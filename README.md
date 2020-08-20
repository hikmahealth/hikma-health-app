# Hikma Mobile Application

The Hikma Health platform is a mobile electronic health record system designed for organizations working in low-resource settings to collect and access patient health information. The platform is a lightweight Android application that supports offline functionality and multiple languages including Arabic, Spanish, and English. The medical workflows are designed to be intuitive and allow for efficient patient registration and data entry in low-resource, dynamic, and mobile settings. You can see a user demo here: https://www.youtube.com/watch?v=kTL1OyF63tA

This repository contains the client-side code for Hikma Health's mobile application. The corresponding server-side code is located at https://github.com/hikmahealth/hikma-health-backend. Please feel free to file feature requests and bugs at either location.

Quick Setup (mobile app):
-------------------------

This app is built using React Native and can be compiled for either iOS or Android, although we do most of our testing
on Android. To install the app locally, run:

1. `yarn install`
2. Plug in Android device with USB Debug enabled, OR in Android Studio, click AVD manager -> Launch AVD in the emulator
3. `react-native run-android`
