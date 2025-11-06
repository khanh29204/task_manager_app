/**
 * @format
 */
import 'react-native-get-random-values';
import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {enableScreens} from 'react-native-screens';
LogBox.ignoreLogs([/ReactImageView: Image source "null" doesn't exist/]);

enableScreens(true);
AppRegistry.registerComponent(appName, () => App);
