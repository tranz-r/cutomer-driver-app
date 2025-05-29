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

  const handleContinueToLocation = () => {
    // Navigate to van selection with detected items data
    console.log("Navigating to van selection...");
    router.push("/van-selection");
  };

  return (
    <SafeAreaView className="flex-1 bg-white pt-4">
      <StatusBar style="dark" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-4">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Item Detection
          </Text>
          <Text className="text-sm text-gray-600 mb-4">
            Upload photos or videos of items you want to move and get an instant
            quote.
          </Text>

          {/* Skip Option */}
          <View className="bg-blue-50 rounded-lg p-4 mb-4">
            <Text className="text-sm font-medium text-blue-800 mb-2">
              Already know your move size?
            </Text>
            <TouchableOpacity
              className="bg-orange-500 py-2 px-4 rounded-md"
              onPress={() => router.push("/van-selection")}
            >
              <Text className="text-white text-center text-sm font-medium">
                Skip to Van and Driver Selection
              </Text>
            </TouchableOpacity>
          </View>

          <MediaUploader
            onMediaCaptured={handleMediaCaptured}
            isProcessing={isProcessing}
          />

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
                onPress={handleContinueToLocation}
              >
                <Text className="text-white text-center font-semibold text-lg mr-2">
                  Continue to Van Selection
                </Text>
                <ChevronRight size={20} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
