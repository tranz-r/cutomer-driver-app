import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ChevronRight, Camera } from "lucide-react-native";
import { router } from "expo-router";
import MediaUploader from "./components/MediaUploader";
import DetectedItemsList from "./components/DetectedItemsList";
import ProcessingIndicator from "./components/ProcessingIndicator";
import VanSvg from "./components/VanSvg";
import InventorySvg from "./components/InventorySvg";
import SmartDetectionSvg from "./components/SmartDetectionSvg";
import { useCart } from "./contexts/CartContext";
import ShoppingCartIcon from "./components/ShoppingCartIcon";
import ShoppingCartModal from "./components/ShoppingCartModal";

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
    // Navigate to van-selection with detected items data
    console.log("Navigating to van-selection...");
    router.push("/van-selection");
  };

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
          <ShoppingCartIcon onPress={() => setShowCartModal(true)} />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {!showMediaUpload && (
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
                      Search and add items from our database
                    </Text>
                  </View>
                  <InventorySvg width={96} height={56} />
                  <ChevronRight size={28} color="#a21caf" />
                </TouchableOpacity>

                {/* Smart Detection Card */}
                <TouchableOpacity
                  className="bg-white flex-row items-center justify-between rounded-2xl border border-emerald-300 shadow-3xl px-5 py-4"
                  onPress={() => setShowMediaUpload(true)}
                  style={{ minHeight: 80, elevation: 12 }}
                  activeOpacity={0.85}
                >
                  <View className="flex-1 pr-4">
                    <Text className="text-lg font-bold text-emerald-700 mb-1">
                      Use Tranzr Smart Detection
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      Upload photos/videos to get accurate sizing
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
          )}

          {showMediaUpload && (
            <View>
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
                    onAddItem={(item) => {
                      // Only handle local state, don't add to cart here
                      console.log("Item added to detected list:", item.name);
                    }}
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
                      Continue
                    </Text>
                    <ChevronRight size={20} color="white" />
                  </TouchableOpacity>
                </View>
              )}

              <ShoppingCartModal
                visible={showCartModal}
                onClose={() => setShowCartModal(false)}
              />
            </View>
          )}
        </View>
      </ScrollView>
      <View className="h-8" />
    </SafeAreaView>
  );
}
