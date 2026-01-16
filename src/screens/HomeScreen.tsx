import { Box, Text, VStack } from "native-base";

export default function HomeScreen() {
  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      <VStack space={4} alignItems="center">
        <Text fontSize="2xl" fontWeight="bold">
          🏙 City Explorer
        </Text>

        <Text>Explore places around you using GPS and Camera</Text>
      </VStack>
    </Box>
  );
}



