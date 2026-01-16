import { useRef, useState } from "react";
import { Box, Text, Button } from "native-base";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function CameraScreen() {
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef<CameraView | null>(null);

  if (!permission) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text>Loading camera permissions...</Text>
      </Box>
    );
  }

  if (!permission.granted) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text mb={3}>Camera permission not granted</Text>
        <Button onPress={requestPermission}>Grant permission</Button>
      </Box>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);
    }
  };

  return (
    <Box flex={1}>
      {!photoUri ? (
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing={facing}
        >
          <Box
            position="absolute"
            bottom={10}
            width="100%"
            alignItems="center"
          >
            <Button onPress={takePicture}>📸 Take photo</Button>

            <Button
              mt={3}
              onPress={() =>
                setFacing((current) => (current === "back" ? "front" : "back"))
              }
            >
              🔄 Switch camera
            </Button>
          </Box>
        </CameraView>
      ) : (
        <Box flex={1} justifyContent="center" alignItems="center">
          <Text fontSize="lg" mb={3}>
            📷 Photo taken
          </Text>
          <Text numberOfLines={1}>{photoUri}</Text>

          <Button mt={5} onPress={() => setPhotoUri(null)}>
            🔁 Take another photo
          </Button>
        </Box>
      )}
    </Box>
  );
}
