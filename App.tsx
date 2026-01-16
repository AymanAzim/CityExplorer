import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import StackNavigator from "./src/navigation/StackNavigator";
import { FavouritesProvider } from "./src/context/FavouritesContext";

export default function App() {
  return (
    <NativeBaseProvider>
      <FavouritesProvider>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </FavouritesProvider>
    </NativeBaseProvider>
  );
}



