import React from 'react';
import { Box, Heading, Text, VStack, Center, ScrollView } from 'native-base';

const AboutScreen = () => {
  return (
    <Box 
      flex={1} 
      bg="coolGray.50" 
      _dark={{ bg: "coolGray.900" }}
      safeArea
    >
      <ScrollView>
        <VStack space={4} alignItems="center" py={10}>
          <Center 
            bg="primary.500" 
            size="xl" 
            rounded="full" 
            _text={{ color: "white", fontWeight: "bold", fontSize: "4xl" }}
            shadow={3}
          >
            CE
          </Center>

          <Heading size="xl" color="coolGray.800" _dark={{ color: "warmGray.50" }}>
            City Explorer
          </Heading>
          <Text fontSize="md" color="coolGray.500">Version 1.0.0</Text>

          <Box px={6} py={4}>
            <Text textAlign="center" color="coolGray.600" _dark={{ color: "coolGray.300" }}>
              City Explorer allows you to discover interesting places in your city, 
              view their locations on the map, and capture moments using your camera.
            </Text>
          </Box>

          <VStack space={1} alignItems="center" mt={4}>
            <Text fontSize="xs" color="coolGray.400">Developed by</Text>
            <Text fontWeight="bold" color="coolGray.700" _dark={{ color: "warmGray.200" }}>
              City Explorer Team
            </Text>
            <Text fontSize="xs" color="coolGray.400">© 2026 All Rights Reserved</Text>
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default AboutScreen;