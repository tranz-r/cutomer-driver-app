import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";
import { ActivityIndicator } from "react-native";
import { Loader2 } from "lucide-react-native";

interface ProcessingIndicatorProps {
  isProcessing?: boolean;
  progress?: number;
  message?: string;
}

export default function ProcessingIndicator({
  isProcessing = true,
  progress = 0,
  message = "Detecting items...",
}: ProcessingIndicatorProps) {
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isProcessing) {
      // Animate progress bar
      Animated.timing(progressAnimation, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,
        easing: Easing.out(Easing.ease),
      }).start();

      // Animate spinner
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      // Reset animations when not processing
      progressAnimation.setValue(0);
      spinValue.stopAnimation();
    }
  }, [isProcessing, progress]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (!isProcessing) return null;

  return (
    <View className="w-full bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-base font-medium text-gray-800">{message}</Text>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Loader2 size={20} color="#3b82f6" />
        </Animated.View>
      </View>

      <View className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <Animated.View
          className="h-full bg-blue-500"
          style={{
            width: progressAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
          }}
        />
      </View>

      <Text className="text-xs text-gray-500 mt-1 text-right">
        {Math.round(progress * 100)}%
      </Text>
    </View>
  );
}
