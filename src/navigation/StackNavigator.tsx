import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorMode, useTheme } from 'native-base'; // Hook'lar eklendi

import TabNavigator from './TabNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';
import CameraScreen from '../screens/CameraScreen'; 

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const isDark = colorMode === 'dark';

  // Header stilleri
  const headerStyle = {
    backgroundColor: isDark ? theme.colors.coolGray[900] : 'white',
  };
  const headerTintColor = isDark ? theme.colors.coolGray[50] : 'black';

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: headerStyle,
        headerTintColor: headerTintColor,
      }}
    >
      <Stack.Screen 
        name="RootTabs" 
        component={TabNavigator} 
        options={{ headerShown: false }} 
      />

      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }} 
      />
      
      <Stack.Screen 
        name="About" 
        component={AboutScreen} 
        options={{ title: 'About' }} 
      />

      <Stack.Screen 
        name="Camera" 
        component={CameraScreen} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;