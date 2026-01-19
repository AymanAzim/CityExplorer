import React from "react";
import { FlatList, Alert } from "react-native";
import { Box, Text, Button, VStack, HStack, Icon, IconButton, Center, Heading, Spacer, useColorMode } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useFavourites } from "../context/FavouritesContext";

export default function FavouritesScreen() {
  const { favourites, removeFavourite } = useFavourites();
  const navigation = useNavigation<any>();
  const { colorMode } = useColorMode();
  
  // --- EMPTY STATE SCREEN ---
  if (favourites.length === 0) {
    return (
      <Box 
        flex={1} 
        bg="coolGray.50" 
        _dark={{ bg: "coolGray.900" }} 
        justifyContent="center" 
        alignItems="center"
        p={5}
      >
        <Box 
          bg="coolGray.100" 
          _dark={{ bg: "coolGray.800" }} 
          p={6} 
          rounded="full" 
          mb={4}
        >
          <Icon as={Ionicons} name="heart-dislike-outline" size="6xl" color="coolGray.400" />
        </Box>
        
        <Heading size="md" color="coolGray.700" _dark={{ color: "coolGray.200" }} mb={2}>
          No Favourites Yet
        </Heading>
        
        <Text color="coolGray.500" textAlign="center" mb={6}>
          You haven't saved any places yet. Go explore the map or nearby places to find some gems!
        </Text>

        <Button 
          onPress={() => navigation.navigate('Nearby')} 
          leftIcon={<Icon as={Ionicons} name="map-outline" size="sm" />}
          colorScheme="primary"
          rounded="full"
          px={6}
        >
          Explore Nearby
        </Button>
      </Box>
    );
  }

  // --- FULL LIST SCREEN ---
  return (
    <Box flex={1} bg="coolGray.50" _dark={{ bg: "coolGray.900" }} safeArea>
      
      {/* HEADING SPACE */}
      <Box px={5} py={4}>
        <Heading size="xl" color="coolGray.800" _dark={{ color: "white" }}>
          Your Favourites
        </Heading>
        <Text color="coolGray.500" fontSize="sm">
          {favourites.length} {favourites.length === 1 ? 'place' : 'places'} saved
        </Text>
      </Box>

      <FlatList
        data={favourites}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <Box
            bg="white"
            _dark={{ bg: "coolGray.800" }}
            p={4}
            mb={3}
            rounded="xl"
            shadow={2}
            borderLeftWidth={4}
            borderLeftColor="secondary.500"
          >
            <HStack alignItems="center">
              
              {/* LEFT SIDE: ICON AND NAME */}
              <Box 
                bg="secondary.50" 
                _dark={{ bg: "coolGray.700" }} 
                p={3} 
                rounded="full" 
                mr={3}
              >
                <Icon as={Ionicons} name="heart" color="secondary.500" size="sm" />
              </Box>

              <VStack flex={1}>
                <Text 
                  fontWeight="bold" 
                  fontSize="md" 
                  color="coolGray.800" 
                  _dark={{ color: "white" }}
                  isTruncated
                >
                  {item.name}
                </Text>
                <Text fontSize="xs" color="coolGray.500">
                  Saved Location
                </Text>
              </VStack>

              {/* RIGHT SIDE: DELETE BUTTON */}
              <IconButton
                icon={<Icon as={Ionicons} name="trash-outline" size="sm" />}
                colorScheme="danger"
                variant="ghost"
                _icon={{ color: "red.400" }}
                onPress={() => {
                  Alert.alert(
                    "Remove Place",
                    `Are you sure you want to remove "${item.name}" from favourites?`,
                    [
                      { text: "Cancel", style: "cancel" },
                      { 
                        text: "Remove", 
                        style: "destructive", 
                        onPress: () => removeFavourite(item.id) 
                      }
                    ]
                  );
                }}
              />
            </HStack>
          </Box>
        )}
      />
    </Box>
  );
}