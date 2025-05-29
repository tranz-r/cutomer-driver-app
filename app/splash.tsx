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
    <View className="flex-1 bg-blue-600 justify-center items-center">
      <StatusBar style="light" />

      <View className="items-center">
        <View className="bg-white rounded-full p-6 mb-6">
          <Text className="text-4xl font-bold text-blue-600">T</Text>
        </View>

        <Text className="text-4xl font-bold text-white mb-2">Tranzr</Text>
        <Text className="text-lg text-blue-100">Moving Made Simple</Text>
      </View>
    </View>
  );
}
