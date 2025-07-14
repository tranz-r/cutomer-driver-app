import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ChevronRight, Menu } from "lucide-react-native";
import { router } from "expo-router";
import VanSvg from "./components/VanSvg";
import InventorySvg from "./components/InventorySvg";
import SmartDetectionSvg from "./components/SmartDetectionSvg";
import SlideOutMenu from "./components/SlideOutMenu";

export default function ItemDetectionScreen() {
  const [showSlideOutMenu, setShowSlideOutMenu] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#7080cc" />
      <View style={{ backgroundColor: "#7080cc" }} className="pt-24 pb-6">
        <View className="px-4 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-white mb-1">
              Inventory Options Capture
            </Text>
            <Text className="text-sm text-white">
              Choose how you want to build your inventory
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowSlideOutMenu(true)}
            className="bg-white/20 p-3 rounded-full"
          >
            <Menu size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          <View>
            <Text className="text-lg font-semibold text-gray-800 mb-6 text-center">
              Do you know your move size?
            </Text>

            <View className="mb-6 space-y-4">
              {/* Van Selection Card */}
              <TouchableOpacity
                className="bg-white flex-row items-center justify-between rounded-2xl border border-blue-300 shadow-3xl px-5 py-4 mb-2"
                onPress={() => router.push("/van-selection")}
                style={{ minHeight: 80, elevation: 12 }}
                activeOpacity={0.85}
              >
                <View className="flex-1 pr-4">
                  <Text className="text-lg font-bold text-blue-700 mb-1">
                    Yes, Skip to Van Selection
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    I already know what van size I need
                  </Text>
                </View>
                <VanSvg width={96} height={56} />
                <ChevronRight size={28} color="#3b82f6" />
              </TouchableOpacity>

              {/* Build Inventory Card */}
              <TouchableOpacity
                className="bg-white flex-row items-center justify-between rounded-2xl border border-purple-300 shadow-3xl px-5 py-4 mb-2"
                onPress={() => router.push("/build-inventory")}
                style={{ minHeight: 80, elevation: 12 }}
                activeOpacity={0.85}
              >
                <View className="flex-1 pr-4">
                  <Text className="text-lg font-bold text-purple-700 mb-1">
                    Build Item Inventory
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    Start by searching and add items from our database
                  </Text>
                </View>
                <InventorySvg width={96} height={56} />
                <ChevronRight size={28} color="#a21caf" />
              </TouchableOpacity>

              {/* Smart Detection Card */}
              <TouchableOpacity
                className="bg-white flex-row items-center justify-between rounded-2xl border border-emerald-300 shadow-3xl px-5 py-4"
                onPress={() => router.push("/smart-detection")}
                style={{ minHeight: 80, elevation: 12 }}
                activeOpacity={0.85}
              >
                <View className="flex-1 pr-4">
                  <Text className="text-lg font-bold text-emerald-700 mb-1">
                    Use Tranzr Smart Detection
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    Start by uploading photos/videos to get accurate sizing
                  </Text>
                </View>
                <SmartDetectionSvg width={96} height={56} />
                <ChevronRight size={28} color="#059669" />
              </TouchableOpacity>
            </View>

            <View className="bg-amber-50 rounded-xl p-4 mt-4">
              <Text className="text-amber-800 text-sm text-center font-medium">
                💡 Tranzr Smart Detection uses AI to give you an inventory and
                estimate your items' volume from photos and videos. Review,
                adjust, or manually add items to get faster, more accurate
                quotes
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View className="h-8" />

      <SlideOutMenu
        visible={showSlideOutMenu}
        onClose={() => setShowSlideOutMenu(false)}
      />
    </SafeAreaView>
  );
}
