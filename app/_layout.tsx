import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { Platform } from "react-native";
import { CartProvider } from "./contexts/CartContext";

// Mock document for Hermes engine compatibility
if (typeof document === "undefined") {
  const mockElement = {
    appendChild: () => {},
    removeChild: () => {},
    setAttribute: () => {},
    getAttribute: () => null,
    addEventListener: () => {},
    removeEventListener: () => {},
    style: {},
    innerHTML: "",
    textContent: "",
  };

  global.document = {
    createElement: () => mockElement,
    getElementById: () => mockElement,
    getElementsByTagName: () => [mockElement],
    querySelector: () => mockElement,
    querySelectorAll: () => [mockElement],
    addEventListener: () => {},
    removeEventListener: () => {},
    body: mockElement,
    head: mockElement,
    documentElement: mockElement,
  };
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (process.env.EXPO_PUBLIC_TEMPO && Platform.OS === "web") {
      const { TempoDevtools } = require("tempo-devtools");
      TempoDevtools.init();
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <CartProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack
          screenOptions={({ route }) => ({
            headerShown: !route.name.startsWith("tempobook"),
          })}
        >
          <Stack.Screen name="splash" options={{ headerShown: false }} />
          <Stack.Screen name="landing" options={{ headerShown: false }} />
          <Stack.Screen
            name="item-detection"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="build-inventory"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="van-selection" options={{ headerShown: false }} />
          <Stack.Screen
            name="origin-destination"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="date-time" options={{ headerShown: false }} />
          <Stack.Screen
            name="customer-details"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="pricing-tier" options={{ headerShown: false }} />
          <Stack.Screen name="summary" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="payment" options={{ headerShown: false }} />
          <Stack.Screen name="success" options={{ headerShown: false }} />
          <Stack.Screen
            name="customer-dashboard"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </CartProvider>
  );
}
