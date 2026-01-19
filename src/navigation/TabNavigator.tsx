import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useColorMode, useTheme } from 'native-base'; // NativeBase hooks added

import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import NearbyScreen from '../screens/NearbyScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { colorMode } = useColorMode();
  const theme = useTheme();
  
  // Renkleri moda göre belirliyoruz
  const isDark = colorMode === 'dark';
  const bgColor = isDark ? theme.colors.coolGray[900] : 'white';
  const activeColor = theme.colors.primary[500];
  const inactiveColor = isDark ? theme.colors.coolGray[400] : 'gray';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        // TAB BAR STYLE: We change the background color here.
        tabBarStyle: {
          backgroundColor: bgColor,
          borderTopColor: isDark ? theme.colors.coolGray[800] : 'transparent',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Map') iconName = focused ? 'map' : 'map-outline';
          else if (route.name === 'Nearby') iconName = focused ? 'location' : 'location-outline';
          else if (route.name === 'Favourites') iconName = focused ? 'heart' : 'heart-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Discover' }} />
      <Tab.Screen name="Map" component={MapScreen} options={{ title: 'Map' }} />
      <Tab.Screen name="Nearby" component={NearbyScreen} options={{ title: 'Nearby' }} />
      <Tab.Screen name="Favourites" component={FavouritesScreen} options={{ title: 'Favourites' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default TabNavigator;