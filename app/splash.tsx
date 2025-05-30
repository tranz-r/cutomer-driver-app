import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing, Dimensions } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Truck } from "lucide-react-native";

const { width: screenWidth } = Dimensions.get("window");

export default function SplashScreen() {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(-50)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleSlide = useRef(new Animated.Value(50)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const truckPosition = useRef(new Animated.Value(-screenWidth)).current;
  const truckBounce = useRef(new Animated.Value(0)).current;
  const roadOpacity = useRef(new Animated.Value(0)).current;
  const backgroundGradient = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sophisticated sequence of animations
    const animationSequence = Animated.sequence([
      // Phase 1: Background gradient fade in
      Animated.timing(backgroundGradient, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),

      // Phase 2: Logo entrance with scale, rotation and fade
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(logoRotation, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),

      // Phase 3: Title slide in from left
      Animated.parallel([
        Animated.timing(titleSlide, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),

      // Phase 4: Subtitle slide in from right
      Animated.parallel([
        Animated.timing(subtitleSlide, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),

      // Phase 5: Road appears
      Animated.timing(roadOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),

      // Phase 6: Truck drives across with bounce effect
      Animated.parallel([
        Animated.timing(truckPosition, {
          toValue: screenWidth + 50,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(truckBounce, {
              toValue: -3,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(truckBounce, {
              toValue: 3,
              duration: 150,
              useNativeDriver: true,
            }),
          ]),
          { iterations: 7 },
        ),
      ]),
    ]);

    animationSequence.start();

    const timer = setTimeout(() => {
      router.replace("/landing");
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const logoRotationInterpolate = logoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      className="flex-1 justify-center items-center px-4"
      style={{
        backgroundColor: backgroundGradient.interpolate({
          inputRange: [0, 1],
          outputRange: ["#1e40af", "#3b82f6"],
        }),
      }}
    >
      <StatusBar style="light" />

      <View className="items-center w-full max-w-sm">
        {/* Animated Logo */}
        <Animated.View
          className="bg-white rounded-full p-6 mb-6 shadow-2xl"
          style={{
            opacity: logoOpacity,
            transform: [
              { scale: logoScale },
              { rotate: logoRotationInterpolate },
            ],
          }}
        >
          <Text className="text-4xl font-bold text-blue-600">T</Text>
        </Animated.View>

        {/* Animated Title */}
        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateX: titleSlide }],
          }}
        >
          <Text className="text-4xl font-bold text-white mb-3 text-center">
            Tranzr
          </Text>
        </Animated.View>

        {/* Animated Subtitle */}
        <Animated.View
          style={{
            opacity: subtitleOpacity,
            transform: [{ translateX: subtitleSlide }],
          }}
        >
          <Text className="text-lg text-blue-100 text-center mb-12">
            Moving Made Simple
          </Text>
        </Animated.View>

        {/* Animated Road and Truck */}
        <View className="w-full h-20 relative overflow-hidden">
          {/* Road with dashed lines */}
          <Animated.View
            className="absolute bottom-6 left-0 right-0 h-1 bg-blue-200"
            style={{ opacity: roadOpacity }}
          />
          <Animated.View
            className="absolute bottom-5 left-0 right-0 h-0.5 bg-white opacity-60"
            style={{ opacity: roadOpacity }}
          />

          {/* Animated Truck */}
          <Animated.View
            className="absolute top-2"
            style={{
              transform: [
                { translateX: truckPosition },
                { translateY: truckBounce },
              ],
            }}
          >
            <View className="bg-white rounded-lg p-2 shadow-lg">
              <Truck size={28} color="#3b82f6" />
            </View>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
}
