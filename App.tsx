import { NativeBaseProvider, Text, Box } from "native-base";

export default function App() {
  return (
    <NativeBaseProvider>
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text fontSize="xl">City Explorer</Text>
      </Box>
    </NativeBaseProvider>
  );
}

