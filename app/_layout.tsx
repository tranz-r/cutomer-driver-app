import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import "react-native-reanimated";
import "../global.css";
import { CartProvider } from "./contexts/CartContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (process.env.EXPO_PUBLIC_TEMPO && Platform.OS !== "web") {
      try {
        // Only initialize TempoDevtools if window is available (web environment)
        if (typeof window !== "undefined" && window.addEventListener) {
          const { TempoDevtools } = require("tempo-devtools");
          TempoDevtools.init();
        }
      } catch (err) {
        // Silently handle TempoDevtools initialization errors
        console.log("TempoDevtools not available:", err.message || err);
      }
    }
  }, []);

  useEffect(() => {
    if (loaded || error != null) {
      SplashScreen.hideAsync().catch((err) => {
        if (err && typeof err === 'object' && 'message' in err) {
          console.log("Error hiding splash screen:", (err as any).message);
        } else {
          console.log("Error hiding splash screen:", err);
        }
      });
    }
  }, [loaded, error]);

  if (!loaded && !error) {
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
          <Stack.Screen
            name="smart-detection"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="van-selection"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="origin-destination"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="date-time" options={{ headerShown: false }} />
          <Stack.Screen
            name="customer-details"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="pricing-tier"
            options={{ headerShown: false }}
          />
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
