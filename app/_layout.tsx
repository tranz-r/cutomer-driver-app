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
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SessionProvider } from "../lib/contexts/SessionContext";

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
    <SafeAreaProvider>
      <SessionProvider>
        <CartProvider>
          <ThemeProvider value={DefaultTheme}>
            <Stack
              screenOptions={({ route }) => ({
                headerShown: !route.name.startsWith("tempobook") && !route.name.startsWith("(auth)"),
              })}
            >
              <Stack.Screen name="splash" options={{ headerShown: false }} />
              <Stack.Screen name="landing" options={{ headerShown: false }} />
              <Stack.Screen name="item-detection" options={{ headerShown: false, headerTitle: "Item Detection" }} />
              <Stack.Screen name="build-inventory" options={{ headerShown: false, headerTitle: "Build Inventory" }} />
              <Stack.Screen name="smart-detection" options={{ headerShown: false, headerTitle: "Smart Detection" }} />
              <Stack.Screen name="van-selection" options={{ headerShown: false, headerTitle: "Van Selection" }} />
              <Stack.Screen name="origin-destination" options={{ headerShown: false, headerTitle: "Origin & Destination" }} />
              <Stack.Screen name="date-time" options={{ headerShown: false, headerTitle: "Date & Time" }} />
              <Stack.Screen name="customer-details" options={{ headerShown: false, headerTitle: "Customer Details" }} />
              <Stack.Screen name="pricing-tier" options={{ headerShown: false, headerTitle: "Pricing Tier" }} />
              <Stack.Screen name="summary" options={{ headerShown: false, headerTitle: "Summary" }} />
              <Stack.Screen name="payment" options={{ headerShown: false, headerTitle: "Payment" }} />
              <Stack.Screen name="success" options={{ headerShown: false, headerTitle: "Success" }} />
              <Stack.Screen name="customer-dashboard" options={{ headerShown: false, headerTitle: "Customer Dashboard" }} />
              <Stack.Screen name="driver-dashboard" options={{ headerShown: false, headerTitle: "Driver Dashboard" }} />
              <Stack.Screen name="commercial-dashboard" options={{ headerShown: false, headerTitle: "Commercial Dashboard" }} />
              <Stack.Screen name="index" options={{ headerShown: false, headerTitle: "Index" }} />
            </Stack>
            <StatusBar style="auto" translucent={false} backgroundColor="#7080cc" />
          </ThemeProvider>
        </CartProvider>
      </SessionProvider>
    </SafeAreaProvider>
  );
}
