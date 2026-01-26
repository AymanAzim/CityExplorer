import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { NativeBaseProvider, extendTheme, StatusBar } from 'native-base';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorMode } from 'native-base';

import StackNavigator from './src/navigation/StackNavigator';
import { FavouritesProvider } from './src/context/FavouritesContext';
import { SettingsProvider } from './src/context/SettingsContext';

const config = {
  useSystemColorMode: false,
  initialColorMode: 'light',
};

const theme = extendTheme({ config });

const AppContainer = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={isDark ? "#111827" : "white"} 
      />
      <StackNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  useEffect(() => {
    LogBox.ignoreLogs([
      'In React 18, SSRProvider is not necessary',
      'SafeAreaView has been deprecated'
    ]);
  }, []);

  return (
    <SettingsProvider>
      <FavouritesProvider>
        <NativeBaseProvider theme={theme}>
          <SafeAreaProvider>
            <AppContainer />
          </SafeAreaProvider>
        </NativeBaseProvider>
      </FavouritesProvider>
    </SettingsProvider>
  );
}