import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ChevronRight, Truck } from "lucide-react-native";
import MediaUploader from "./components/MediaUploader";
import DetectedItemsList from "./components/DetectedItemsList";
import ProcessingIndicator from "./components/ProcessingIndicator";

export default function HomeScreen() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDetectedItems, setShowDetectedItems] = useState(false);
  const [mediaUploaded, setMediaUploaded] = useState(false);

  const handleDetectItems = () => {
    if (!mediaUploaded) return;

    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setShowDetectedItems(true);
    }, 3000);
  };

  const handleMediaUpload = (hasMedia) => {
    setMediaUploaded(hasMedia);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScrollView className="flex-1">
        <View className="px-4 py-6">
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            Item Detection
          </Text>
          <Text className="text-base text-gray-600 mb-6">
            Upload photos or videos of items you want to move and get an instant
            quote.
          </Text>

          <MediaUploader onMediaChange={handleMediaUpload} />

          {!isProcessing && !showDetectedItems && (
            <TouchableOpacity
              className={`mt-6 py-4 px-6 rounded-xl ${mediaUploaded ? "bg-blue-600" : "bg-gray-300"}`}
              onPress={handleDetectItems}
              disabled={!mediaUploaded}
            >
              <Text className="text-white text-center font-semibold text-lg">
                Detect Items
              </Text>
            </TouchableOpacity>
          )}

          {isProcessing && (
            <View className="mt-6">
              <ProcessingIndicator />
            </View>
          )}

          {showDetectedItems && (
            <View className="mt-6">
              <DetectedItemsList />

              <TouchableOpacity className="mt-8 py-4 px-6 rounded-xl bg-blue-600 flex-row justify-center items-center">
                <Text className="text-white text-center font-semibold text-lg mr-2">
                  Continue to Location
                </Text>
                <ChevronRight size={20} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Driver option at bottom */}
      <View className="border-t border-gray-200 py-4 px-6">
        <TouchableOpacity className="flex-row items-center justify-center">
          <Truck size={16} color="#6B7280" />
          <Text className="text-gray-500 ml-2 text-sm">I'm a driver</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
