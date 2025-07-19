import React, { useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";

import { Menu } from "lucide-react-native";
import SmartDetection from "./components/SmartDetection";
import SlideOutMenu from "./components/SlideOutMenu";

export default function SmartDetectionScreen() {
  const [showSlideOutMenu, setShowSlideOutMenu] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">

      <SmartDetection onMenuPress={() => setShowSlideOutMenu(true)} />

      <SlideOutMenu
        visible={showSlideOutMenu}
        onClose={() => setShowSlideOutMenu(false)}
      />
    </SafeAreaView>
  );
}
