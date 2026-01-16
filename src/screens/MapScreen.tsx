import { useEffect, useState } from "react";
import { Box, Text, Button, Spinner } from "native-base";
import * as Location from "expo-location";

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // Chiede il permesso
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permesso per la posizione negato");
        setLoading(false);
        return;
      }

      // Ottiene posizione
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner />
        <Text mt={3}>Caricamento posizione...</Text>
      </Box>
    );
  }

  if (errorMsg) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text color="red.500">{errorMsg}</Text>
      </Box>
    );
  }

  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      <Text fontSize="xl" fontWeight="bold">🗺️ Posizione attuale</Text>

      <Text mt={3}>
        Latitudine: {location?.coords.latitude}
      </Text>
      <Text>
        Longitudine: {location?.coords.longitude}
      </Text>

      <Button mt={5} onPress={async () => {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      }}>
        Aggiorna posizione
      </Button>
    </Box>
  );
}
