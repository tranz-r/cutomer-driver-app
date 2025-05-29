import React, { useEffect } from "react";
import { View, Text, Image } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/landing");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-blue-600 justify-center items-center px-4 pt-12">
      <StatusBar style="light" />

      <View className="items-center w-full max-w-sm">
        <View className="bg-white rounded-full p-4 mb-4">
          <Text className="text-3xl font-bold text-blue-600">T</Text>
        </View>

        <Text className="text-3xl font-bold text-white mb-2 text-center">
          Tranzr
        </Text>
        <Text className="text-base text-blue-100 text-center">
          Moving Made Simple
        </Text>
      </View>
    </View>
  );
}
