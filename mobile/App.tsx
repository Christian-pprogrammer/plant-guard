import 'react-native-gesture-handler';
import React, {useEffect, useRef, useState} from 'react';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LogBox, Platform} from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreLogs(['[notifee] no background event handler has been set']);
import BootSplash from 'react-native-bootsplash';
import {
  SafeAreaInsetsContext,
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import {decode as atob} from 'base-64';
import {Image} from 'react-native';
LogBox.ignoreAllLogs();
import changeNavigationBarColor, {
  hideNavigationBar,
  showNavigationBar,
} from 'react-native-navigation-bar-color';
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import './types/global.d.ts';
import HomePage from './screens/app/home.tsx';
import Results from './screens/app/results.tsx';
import History from './screens/app/history.tsx';
import Login from './screens/auth/login.tsx';

function App(): React.JSX.Element {
  const navigationRef: any = useRef<any>();
  const [initialRoute, setInitialRoute] = useState<any>('HomePage');

  const changeNavigationBarColorAndroid = () => {
    if (Platform.OS === 'android') {
      changeNavigationBarColor('#ffffff', true);
    }
  };

  useEffect(() => {
    changeNavigationBarColorAndroid();
  }, []);

  const Stack = createNativeStackNavigator();

  return (
    <SafeAreaProvider>
      {initialRoute && (
        <NavigationContainer
          ref={navigationRef}
          onReady={() => {
            BootSplash.hide();
          }}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              header: () => null,
              contentStyle: {backgroundColor: 'white'},
              orientation: 'portrait',
            }}
            initialRouteName={initialRoute}>
            <Stack.Screen
              name="HomePage"
              component={HomePage}
              options={{title: 'HomePage'}}
            />
               <Stack.Screen
              name="Results"
              component={Results}
              options={{title: 'Results'}}
            />
                <Stack.Screen
              name="History"
              component={History}
              options={{title: 'History'}}
            />
               <Stack.Screen
              name="Login"
              component={Login}
              options={{title: 'Login'}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
}

export default App;

