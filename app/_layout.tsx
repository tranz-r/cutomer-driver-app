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
import HeaderRightButtons from "./components/HeaderRightButtons";
import HeaderMenuOnly from "./components/HeaderMenuOnly";

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
                headerShown: !route.name.startsWith("tempobook"),
                headerStyle: {
                  backgroundColor: '#9568b0',
                },
                headerTintColor: 'white',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                headerRightContainerStyle: {
                  paddingRight: 12,
                },
              })}
            >
              <Stack.Screen name="splash" options={{ headerShown: false }} />
              <Stack.Screen name="landing" options={{ headerShown: false }} />
              <Stack.Screen name="item-detection" options={{ 
                headerShown: true, 
                headerTitle: "Item Detection",
                headerRight: () => <HeaderMenuOnly />,
              }} />
              <Stack.Screen name="build-inventory" options={{ 
                headerShown: true, 
                headerTitle: "Build Your Inventory",
                headerRight: () => <HeaderRightButtons />,
              }} />
              <Stack.Screen name="smart-detection" options={{ 
                headerShown: true, 
                headerTitle: "Smart Detection",
                headerRight: () => <HeaderRightButtons />,
              }} />
              <Stack.Screen name="van-selection" options={{ 
                headerShown: true, 
                headerTitle: "Van Selection",
                headerRight: () => <HeaderRightButtons />,
              }} />
              <Stack.Screen name="origin-destination" options={{ 
                headerShown: true, 
                headerTitle: "Origin & Destination",
                headerRight: () => <HeaderRightButtons />,
              }} />
              <Stack.Screen name="date-time" options={{ 
                headerShown: true, 
                headerTitle: "Date & Time",
                headerRight: () => <HeaderRightButtons />,
              }} />
              <Stack.Screen name="customer-details" options={{ 
                headerShown: true, 
                headerTitle: "Customer Details",
                headerRight: () => <HeaderRightButtons />,
              }} />
              <Stack.Screen name="pricing-tier" options={{ 
                headerShown: true, 
                headerTitle: "Pricing Tier",
                headerRight: () => <HeaderRightButtons />,
              }} />
              <Stack.Screen name="summary" options={{ 
                headerShown: true, 
                headerTitle: "Summary",
                headerRight: () => <HeaderMenuOnly />,
              }} />
              <Stack.Screen name="payment" options={{ 
                headerShown: true, 
                headerTitle: "Payment",
                headerRight: () => <HeaderMenuOnly />,
              }} />
              <Stack.Screen name="success" options={{ 
                headerShown: true, 
                headerTitle: "Success",
                headerRight: () => <HeaderMenuOnly />,
              }} />
              <Stack.Screen name="customer-dashboard" options={{ 
                headerShown: true, 
                headerTitle: "Customer Dashboard",
                headerRight: () => <HeaderMenuOnly />,
              }} />
              <Stack.Screen name="driver-dashboard" options={{ 
                headerShown: true, 
                headerTitle: "Driver Dashboard",
                headerRight: () => <HeaderMenuOnly />,
              }} />
              <Stack.Screen name="commercial-dashboard" options={{ 
                headerShown: true, 
                headerTitle: "Commercial Dashboard",
                headerRight: () => <HeaderMenuOnly />,
              }} />
              <Stack.Screen name="login" options={{ 
                headerShown: true, 
                headerTitle: "Sign In",
                headerRight: () => <HeaderMenuOnly />,
              }} />
              <Stack.Screen name="otp-verify" options={{ 
                headerShown: true, 
                headerTitle: "Verify OTP",
                headerRight: () => <HeaderMenuOnly />,
              }} />
              <Stack.Screen name="inventory-option" options={{ 
                headerShown: true, 
                headerTitle: "Inventory Options",
                headerRight: () => <HeaderMenuOnly />,
              }} />
              <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
                              <StatusBar style="auto" translucent={false} backgroundColor="#9568b0" />
          </ThemeProvider>
        </CartProvider>
      </SessionProvider>
    </SafeAreaProvider>
  );
}
