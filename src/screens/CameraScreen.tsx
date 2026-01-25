import { useEffect, useRef, useState } from "react";
import { Alert, Platform, Linking } from "react-native";
import { Box, Button, Text, HStack, Icon, IconButton, useColorMode, VStack, Spinner } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";

export default function CameraScreen() {
  const cameraRef = useRef<CameraView | null>(null);
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  // 🔐 Sadece Kamera İznini Hook ile Takip Ediyoruz
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  
  // 📝 Medya İznini Hook Yerine Manuel Yöneteceğiz (State ile)
  // Bu sayede "Audio" izni krizini bypass edeceğiz.
  const [hasMediaPermission, setHasMediaPermission] = useState<boolean | null>(null);

  const [cameraType, setCameraType] = useState<CameraType>("back");
  const [isRequesting, setIsRequesting] = useState(false);

  // 🚀 Açılışta Sadece Kamera İznini Kontrol Et
  useEffect(() => {
    (async () => {
      if (!cameraPermission) {
        await requestCameraPermission();
      }
      // Medya iznini sessizce kontrol et (İstek gönderme, sadece durum al)
      const mediaStatus = await MediaLibrary.getPermissionsAsync();
      setHasMediaPermission(mediaStatus.granted);
    })();
  }, []);

  // Manuel Kamera İzni İsteme
  const handleRequestCamera = async () => {
    setIsRequesting(true);
    await requestCameraPermission();
    setIsRequesting(false);
  };

  // 📸 Fotoğraf Çek ve Kaydet
  const takePhoto = async () => {
    try {
      if (!cameraRef.current) return;

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      if (photo) {
        // --- KRİTİK DÜZELTME BURADA ---
        // Varsayılan requestPermissionsAsync() yerine 'true' parametresi veriyoruz.
        // true = writeOnly (Sadece yazma izni iste, okuma/audio isteme)
        // Bu, Android'deki 'AUDIO permission' hatasını çözer.
        const permission = await MediaLibrary.requestPermissionsAsync(true);

        if (!permission.granted) {
          Alert.alert(
            "Permission Required", 
            "We need permission to save photos to your gallery.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Settings", onPress: () => Linking.openSettings() }
            ]
          );
          return;
        }

        // İzin alındıysa state'i güncelle
        setHasMediaPermission(true);

        // Galeriye Kaydet
        const asset = await MediaLibrary.createAssetAsync(photo.uri);
        await MediaLibrary.createAlbumAsync("CityExplorer", asset, false);

        Alert.alert("Saved", "Photo saved to CityExplorer album!");
      }
    } catch (error) {
      console.log("Save error:", error);
      // Expo Go'da bazen albüm oluşturma hatası verebilir, kullanıcıyı bilgilendir
      Alert.alert("Note", "Photo captured! (If saving failed, it might be due to Expo Go limitations on this device).");
    }
  };

  const openGallery = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("photos-redirect://");
    } else {
      Linking.openURL("content://media/internal/images/media");
    }
  };

  const switchCamera = () => {
    setCameraType((t) => (t === "back" ? "front" : "back"));
  };

  // --- 1. DURUM: Kamera İzni Belirsiz ---
  if (!cameraPermission) {
    return (
      <Box flex={1} bg="coolGray.50" _dark={{ bg: "coolGray.900" }} justifyContent="center" alignItems="center">
        <Spinner size="lg" color="primary.500" />
      </Box>
    );
  }

  // --- 2. DURUM: Kamera İzni Verilmemiş ---
  if (!cameraPermission.granted) {
    return (
      <Box flex={1} bg="coolGray.50" _dark={{ bg: "coolGray.900" }} justifyContent="center" alignItems="center" p={6}>
        <Icon as={Ionicons} name="camera-off-outline" size="6xl" color="coolGray.400" mb={4} />
        <Text textAlign="center" mb={6} fontSize="md" color="coolGray.700" _dark={{ color: "coolGray.200" }}>
          We need camera access to capture moments.
        </Text>
        <Button 
          onPress={handleRequestCamera} 
          colorScheme="primary"
          isLoading={isRequesting}
        >
          Grant Camera Permission
        </Button>
      </Box>
    );
  }

  // --- 3. DURUM: Kamera Aktif ---
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#111827' : 'black' }}>
      <Box flex={1}>
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing={cameraType}
        />

        {/* Kontrol Paneli */}
        <Box
          position="absolute"
          bottom={0}
          width="100%"
          p={6}
          bg={isDark ? "rgba(31, 41, 55, 0.8)" : "rgba(255, 255, 255, 0.8)"}
          borderTopRadius="2xl"
        >
          <HStack justifyContent="space-between" alignItems="center">
            <IconButton 
              icon={<Icon as={Ionicons} name="images-outline" size="md" />}
              onPress={openGallery}
              variant="ghost"
              _icon={{ color: isDark ? "coolGray.200" : "coolGray.600" }}
              rounded="full"
            />
            <Button 
              onPress={takePhoto} 
              size="lg" 
              rounded="full" 
              bg="error.500"
              _pressed={{ bg: "error.600" }}
              width={18}
              height={18}
              shadow={4}
              borderWidth={4}
              borderColor={isDark ? "coolGray.600" : "white"}
            />
            <IconButton 
              icon={<Icon as={Ionicons} name="camera-reverse-outline" size="md" />}
              onPress={switchCamera}
              variant="ghost"
              _icon={{ color: isDark ? "coolGray.200" : "coolGray.600" }}
              rounded="full"
            />
          </HStack>
        </Box>
      </Box>
    </SafeAreaView>
  );
}