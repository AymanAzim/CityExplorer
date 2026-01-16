import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import  StackNavigator  from "./src/navigation/StackNavigator";

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </NativeBaseProvider>
  );
}


