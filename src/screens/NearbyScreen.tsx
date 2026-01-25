import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, Linking, RefreshControl, Platform } from 'react-native';
import { Box, Text, VStack, HStack, Heading, Icon, Pressable, Spinner, useColorMode, Avatar, Badge, IconButton } from 'native-base';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
// DÜZELTME 1: API fonksiyonunu doğrudan import ediyoruz (api.getNearbyPlaces yerine)
import { getNearbyPlaces } from '../services/api'; 
// DÜZELTME 2: Context bağlantısı
import { useFavourites } from '../context/FavouritesContext';

// UI'da kullandığımız veri yapısı
export interface Place {
  id: number;
  lat: number;
  lon: number;
  name?: string;
  category?: string;
  address?: string;
}

export default function NearbyScreen() {
  const navigation = useNavigation<any>();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  // DÜZELTME 3: Context'ten senin dosyanda olan gerçek fonksiyonları çekiyoruz
  // (addToFavourites -> addFavourite, removeFavourite)
  const { favourites, addFavourite, removeFavourite } = useFavourites(); 

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // --- KATEGORİYE GÖRE İKON VE RENK SEÇİMİ ---
  const getCategoryDetails = (category: string = '') => {
    const cat = category.toLowerCase();
    if (cat.includes('restaurant') || cat.includes('food')) return { icon: 'restaurant', color: 'orange.500', bg: 'orange.100' };
    if (cat.includes('cafe')) return { icon: 'cafe', color: 'brown.500', bg: 'yellow.100' };
    if (cat.includes('bar') || cat.includes('pub')) return { icon: 'beer', color: 'purple.500', bg: 'purple.100' };
    if (cat.includes('park') || cat.includes('garden')) return { icon: 'leaf', color: 'green.500', bg: 'green.100' };
    if (cat.includes('museum') || cat.includes('art')) return { icon: 'color-palette', color: 'red.500', bg: 'red.100' };
    return { icon: 'location', color: 'blue.500', bg: 'blue.100' };
  };

  const fetchPlaces = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission denied');
        setLoading(false);
        setRefreshing(false);
        return;
      }

      let location = await Location.getLastKnownPositionAsync({});
      if (!location) {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      }

      if (location) {
        const { latitude, longitude } = location.coords;
        // DÜZELTME 4: API çağrısı düzeltildi
        const rawResults = await getNearbyPlaces(latitude, longitude);
        
        // API'den gelen ham veriyi UI için uygun formata çeviriyoruz
        const formattedPlaces: Place[] = rawResults.map((item: any) => ({
          id: item.id,
          lat: item.lat,
          lon: item.lon,
          name: item.tags?.name || 'Unknown Place',
          category: item.tags?.amenity || item.tags?.tourism || item.tags?.leisure || 'place',
          address: item.tags?.['addr:street'] ? `${item.tags['addr:street']} ${item.tags['addr:housenumber'] || ''}` : undefined
        })).filter((p: Place) => p.name !== 'Unknown Place'); 

        setPlaces(formattedPlaces);
      }
    } catch (error) {
      console.log('Error fetching places:', error);
      setLocationError('Could not fetch nearby places.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPlaces();
  }, []);

  const openMap = (lat: number, lon: number, label: string) => {
    const scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
    const url = Platform.OS === 'ios' 
      ? `${scheme}?q=${label}&ll=${lat},${lon}`
      : `${scheme}${lat},${lon}?q=${lat},${lon}(${label})`;
    Linking.openURL(url);
  };

  // DÜZELTME 5: Context'te 'isFavourite' olmadığı için manuel kontrol fonksiyonu
  const isPlaceFavourite = (id: number) => {
    return favourites.some(fav => fav.id === id);
  };

  // DÜZELTME 6: Ekle/Çıkar mantığı senin Context yapına uyduruldu
  const handleToggleFavourite = (item: Place) => {
    if (isPlaceFavourite(item.id)) {
      removeFavourite(item.id);
    } else {
      addFavourite({ 
        id: item.id, 
        name: item.name || 'Unknown Place' 
      });
    }
  };

  const renderItem = ({ item }: { item: Place }) => {
    const { icon, color, bg } = getCategoryDetails(item.category);
    
    // Anlık favori durumu
    const isFav = isPlaceFavourite(item.id);

    return (
      <Pressable onPress={() => item.name && openMap(item.lat, item.lon, item.name)}>
        {({ isPressed }) => (
          <Box 
            bg={isDark ? "coolGray.800" : "white"} 
            p={4} 
            mb={3} 
            rounded="xl" 
            shadow={2}
            borderWidth={1}
            borderColor={isDark ? "coolGray.700" : "coolGray.100"}
            style={{ transform: [{ scale: isPressed ? 0.98 : 1 }] }}
          >
            <HStack space={4} alignItems="center">
              {/* Sol Taraf: İkon */}
              <Avatar bg={bg} _dark={{ bg: "coolGray.700" }}>
                <Icon as={Ionicons} name={icon} size="sm" color={color} />
              </Avatar>
              
              {/* Orta: Bilgiler */}
              <VStack flex={1}>
                <Heading size="sm" color={isDark ? "white" : "coolGray.800"} numberOfLines={1}>
                  {item.name}
                </Heading>
                
                <HStack space={2} alignItems="center" mt={1}>
                  <Badge colorScheme="coolGray" variant="subtle" rounded="md" _text={{ fontSize: 10 }}>
                    {item.category?.toUpperCase()}
                  </Badge>
                </HStack>

                {item.address && (
                  <Text fontSize="xs" color="coolGray.500" mt={1} numberOfLines={1}>
                    {item.address}
                  </Text>
                )}
              </VStack>

              {/* Sağ Taraf: Butonlar */}
              <HStack space={1} alignItems="center">
                {/* FAVORİ BUTONU: Context ile bağlandı */}
                <IconButton
                  icon={
                    <Icon 
                      as={Ionicons} 
                      name={isFav ? "heart" : "heart-outline"} 
                      color={isFav ? "error.500" : "coolGray.400"} 
                      size="sm"
                    />
                  }
                  onPress={() => handleToggleFavourite(item)}
                  variant="ghost"
                  rounded="full"
                  _pressed={{ bg: "coolGray.100" }}
                />
                
                {/* Harita Yön Butonu */}
                <Icon as={Ionicons} name="navigate-circle" size="lg" color="primary.500" />
              </HStack>
            </HStack>
          </Box>
        )}
      </Pressable>
    );
  };

  return (
    <Box flex={1} bg={isDark ? "coolGray.900" : "coolGray.50"} safeArea>
      <VStack px={6} pt={4} pb={4}>
        <Heading size="xl" color={isDark ? "white" : "coolGray.800"}>
          Nearby Gems
        </Heading>
        <Text color="coolGray.500" fontSize="sm">
          Discover the best spots around you
        </Text>
      </VStack>

      {loading ? (
        <Box flex={1} justifyContent="center" alignItems="center">
          <Spinner size="lg" color="primary.500" />
          <Text mt={2} color="coolGray.400">Locating places...</Text>
        </Box>
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Box alignItems="center" mt={10}>
              <Icon as={Ionicons} name="search-outline" size="4xl" color="coolGray.300" />
              <Text mt={2} color="coolGray.400">No places found nearby.</Text>
            </Box>
          }
        />
      )}
    </Box>
  );
}