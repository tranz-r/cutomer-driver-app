import React from "react";
import { SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import SmartDetection from "./components/SmartDetection";

export default function SmartDetectionScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#7080cc" />
      <SmartDetection />
    </SafeAreaView>
  );
}
