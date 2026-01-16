import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Box, Text, Spinner } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { getNearbyPlaces } from "../services/api";

interface Place {
  id: number;
  title: string;
  body: string;
}

export default function NearbyScreen() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await getNearbyPlaces();
        setPlaces(data.slice(0, 10));
      } catch (error) {
        console.error("Error fetching places:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} justifyContent="center" alignItems="center">
          <Spinner />
          <Text mt={3}>Loading nearby places...</Text>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} p={4}>
        <Text fontSize="xl" fontWeight="bold" mb={3}>
          📍 Nearby Places
        </Text>

        <FlatList
          data={places}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Box
              p={3}
              mb={2}
              borderWidth={1}
              borderColor="coolGray.200"
              borderRadius="md"
            >
              <Text fontWeight="bold">{item.title}</Text>
              <Text>{item.body}</Text>
            </Box>
          )}
        />
      </Box>
    </SafeAreaView>
  );
}


