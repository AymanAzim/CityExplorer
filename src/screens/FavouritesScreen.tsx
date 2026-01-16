import { Box, Text, Button } from "native-base";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFavourites } from "../context/FavouritesContext";

export default function FavouritesScreen() {
  const { favourites, removeFavourite } = useFavourites();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} p={4}>
        <Text fontSize="xl" fontWeight="bold" mb={3}>
          ⭐ Favourite Places
        </Text>

        {favourites.length === 0 ? (
          <Text>No favourites yet.</Text>
        ) : (
          <FlatList
            data={favourites}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Box
                p={3}
                mb={3}
                borderWidth={1}
                borderColor="coolGray.200"
                borderRadius="md"
              >
                <Text fontWeight="bold">{item.name}</Text>

                <Button
                  mt={3}
                  colorScheme="danger"
                  onPress={() => removeFavourite(item.id)}
                >
                  Remove from favourites
                </Button>
              </Box>
            )}
          />
        )}
      </Box>
    </SafeAreaView>
  );
}








