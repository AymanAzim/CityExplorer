import React from 'react';
import { Box, VStack, Text, Avatar, Heading, Icon, IconButton, HStack, Center, ScrollView } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <Box 
      flex={1} 
      bg="coolGray.50" 
      _dark={{ bg: "coolGray.900" }}
    >
      {/* Header */}
      <HStack 
        p={4} 
        justifyContent="flex-end" 
        alignItems="center" 
        safeAreaTop 
        bg="white" 
        _dark={{ bg: "coolGray.800" }}
        shadow={1}
      >
        <IconButton 
          icon={<Icon as={Ionicons} name="settings-outline" size="sm" color="coolGray.600" />}
          _icon={{ color: "coolGray.600", _dark: { color: "warmGray.200" } }}
          onPress={() => navigation.navigate('Settings')} 
          variant="ghost"
        />
      </HStack>

      <ScrollView>
        {/* User Info */}
        <Center 
          py={8} 
          bg="white" 
          _dark={{ bg: "coolGray.800" }}
          mb={4}
        >
          <Avatar 
            bg="purple.600" 
            size="2xl" 
            source={{
              uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80"
            }}
          >
            US
          </Avatar>
          <Heading size="md" mt={4} color="coolGray.800" _dark={{ color: "warmGray.50" }}>
            User Name
          </Heading>
          <Text color="coolGray.500" fontSize="sm">
            user@cityexplorer.com
          </Text>
        </Center>

        {/* Stats */}
        <VStack space={4} px={4}>
          <Box 
            bg="white" 
            _dark={{ bg: "coolGray.800" }}
            p={4} 
            rounded="xl" 
            shadow={1}
          >
            <Heading size="sm" mb={2} color="primary.500">Statistics</Heading>
            <HStack justifyContent="space-between">
              <VStack alignItems="center">
                <Text fontWeight="bold" fontSize="lg" color="coolGray.800" _dark={{ color: "warmGray.50" }}>12</Text>
                <Text fontSize="xs" color="coolGray.400">Places</Text>
              </VStack>
              <VStack alignItems="center">
                <Text fontWeight="bold" fontSize="lg" color="coolGray.800" _dark={{ color: "warmGray.50" }}>5</Text>
                <Text fontSize="xs" color="coolGray.400">Favourites</Text>
              </VStack>
              <VStack alignItems="center">
                <Text fontWeight="bold" fontSize="lg" color="coolGray.800" _dark={{ color: "warmGray.50" }}>3</Text>
                <Text fontSize="xs" color="coolGray.400">Photos</Text>
              </VStack>
            </HStack>
          </Box>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default ProfileScreen;