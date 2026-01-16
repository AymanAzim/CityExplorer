import { Box, Text, Button, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      <VStack space={4} alignItems="center">
        <Text fontSize="2xl" fontWeight="bold">
          🏙 City Explorer
        </Text>

        <Button onPress={() => navigation.navigate("Map" as never)}>
          📍 Show position 
        </Button>

        <Button onPress={() => navigation.navigate("Profile" as never)}>
          👤 Go to profile
        </Button>
      </VStack>
    </Box>
  );
}

