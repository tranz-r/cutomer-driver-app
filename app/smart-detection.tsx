import React, { useState } from "react";
import { SafeAreaView, View, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Menu } from "lucide-react-native";
import SmartDetection from "./components/SmartDetection";
import SlideOutMenu from "./components/SlideOutMenu";

export default function SmartDetectionScreen() {
  const [showSlideOutMenu, setShowSlideOutMenu] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#7080cc" />

      {/* Menu Button */}
      <View className="absolute top-16 left-4 z-50">
        <TouchableOpacity
          onPress={() => setShowSlideOutMenu(true)}
          className="bg-white/90 p-3 rounded-full shadow-lg border border-gray-200"
        >
          <Menu size={24} color="#7080cc" />
        </TouchableOpacity>
      </View>

      <SmartDetection />

      <SlideOutMenu
        visible={showSlideOutMenu}
        onClose={() => setShowSlideOutMenu(false)}
      />
    </SafeAreaView>
  );
}
