import React, { useRef } from 'react';
import { 
  Dimensions, 
  ImageBackground, 
  Animated, // <-- React Native'in kendi animasyon kütüphanesi
  Platform 
} from 'react-native';
import { 
  Box, 
  Text, 
  VStack, 
  HStack, 
  Heading, 
  Icon, 
  Pressable, 
  useColorMode, 
  Center 
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- EKRAN AYARLARI ---
const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.72; // Kart genişliği ekranın %72'si
const SPACING = (width - ITEM_WIDTH) / 2; // Ortalamak için kenar boşlukları

// --- ÖRNEK VERİ ---
const LANDMARKS = [
  {
    id: '1',
    title: 'Eiffel Tower',
    location: 'Paris, France',
    image: 'https://plus.unsplash.com/premium_photo-1719430569503-338fc89eb21f?q=80&w=772&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'The iron lady of Paris.'
  },
  {
    id: '2',
    title: 'Colosseum',
    location: 'Rome, Italy',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
    description: 'Wait for the gladiator fights.'
  },
  {
    id: '3',
    title: 'Statue of Liberty',
    location: 'New York, USA',
    image: 'https://images.unsplash.com/photo-1585155967849-91c736589c84?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Symbol of freedom.'
  },
  {
    id: '4',
    title: 'Taj Mahal',
    location: 'Agra, India',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
    description: 'A monument of eternal love.'
  },
  {
    id: '5',
    title: 'Machu Picchu',
    location: 'Cusco, Peru',
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80',
    description: 'Lost city of the Incas.'
  }
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  // Animasyon Değeri (Scroll Pozisyonunu tutar)
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <Box flex={1} bg={isDark ? "coolGray.900" : "coolGray.50"}>
      <SafeAreaView style={{ flex: 1 }}>
        
        {/* Üst Başlık */}
        <VStack px={6} pt={4} pb={2}>
          <Text fontSize="lg" color="coolGray.500" _dark={{ color: "coolGray.400" }}>Explore the World</Text>
          <Heading size="2xl" color={isDark ? "white" : "coolGray.800"}>
            Iconic Places
          </Heading>
        </VStack>

        {/* --- YATAY KAYDIRILABİLİR ALAN (Carousel) --- */}
        <Box flex={1} justifyContent="center" alignItems="center">
          <Animated.FlatList
            data={LANDMARKS}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            
            // Snap (Yapışma) Ayarları
            snapToInterval={ITEM_WIDTH}
            decelerationRate="fast" // Hızlı kayıp durması için
            bounces={false}
            
            // İçeriği ortalamak için padding
            contentContainerStyle={{
              paddingHorizontal: SPACING,
              alignItems: 'center' // Dikey ortalama
            }}

            // Scroll olayını animasyon değerine bağla
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true } // Performans için native kullan
            )}
            scrollEventThrottle={16} // 60fps için gerekli

            renderItem={({ item, index }) => {
              // --- ANİMASYON MATEMATİĞİ ---
              // Girdi aralığı: [Önceki Kart, Şu Anki Kart, Sonraki Kart]
              const inputRange = [
                (index - 1) * ITEM_WIDTH,
                index * ITEM_WIDTH,
                (index + 1) * ITEM_WIDTH,
              ];

              // Çıktı (Scale): Ortadaki 1.1, kenardakiler 0.9
              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [0.9, 1.1, 0.9],
                extrapolate: 'clamp',
              });

              // Çıktı (Opacity): Ortadaki tam net, kenardakiler hafif silik
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.6, 1, 0.6],
                extrapolate: 'clamp',
              });

              return (
                <Animated.View
                  style={{
                    width: ITEM_WIDTH,
                    transform: [{ scale }], // Büyüme/Küçülme uygula
                    opacity, // Şeffaflık uygula
                  }}
                >
                  <Pressable 
                    onPress={() => navigation.navigate('Map')}
                    style={{ marginHorizontal: 10 }}
                  >
                    <Box 
                      bg={isDark ? "coolGray.800" : "white"} 
                      rounded="3xl" 
                      shadow={5} 
                      overflow="hidden"
                      borderWidth={1}
                      borderColor={isDark ? "coolGray.700" : "white"}
                      height={400} // Kart yüksekliği
                    >
                      <ImageBackground 
                        source={{ uri: item.image }} 
                        style={{ flex: 1, justifyContent: 'flex-end' }}
                        imageStyle={{ borderRadius: 20 }}
                      >
                        <Box 
                          bg={{
                            linearGradient: {
                              colors: ['transparent', 'rgba(0,0,0,0.8)'],
                              start: [0, 0.5],
                              end: [0, 1]
                            }
                          }}
                          p={5}
                        >
                          <Heading size="lg" color="white">{item.title}</Heading>
                          <HStack space={2} alignItems="center" mt={1}>
                             <Icon as={Ionicons} name="location" color="primary.400" size="sm" />
                             <Text color="coolGray.200" fontSize="sm">{item.location}</Text>
                          </HStack>
                          <Text color="coolGray.300" fontSize="xs" mt={2} numberOfLines={2}>
                            {item.description}
                          </Text>
                        </Box>
                      </ImageBackground>
                    </Box>
                  </Pressable>
                </Animated.View>
              );
            }}
          />
        </Box>
        
        {/* Alt Bilgi */}
        <Center mb={8}>
          <HStack space={2} alignItems="center" bg={isDark ? "coolGray.800" : "white"} px={4} py={2} rounded="full" shadow={1}>
             <Icon as={Ionicons} name="arrow-back" size="xs" color="coolGray.400" />
             <Text fontSize="xs" color="coolGray.400">Swipe to explore</Text>
             <Icon as={Ionicons} name="arrow-forward" size="xs" color="coolGray.400" />
          </HStack>
        </Center>

      </SafeAreaView>
    </Box>
  );
}