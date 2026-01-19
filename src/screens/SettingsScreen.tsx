import React, { useState } from 'react';
import { 
  Box, Heading, VStack, HStack, Text, Switch, Divider, 
  Pressable, ScrollView, Button, Icon, useColorMode 
} from 'native-base';
import { Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings, MapType, UnitType } from '../context/SettingsContext'; // <-- ADDED

const SettingsScreen = () => {
  const navigation = useNavigation<any>();
  
  // Theme Management
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  // MAKING GLOBAL SETTINGS.
  const { mapType, setMapType, unit, setUnit } = useSettings(); 
  
  // Notifications are currently local (or can be moved to context)
  const [notifications, setNotifications] = useState(true);

  const clearCache = () => {
    Alert.alert(
      "Clear Cache", 
      "Temporary data will be removed. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", onPress: () => console.log("Cache cleared") }
      ]
    );
  }

  const openSystemSettings = () => {
    Linking.openSettings();
  };

  return (
    <Box flex={1} bg="coolGray.50" _dark={{ bg: "coolGray.900" }} safeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space={6} px={4} py={6}>
          
          <Heading size="lg" color="coolGray.800" _dark={{ color: "warmGray.50" }}>
            Settings
          </Heading>

          {/* 1. VISUAL PREFERENCES */}
          <Box bg="white" _dark={{ bg: "coolGray.800" }} p={4} rounded="xl" shadow={1}>
            <Heading size="sm" mb={4} color="primary.500">Visuals</Heading>
            
            <HStack alignItems="center" justifyContent="space-between" mb={4}>
              <HStack space={3} alignItems="center">
                <Box p={2} bg="coolGray.100" _dark={{ bg: "coolGray.700" }} rounded="full">
                  <Icon as={Ionicons} name="moon-outline" size="sm" _dark={{ color: "white" }} color="coolGray.800" />
                </Box>
                <Text color="coolGray.800" _dark={{ color: "warmGray.50" }}>Dark Theme</Text>
              </HStack>
              <Switch isChecked={isDark} onToggle={toggleColorMode} />
            </HStack>

            <Divider my={2} _dark={{ bg: "coolGray.700" }} />

            {/* MAP STYLE SELECTION */}
            <VStack mt={2}>
              <Text mb={2} color="coolGray.800" _dark={{ color: "warmGray.50" }}>Map Style</Text>
              <Button.Group isAttached w="100%" size="sm">
                <Button 
                  flex={1}
                  variant={mapType === 'standard' ? 'solid' : 'outline'}
                  onPress={() => setMapType('standard')}
                  _text={{ color: mapType === 'standard' ? 'white' : 'coolGray.500' }}
                >
                  Standard
                </Button>
                <Button 
                  flex={1}
                  variant={mapType === 'satellite' ? 'solid' : 'outline'}
                  onPress={() => setMapType('satellite')}
                  _text={{ color: mapType === 'satellite' ? 'white' : 'coolGray.500' }}
                >
                  Satellite
                </Button>
                <Button 
                  flex={1}
                  variant={mapType === 'hybrid' ? 'solid' : 'outline'}
                  onPress={() => setMapType('hybrid')}
                  _text={{ color: mapType === 'hybrid' ? 'white' : 'coolGray.500' }}
                >
                  Hybrid
                </Button>
              </Button.Group>
            </VStack>
          </Box>

          {/* 2. APP PREFERENCES */}
          <Box bg="white" _dark={{ bg: "coolGray.800" }} p={4} rounded="xl" shadow={1}>
            <Heading size="sm" mb={4} color="primary.500">Preferences</Heading>
            
            <HStack alignItems="center" justifyContent="space-between" mb={4}>
              <Text color="coolGray.800" _dark={{ color: "warmGray.50" }}>Distance Unit</Text>
              <Button.Group isAttached size="sm">
                <Button 
                  variant={unit === 'km' ? 'solid' : 'outline'} 
                  onPress={() => setUnit('km')}
                  _text={{ color: unit === 'km' ? 'white' : 'coolGray.500' }}
                >
                  km
                </Button>
                <Button 
                  variant={unit === 'mi' ? 'solid' : 'outline'} 
                  onPress={() => setUnit('mi')}
                  _text={{ color: unit === 'mi' ? 'white' : 'coolGray.500' }}
                >
                  mi
                </Button>
              </Button.Group>
            </HStack>
            
            {/* ... Diğer kısımlar aynı kalabilir ... */}
             <Divider my={2} _dark={{ bg: "coolGray.700" }} />
             <HStack alignItems="center" justifyContent="space-between" mt={2}>
              <Text color="coolGray.800" _dark={{ color: "warmGray.50" }}>Push Notifications</Text>
              <Switch isChecked={notifications} onToggle={setNotifications} />
            </HStack>
          </Box>

          <Box bg="white" _dark={{ bg: "coolGray.800" }} p={4} rounded="xl" shadow={1}>
             <Heading size="sm" mb={4} color="primary.500">System & Data</Heading>
             <Pressable onPress={openSystemSettings}>
                {({ isPressed }) => (
                  <HStack justifyContent="space-between" alignItems="center" p={2} bg={isPressed ? "coolGray.100" : "transparent"} rounded="md">
                    <Text color="coolGray.800" _dark={{ color: "white" }}>System Permissions</Text>
                    <Icon as={Ionicons} name="open-outline" size="xs" color="coolGray.400" />
                  </HStack>
                )}
             </Pressable>
             <Divider my={2} _dark={{ bg: "coolGray.700" }} />
             <Pressable onPress={clearCache}>
                {({ isPressed }) => (
                   <HStack justifyContent="space-between" alignItems="center" p={2} bg={isPressed ? "red.50" : "transparent"} rounded="md">
                      <Text color="red.500" fontWeight="bold">Clear App Cache</Text>
                      <Icon as={Ionicons} name="trash-bin-outline" size="sm" color="red.500" />
                   </HStack>
                )}
             </Pressable>
          </Box>
          <Divider my={4} _dark={{ bg: "coolGray.700" }} />
          <VStack space={2} alignItems="center" mb={10}>
            <Button variant="ghost" width="100%" justifyContent="flex-start" onPress={() => navigation.navigate('About')} leftIcon={<Icon as={Ionicons} name="information-circle-outline" size="sm" />} _text={{ color: "coolGray.500", fontSize: "md" }}>
              About the App
            </Button>
            <Text fontSize="xs" color="coolGray.400">City Explorer v1.0.0</Text>
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default SettingsScreen;