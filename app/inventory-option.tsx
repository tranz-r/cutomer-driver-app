import React, { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import VanSvg from "./components/VanSvg";
import InventorySvg from "./components/InventorySvg";
import SmartDetectionSvg from "./components/SmartDetectionSvg";
import { ChevronRight } from "lucide-react-native";

export default function InventoryOptionScreen() {
  const router = useRouter();
  const [showMediaUpload, setShowMediaUpload] = useState(false);

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      showsVerticalScrollIndicator={false}
    >
      <View className="px-4 py-6 flex-1 justify-center">
        {!showMediaUpload && (
          <View>
            <Text className="text-lg font-semibold text-gray-800 mb-10 text-center">
              Do you know your move size?
            </Text>

            <View className="mb-10 space-y-8">
              {/* Van Selection Card */}
              <TouchableOpacity
                className="bg-white flex-row items-center justify-between rounded-2xl border border-blue-300 shadow-3xl px-8 py-8 mb-4"
                onPress={() => router.push("/van-selection")}
                style={{ minHeight: 120, elevation: 16 }}
                activeOpacity={0.85}
              >
                <View className="flex-1 pr-6">
                  <Text className="text-2xl font-bold text-blue-700 mb-2">
                    Yes, Skip to Van Selection
                  </Text>
                  <Text className="text-gray-500 text-lg">
                    I already know what van size I need
                  </Text>
                </View>
                <VanSvg width={210} height={120} />
                <ChevronRight size={36} color="#3b82f6" />
              </TouchableOpacity>

              {/* Build Inventory Card */}
              <TouchableOpacity
                className="bg-white flex-row items-center justify-between rounded-2xl border border-purple-300 shadow-3xl px-8 py-8 mb-4"
                onPress={() => router.push("/build-inventory")}
                style={{ minHeight: 120, elevation: 16 }}
                activeOpacity={0.85}
              >
                <View className="flex-1 pr-6">
                  <Text className="text-2xl font-bold text-purple-700 mb-2">
                    Build Item Inventory
                  </Text>
                  <Text className="text-gray-500 text-lg">
                    Search and add items from our database
                  </Text>
                </View>
                <InventorySvg width={210} height={120} />
                <ChevronRight size={36} color="#a21caf" />
              </TouchableOpacity>

              {/* Smart Detection Card */}
              <TouchableOpacity
                className="bg-white flex-row items-center justify-between rounded-2xl border border-emerald-300 shadow-3xl px-8 py-8"
                onPress={() => setShowMediaUpload(true)}
                style={{ minHeight: 120, elevation: 16 }}
                activeOpacity={0.85}
              >
                <View className="flex-1 pr-6">
                  <Text className="text-2xl font-bold text-emerald-700 mb-2">
                    Use Tranzr Smart Detection
                  </Text>
                  <Text className="text-gray-500 text-lg">
                    Upload photos/videos to get accurate sizing
                  </Text>
                </View>
                <SmartDetectionSvg width={210} height={120} />
                <ChevronRight size={36} color="#059669" />
              </TouchableOpacity>
            </View>

            <View className="bg-amber-50 rounded-xl p-4 mt-8">
              <Text className="text-amber-800 text-base text-center font-medium">
                💡 Tranzr Smart Detection uses AI to give you an inventory and
                estimate your items' volume from photos and videos. Review,
                adjust, or manually add items to get faster, more accurate
                quotes
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
