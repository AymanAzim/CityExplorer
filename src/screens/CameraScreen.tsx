import { useEffect, useRef, useState } from "react";
import { Alert, Platform, Linking } from "react-native";
import { Box, Button, Text } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
} from "expo-camera";
import * as MediaLibrary from "expo-media-library";

export default function CameraScreen() {
  const cameraRef = useRef<CameraView | null>(null);

  // 🔐 Permessi
  const [cameraPermission, requestCameraPermission] =
    useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();

  const [cameraType, setCameraType] =
    useState<CameraType>("back");

  // 🎫 Richiesta permessi all’avvio
  useEffect(() => {
    if (!cameraPermission?.granted) {
      requestCameraPermission();
    }
    if (!mediaPermission?.granted) {
      requestMediaPermission();
    }
  }, []);

  // 📸 Scatta foto e salva nella galleria
  const takePhoto = async () => {
    try {
      if (!cameraRef.current) return;

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      const asset = await MediaLibrary.createAssetAsync(photo.uri);

      // 📁 Album dedicato (non deprecato)
      await MediaLibrary.createAlbumAsync(
        "CityExplorer",
        asset,
        false
      );

      Alert.alert(
        "Photo saved",
        "The photo has been saved to your gallery"
      );
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not save photo");
    }
  };

  // 🖼️ Apri galleria di sistema (NO expo-linking)
  const openGallery = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("photos-redirect://");
    } else {
      Linking.openURL("content://media/internal/images/media");
    }
  };

  // 🔄 Cambia camera
  const switchCamera = () => {
    setCameraType((t) => (t === "back" ? "front" : "back"));
  };

  // ⛔ Stato permessi
  if (!cameraPermission || !mediaPermission) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} justifyContent="center" alignItems="center">
          <Text>Requesting permissions...</Text>
        </Box>
      </SafeAreaView>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} justifyContent="center" alignItems="center">
          <Text>No access to camera</Text>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1}>
        {/* 📸 CAMERA */}
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing={cameraType}
        />

        {/* 🎛 CONTROLLI */}
        <Box
          flexDirection="row"
          justifyContent="space-around"
          p={3}
          bg="black"
        >
          <Button onPress={switchCamera}>Switch</Button>
          <Button onPress={takePhoto} colorScheme="emerald">
            Take Photo
          </Button>
          <Button onPress={openGallery} colorScheme="coolGray">
            Open Gallery
          </Button>
        </Box>
      </Box>
    </SafeAreaView>
  );
}









