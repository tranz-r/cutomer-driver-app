import React from "react";
import { SafeAreaView } from "react-native";
import SmartDetection from "./components/SmartDetection";

export default function SmartDetectionScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <SmartDetection />
    </SafeAreaView>
  );
}
