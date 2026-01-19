import React, { useEffect, useState } from "react";
import { FlatList, Alert } from "react-native";
import { Box, Text, Spinner, Button, VStack, HStack, useColorMode, Badge, Icon, Spacer } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { Ionicons } from '@expo/vector-icons';

import { getNearbyPlaces } from "../services/api"; // Foursquare servisini kaldırdık
import { useFavourites } from "../context/FavouritesContext";

interface Place {
  id: number;
  lat: number;
  lon: number;
  tags?: {
    name?: string;
    amenity?: string; // restaurant, cafe, etc.
    tourism?: string; // museum, hotel, etc.
    leisure?: string; // park, etc.
  };
}

export default function NearbyScreen() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { favourites, addFavourite } = useFavourites();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  useEffect(() => {
    let isMounted = true;

    const fetchPlaces = async () => {
      try {
        // 1. Request Permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission denied");
          setLoading(false);
          return;
        }

        // 2. Get Current Location
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        // 3. Fetch Nearby Places (OpenStreetMap)
        const data = await getNearbyPlaces(latitude, longitude);
        
        if (isMounted) {
          // Filter out places without names to keep the list clean
          const validPlaces = data.filter((place: Place) => place.tags?.name);
          setPlaces(validPlaces);
          setLoading(false);
        }

      } catch (error) {
        console.error("Error fetching places:", error);
        if (isMounted) {
          setErrorMsg("Could not fetch places.");
          setLoading(false);
        }
      }
    };

    fetchPlaces();

    return () => { isMounted = false; };
  }, []);

  // --- LOADING STATE ---
  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="coolGray.50" _dark={{ bg: "coolGray.900" }}>
        <Spinner size="lg" color="primary.500" />
        <Text mt={4} color="coolGray.500" _dark={{ color: "coolGray.300" }}>Scanning nearby locations...</Text>
      </Box>
    );
  }

  // --- ERROR STATE ---
  if (errorMsg && places.length === 0) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="coolGray.50" _dark={{ bg: "coolGray.900" }}>
        <Icon as={Ionicons} name="alert-circle-outline" size="4xl" color="red.400" />
        <Text mt={2} color="red.500" fontSize="lg">{errorMsg}</Text>
        <Button mt={4} onPress={() => setLoading(true)} variant="outline">Retry</Button>
      </Box>
    );
  }

  // --- MAIN LIST ---
  return (
    <Box flex={1} bg="coolGray.50" _dark={{ bg: "coolGray.900" }} safeArea>
      <Box px={4} py={3}>
        <HeadingBlock title="📍 Nearby Places" subtitle="Discover what's around you" isDark={isDark} />
      </Box>

      <FlatList
        data={places}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        renderItem={({ item }) => {
          const placeName = item.tags?.name || "Unknown Place";
          // Determine category name
          const category = item.tags?.amenity || item.tags?.tourism || item.tags?.leisure || "Point of Interest";
          
          const isFavourite = favourites.some((fav) => fav.id === item.id);

          return (
            <Box
              bg="white"
              _dark={{ bg: "coolGray.800", borderColor: "coolGray.700" }}
              p={4}
              mb={3}
              rounded="xl"
              shadow={2}
              borderWidth={1}
              borderColor="coolGray.100"
            >
              <HStack alignItems="center" justifyContent="space-between" mb={2}>
                {/* Icon & Name */}
                <HStack alignItems="center" space={3} flex={1}>
                  <Box p={2} bg="primary.100" _dark={{ bg: "primary.900" }} rounded="full">
                    <Icon as={Ionicons} name="location" size="sm" color="primary.600" _dark={{ color: "primary.300" }} />
                  </Box>
                  <VStack flex={1}>
                    <Text 
                      fontWeight="bold" 
                      fontSize="md" 
                      color="coolGray.800" 
                      _dark={{ color: "white" }} 
                      isTruncated
                    >
                      {placeName}
                    </Text>
                    <Text fontSize="xs" color="coolGray.500" textTransform="uppercase">
                      {category.replace('_', ' ')}
                    </Text>
                  </VStack>
                </HStack>

                {/* Category Badge */}
                {/* <Badge colorScheme="info" variant="subtle" rounded="md">
                  {category.substring(0, 10)}
                </Badge> */}
              </HStack>

              <Divider my={2} _dark={{ bg: "coolGray.700" }} />

              {/* Action Button */}
              <Button
                size="sm"
                variant={isFavourite ? "solid" : "ghost"}
                colorScheme={isFavourite ? "red" : "coolGray"}
                leftIcon={<Icon as={Ionicons} name={isFavourite ? "heart" : "heart-outline"} size="xs" />}
                onPress={() => {
                  if (!isFavourite) {
                    addFavourite({ id: item.id, name: placeName });
                    Alert.alert("Saved", `${placeName} added to favourites!`);
                  }
                }}
                _text={{ fontWeight: "medium" }}
              >
                {isFavourite ? "Saved in Favourites" : "Add to Favourites"}
              </Button>
            </Box>
          );
        }}
      />
    </Box>
  );
}

// Helper component for clean Header
const HeadingBlock = ({ title, subtitle, isDark }: any) => (
  <VStack mb={2}>
    <Text fontSize="2xl" fontWeight="bold" color="coolGray.800" _dark={{ color: "white" }}>
      {title}
    </Text>
    <Text fontSize="sm" color="coolGray.500">
      {subtitle}
    </Text>
  </VStack>
);

// Helper component for Divider (missing in imports fix)
import { Divider } from "native-base";