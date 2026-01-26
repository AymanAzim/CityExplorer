import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Box, useColorMode, Spinner, Text } from 'native-base';
import * as Location from 'expo-location';
import { useSettings } from '../context/SettingsContext'; 

const mapDarkStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
  { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] },
  { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] },
  { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] },
  { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] },
  { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }
];

const MapScreen = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  
  // We retrieve the map type and UNIT (km/mi) information from the SettingsContext.
  const { mapType, unit } = useSettings(); 

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Harita hareket ettikçe güncellenecek olan bölge bilgisi (Ölçek hesaplama için)
  const [currentRegion, setCurrentRegion] = useState<any>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission denied');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      
      // İlk açılışta bölgeyi set ediyoruz
      setCurrentRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  // --- ÖLÇEK ÇUBUĞU HESAPLAMA ---
  const renderScaleBar = () => {
    if (!currentRegion) return null;

    const { latitude, longitudeDelta } = currentRegion;
    const width = Dimensions.get('window').width;

    // 1 derece boylamın o enlemdeki yaklaşık metre karşılığı
    const metersPerLonDeg = 111320 * Math.cos(latitude * (Math.PI / 180));
    const screenDistMeters = longitudeDelta * metersPerLonDeg;
    
    // 80 piksel genişliğinde bir çubuk çizsek kaç metre ederdi?
    const maxBarWidthPx = 80;
    const rawDistMeters = (screenDistMeters / width) * maxBarWidthPx;

    let displayDist = rawDistMeters;
    let label = 'm';

    // Birim Dönüşümü (Settings'den gelen 'unit'e göre)
    if (unit === 'mi') {
      const distFeet = rawDistMeters * 3.28084;
      if (distFeet > 2640) { // 0.5 mil'den büyükse mil göster
        displayDist = rawDistMeters * 0.000621371;
        label = 'mi';
      } else {
        displayDist = distFeet;
        label = 'ft';
      }
    } else {
       // Metrik sistem (km/m)
       if (displayDist > 1000) {
         displayDist /= 1000;
         label = 'km';
       }
    }

    // Yuvarlak "Güzel Sayı" Hesaplama (1, 2, 5 katları)
    // Örnek: 743m -> 500m, 4.2km -> 5km gibi
    const magnitude = Math.pow(10, Math.floor(Math.log10(displayDist)));
    const residual = displayDist / magnitude;
    
    let niceValue;
    if (residual >= 5) niceValue = 5;
    else if (residual >= 2) niceValue = 2;
    else niceValue = 1;
    
    niceValue *= magnitude;

    // Güzel sayı için piksel genişliğini yeniden hesapla
    const finalBarWidth = (niceValue / displayDist) * maxBarWidthPx;

    return (
      <Box position="absolute" bottom={10} right={4} alignItems="flex-end">
        <Text 
          fontSize="xs" 
          fontWeight="bold" 
          color="coolGray.800" 
          _dark={{color: "white"}} 
          mb={1}
          style={{ textShadowColor: isDark ? 'black' : 'white', textShadowRadius: 3 }}
        >
          {niceValue} {label}
        </Text>
        <Box 
          width={finalBarWidth} 
          height={2} 
          borderBottomWidth={2}
          borderLeftWidth={2}
          borderRightWidth={2}
          borderColor="coolGray.800"
          _dark={{borderColor: "white"}}
          opacity={0.8}
        />
      </Box>
    );
  };

  if (!location) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="coolGray.50" _dark={{ bg: "coolGray.900" }}>
        <Spinner size="lg" color="primary.500" />
      </Box>
    );
  }

  return (
    <Box flex={1} bg="white" _dark={{ bg: "coolGray.900" }}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        mapType={mapType}
        customMapStyle={(isDark && mapType === 'standard') ? mapDarkStyle : []}
        showsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        // Harita hareket ettiğinde ölçeği güncelle
        onRegionChangeComplete={(region) => setCurrentRegion(region)}
      >
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="You are here"
          description="Your current location"
          pinColor={isDark ? "plum" : "red"}
        />
      </MapView>

      {/* Ölçek Çubuğunu Render Et */}
      {renderScaleBar()}
    </Box>
  );
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default MapScreen;