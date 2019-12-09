import React, {useEffect, useState, Fragment} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  AppState
} from 'react-native';
import { database } from "./src/database/Database";
import Login from './src/components/Login';
import { createSwitchNavigator } from 'react-navigation';
import RootNavigation from './src/navigation/RootNavigation';


import SQLite from "react-native-sqlite-storage";
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

  // Handle the app going from foreground to background, and vice versa.
  


const App = () => {
  const [appState, setAppState] = useState(AppState.currentState.toString());
  const [databaseIsReady, setDatabaseIsReady] = useState(false);

  useEffect(() => {
    
    appIsNowRunningInForeground();
    setAppState('active');
    AppState.addEventListener("change", handleAppStateChange);

    return (() => {
      AppState.removeEventListener("change", handleAppStateChange);
    })
  })

  const handleAppStateChange = (nextAppState: string) => {
  if (
      appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      // App has moved from the background (or inactive) into the foreground
      appIsNowRunningInForeground();
    } else if (
      appState === "active" &&
      nextAppState.match(/inactive|background/)
    ) {
      // App has moved from the foreground into the background (or become inactive)
      appHasGoneToTheBackground();
    }
    setAppState(nextAppState);
  }

  // Code to run when app is brought to the foreground
  const appIsNowRunningInForeground = () => {
    console.log("App is now running in the foreground!");
    return database.open().then(() =>
      setDatabaseIsReady(true)
    );
  }

  // Code to run when app is sent to the background
  const appHasGoneToTheBackground = () => {
    console.log("App has gone to the background.");
    database.close();
  }


  return (
    <RootNavigation />
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
