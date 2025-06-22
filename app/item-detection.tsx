import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ChevronRight } from "lucide-react-native";
import { router } from "expo-router";
import MediaUploader from "./components/MediaUploader";
import DetectedItemsList from "./components/DetectedItemsList";
import ProcessingIndicator from "./components/ProcessingIndicator";

interface MediaItem {
  uri: string;
  type: "photo" | "video";
  id: string;
}

export default function ItemDetectionScreen() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDetectedItems, setShowDetectedItems] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [progress, setProgress] = useState(0);
  const [processingMessage, setProcessingMessage] =
    useState("Detecting items...");
  const [showMediaUpload, setShowMediaUpload] = useState(false);

  const handleDetectItems = () => {
    if (mediaItems.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setProcessingMessage("Uploading media to backend...");

    // Simulate backend processing with progress updates
    const progressSteps = [
      { progress: 0.2, message: "Uploading media to backend..." },
      { progress: 0.4, message: "Analyzing images with AI..." },
      { progress: 0.6, message: "Detecting furniture items..." },
      { progress: 0.8, message: "Calculating dimensions..." },
      { progress: 1.0, message: "Processing complete!" },
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < progressSteps.length) {
        const step = progressSteps[stepIndex];
        setProgress(step.progress);
        setProcessingMessage(step.message);
        stepIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessing(false);
          setShowDetectedItems(true);
        }, 500);
      }
    }, 600);
  };

  const handleMediaCaptured = (media: MediaItem[]) => {
    setMediaItems(media);
    // Reset detection state when media changes
    if (showDetectedItems) {
      setShowDetectedItems(false);
    }
  };

  const handleContinueToVanSelection = () => {
    // Navigate to van-selection with detected items data
    console.log("Navigating to van-selection...");
    router.push("/van-selection");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#059669" />
      <View className="bg-emerald-600 pt-24 pb-6">
        <View className="px-4">
          <Text className="text-2xl font-bold text-white mb-1">
            Item Detection
          </Text>
          <Text className="text-sm text-emerald-200">
            Get an instant quote for your move
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {!showMediaUpload && (
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-6 text-center">
                Do you know your move size?
              </Text>

              <View className="mb-6">
                <TouchableOpacity
                  className="bg-blue-600 py-4 px-6 rounded-xl shadow-lg mb-4"
                  onPress={() => router.push("/van-selection")}
                >
                  <Text className="text-white text-center font-semibold text-lg">
                    Yes, Skip to Van Selection
                  </Text>
                  <Text className="text-blue-100 text-center text-sm mt-1">
                    I already know what van size I need
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-emerald-600 py-4 px-6 rounded-xl shadow-lg"
                  onPress={() => setShowMediaUpload(true)}
                >
                  <Text className="text-white text-center font-semibold text-lg">
                    No, Use Tranzr Smart Detection
                  </Text>
                  <Text className="text-emerald-100 text-center text-sm mt-1">
                    Upload photos/videos to get accurate sizing
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <Text className="text-amber-800 text-sm text-center font-medium">
                  💡 Tranzr Smart Detection uses AI to give you an inventory and
                  estimate your items' volume from photos and videos. Review,
                  adjust, or manually add items to get faster, more accurate
                  quotes
                </Text>
              </View>
            </View>
          )}

          {showMediaUpload && (
            <View>
              <MediaUploader
                onMediaCaptured={handleMediaCaptured}
                isProcessing={isProcessing}
              />

              <View className="bg-orange-50 border border-orange-200 rounded-xl p-4 mt-4">
                <Text className="text-orange-800 text-sm text-center font-medium">
                  ⚠️ Important: Make sure all items are clearly visible in your
                  photos/videos. Smart Detection cannot identify items hidden
                  behind other objects. You can manually add any missed items
                  after detection.
                </Text>
              </View>

              {!isProcessing && !showDetectedItems && (
                <TouchableOpacity
                  className={`mt-6 py-4 px-6 rounded-xl ${
                    mediaItems.length > 0 ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  onPress={handleDetectItems}
                  disabled={mediaItems.length === 0}
                >
                  <Text className="text-white text-center font-semibold text-lg">
                    Detect Items ({mediaItems.length} media files)
                  </Text>
                </TouchableOpacity>
              )}

              {isProcessing && (
                <View className="mt-6">
                  <ProcessingIndicator
                    isProcessing={isProcessing}
                    progress={progress}
                    message={processingMessage}
                  />
                </View>
              )}

              {showDetectedItems && (
                <View className="mt-6">
                  <DetectedItemsList />

                  <TouchableOpacity
                    className="mt-8 py-4 px-6 rounded-xl bg-blue-600 flex-row justify-center items-center"
                    onPress={handleContinueToVanSelection}
                  >
                    <Text className="text-white text-center font-semibold text-lg mr-2">
                      Continue to Van and Driver Selection
                    </Text>
                    <ChevronRight size={20} color="white" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      <View className="h-8" />
    </SafeAreaView>
  );
}
