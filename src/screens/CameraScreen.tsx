import { useRef, useState } from "react";
import { Box, Text, Button } from "native-base";
import { FlatList, Image, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CameraScreen() {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState<string[]>([]);

  const takePicture = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync();
    setPhotos((prev) => [photo.uri, ...prev]);

    Alert.alert("📸 Photo taken", "Photo captured successfully.");
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhotos((prev) => [uri, ...prev]);
    }
  };

  if (!permission?.granted) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text mb={3}>Camera permission required</Text>
        <Button onPress={requestPermission}>Grant permission</Button>
      </Box>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1}>
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back">
          <Box position="absolute" bottom={10} width="100%" alignItems="center">
            <Button onPress={takePicture}>📸 Take photo</Button>
            <Button mt={2} variant="outline" onPress={openGallery}>
              🗂 Open gallery
            </Button>
          </Box>
        </CameraView>

        {/* 🖼 Preview */}
        <Box p={3}>
          <Text fontSize="md" fontWeight="bold" mb={2}>
            🗂 Photos
          </Text>

          {photos.length === 0 ? (
            <Text>No photos yet.</Text>
          ) : (
            <FlatList
              horizontal
              data={photos}
              keyExtractor={(uri, index) => uri + index}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 8,
                    marginRight: 8,
                  }}
                />
              )}
            />
          )}
        </Box>
      </Box>
    </SafeAreaView>
  );
}



