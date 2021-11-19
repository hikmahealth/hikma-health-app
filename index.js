/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App.tsx';
import {name as appName} from './app.json';
import 'react-native-get-random-values'

AppRegistry.registerComponent(appName, () => App);
