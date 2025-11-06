import React from 'react';
import {View} from 'react-native-ui-lib';
import {Provider} from 'react-redux';
import {persistor, store} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import RootNavigation from './src/navigation/RootNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Notification from './src/dialog/Notification';
import OfflineStatusBar from './src/components/OfflineStatusBar';

interface AppProps {}

const App: React.FC<AppProps> = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <GestureHandlerRootView>
            <View useSafeArea flex>
              <OfflineStatusBar />
              <RootNavigation />
              <Notification />
            </View>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
