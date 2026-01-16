import { useEffect, useState } from "react";
import { FlatList, Image, Alert } from "react-native";
import { Box, Text, Spinner, Button } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";

import { getNearbyPlaces } from "../services/api";
import { searchPlace, getPlacePhotos } from "../services/FourSquares";
import { useFavourites } from "../context/FavouritesContext";

interface Place {
  id: number;
  lat: number;
  lon: number;
  tags?: {
    name?: string;
    amenity?: string;
    tourism?: string;
  };
}

export default function NearbyScreen() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [placeImages, setPlaceImages] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { favourites, addFavourite } = useFavourites();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const { status } =
          await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Location permission denied");
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const data = await getNearbyPlaces(latitude, longitude);
        setPlaces(data);

        // ⚠️ CARICHIAMO FOTO SOLO PER I PRIMI 5 LUOGHI
        data.slice(0, 5).forEach((place: Place) => {
          loadPlaceImage(place);
        });
      } catch (err) {
        console.error(err);
        setErrorMsg("Error loading nearby places");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  // 📸 Carica immagine reale da Foursquare
  const loadPlaceImage = async (place: Place) => {
    try {
      const name = place.tags?.name;
      if (!name) return;

      const result = await searchPlace(
        name,
        place.lat,
        place.lon
      );
      if (!result) return;

      const photos = await getPlacePhotos(result.fsq_id);
      if (!photos || photos.length === 0) return;

      const photo = photos[0];
      const photoUrl = `${photo.prefix}800x600${photo.suffix}`;

      setPlaceImages((prev) => ({
        ...prev,
        [place.id]: photoUrl,
      }));
    } catch (e) {
      // ❗ NON facciamo crashare l'app
      console.log("Image skipped for:", place.tags?.name);
    }
  };

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

  if (errorMsg) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} justifyContent="center" alignItems="center">
          <Text color="red.500">{errorMsg}</Text>
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
          renderItem={({ item }) => {
            const placeName =
              item.tags?.name ?? "Unnamed place";
            const placeType =
              item.tags?.amenity ??
              item.tags?.tourism ??
              "Place";

            const isFavourite = favourites.some(
              (f) => f.id === item.id
            );

            return (
              <Box
                p={3}
                mb={3}
                borderWidth={1}
                borderColor="coolGray.200"
                borderRadius="md"
              >
                <Text fontWeight="bold" fontSize="md">
                  {placeName}
                </Text>
                <Text color="coolGray.600">
                  {placeType}
                </Text>

                {/* 📸 FOTO VERA SE DISPONIBILE */}
                {placeImages[item.id] && (
                  <Image
                    source={{ uri: placeImages[item.id] }}
                    style={{
                      width: "100%",
                      height: 180,
                      borderRadius: 8,
                      marginTop: 8,
                    }}
                  />
                )}

                <Button
                  mt={3}
                  isDisabled={isFavourite}
                  onPress={() => {
                    addFavourite({
                      id: item.id,
                      name: placeName,
                    });

                    Alert.alert(
                      "Added to favourites ⭐",
                      `"${placeName}" has been saved.`
                    );
                  }}
                >
                  {isFavourite
                    ? "✓ Already in favourites"
                    : "⭐ Add to favourites"}
                </Button>
              </Box>
            );
          }}
        />
      </Box>
    </SafeAreaView>
  );
}








