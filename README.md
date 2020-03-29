# Hikma Mobile Application
This repository the client-side code for Hikma Health's mobile application. It is an offline-first EHR system designed 
to run on low-end mobile devices and in environments with limited connectivity.   

The corresponding server-side code is located at https://github.com/hikmahealth/hikma-health-backend. Please feel free 
to file feature requests and bugs at either location.

Quick Setup (mobile app):
-------------------------

This app is built using React Native and can be compiled for either iOS or Android, although we do most of our testing
on Android. To install the app locally, run:

1. `yarn install`
2. Android Studio -> AVD manager -> Launch AVD in the emulator
3. `react-native run-android`
