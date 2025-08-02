import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  Image,
  Animated,
} from "react-native";
import { ChevronRight } from "lucide-react-native";
import { router } from "expo-router";
import MediaUploader from "./MediaUploader";
import DetectedItemsList from "./DetectedItemsList";
import ProcessingIndicator from "./ProcessingIndicator";
import { useCart } from "../contexts/CartContext";

import InventoryCartModal from "./InventoryCartModal";

interface MediaItem {
  uri: string;
  type: "photo" | "video";
  id: string;
}

export default function SmartDetection() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDetectedItems, setShowDetectedItems] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [progress, setProgress] = useState(0);
  const [processingMessage, setProcessingMessage] =
    useState("Detecting items...");
  const [showCartModal, setShowCartModal] = useState(false);
  const [isMediaUploaderCollapsed, setIsMediaUploaderCollapsed] =
    useState(false);
  const { addItem } = useCart();

  const handleDetectItems = () => {
    if (mediaItems.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setProcessingMessage("Uploading media to backend...");

    // Simulate backend processing with progress updates
    const progressSteps = [
      { progress: 0.2, message: "Uploading media to backend..." },
      { progress: 0.4, message: "Analyzing images with AI..." },
      { progress: 0.6, message: "Detecting your items..." },
      { progress: 0.8, message: "Calculating dimensions..." },
      { progress: 1.9, message: "Processing complete!" },
      { progress: 1.0, message: "Adding items to your inventory cart!" },
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
          setIsMediaUploaderCollapsed(true);
        }, 500);
      }
    }, 600);
  };

  const handleMediaCaptured = (media: MediaItem[]) => {
    setMediaItems(media);
    // Reset detection state when media changes
    if (showDetectedItems) {
      setShowDetectedItems(false);
      setIsMediaUploaderCollapsed(false);
    }
  };

  const handleContinueToVanSelection = () => {
    // Navigate to build-inventory screen
    console.log("Navigating to build-inventory...");
    router.push("/build-inventory");
  };

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 py-6">
          <MediaUploader
            onMediaCaptured={handleMediaCaptured}
            isProcessing={isProcessing}
            isCollapsed={isMediaUploaderCollapsed}
            onToggleCollapse={() =>
              setIsMediaUploaderCollapsed(!isMediaUploaderCollapsed)
            }
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
              <DetectedItemsList
                onAddToCart={(item) => {
                  addItem({
                    id: Date.now().toString(),
                    name: item.name,
                    height: item.height,
                    width: item.width,
                    length: item.length,
                    volume: item.volume,
                  });
                }}
                autoAddToCart={true}
              />

              <TouchableOpacity
                className="mt-8 py-4 px-6 rounded-xl flex-row justify-center items-center"
                style={{ backgroundColor: "#70AECC" }}
                onPress={handleContinueToVanSelection}
              >
                <Text className="text-white text-center font-semibold text-lg mr-2">
                  Continue to Build Inventory
                </Text>
                <ChevronRight size={20} color="white" />
              </TouchableOpacity>
            </View>
          )}

          <InventoryCartModal
            visible={showCartModal}
            onClose={() => setShowCartModal(false)}
          />
        </View>
      </ScrollView>
      <View className="h-8 bg-white" />
    </View>
  );
}
