import React from 'react';
import { Box, Heading, Text, Center } from 'native-base';

const HomeScreen = () => {
  return (
    <Box 
      flex={1} 
      bg="coolGray.50" 
      _dark={{ bg: "coolGray.900" }} // <-- THIS LINE IS VERY IMPORTANT
      safeArea
    >
      <Center flex={1}>
        <Heading color="coolGray.800" _dark={{ color: "white" }}>
          Home Screen
        </Heading>
        <Text mt={2} color="coolGray.600" _dark={{ color: "coolGray.400" }}>
          Welcome to City Explorer
        </Text>
      </Center>
    </Box>
  );
};

export default HomeScreen;