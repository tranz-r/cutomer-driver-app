import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  Image,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ChevronRight, Truck, Users, X, Package } from "lucide-react-native";
import { router } from "expo-router";

type VanType = {
  id: string;
  name: string;
  capacity: string;
  dimensions: string;
  price: string;
  description: string;
};

type DriverOption = {
  id: string;
  count: number;
  description: string;
  additionalCost: string;
};

export default function VanSelectionScreen() {
  const [selectedVan, setSelectedVan] = useState<string | null>("large");
  const [selectedDrivers, setSelectedDrivers] = useState<string>("1");
  const [showVanModal, setShowVanModal] = useState(false);
  const [selectedVanDetails, setSelectedVanDetails] = useState<VanType | null>(
    null,
  );
  const [lastTap, setLastTap] = useState<number>(0);

  const vanTypes: VanType[] = [
    {
      id: "small",
      name: "Small Van",
      capacity: "Up to 10m³",
      dimensions: "3.5m × 1.7m × 1.8m",
      price: "£45/hour",
      description: "Perfect for studio apartments or small moves",
    },
    {
      id: "medium",
      name: "Medium Van",
      capacity: "Up to 20m³",
      dimensions: "4.2m × 1.8m × 1.9m",
      price: "£65/hour",
      description: "Ideal for 1-2 bedroom apartments",
    },
    {
      id: "large",
      name: "Luton Van",
      capacity: "Up to 35m³",
      dimensions: "5.5m × 2.1m × 2.2m",
      price: "£85/hour",
      description: "Great for 3-4 bedroom houses",
    },
    {
      id: "xlarge",
      name: "Extra Large Van",
      capacity: "Up to 50m³",
      dimensions: "6.2m × 2.4m × 2.5m",
      price: "£110/hour",
      description: "Perfect for large houses or offices",
    },
  ];

  const driverOptions: DriverOption[] = [
    {
      id: "1",
      count: 1,
      description: "Driver only - you help with loading",
      additionalCost: "Included",
    },
    {
      id: "2",
      count: 2,
      description: "Driver + 1 helper for loading/unloading",
      additionalCost: "+£25/hour",
    },
    {
      id: "3",
      count: 3,
      description: "Driver + 2 helpers for heavy items",
      additionalCost: "+£45/hour",
    },
  ];

  const handleVanTap = (van: VanType) => {
    if (van.id !== "large") return;

    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (lastTap && now - lastTap < DOUBLE_TAP_DELAY) {
      // Double tap detected
      setSelectedVanDetails(van);
      setShowVanModal(true);
    } else {
      // Single tap
      setSelectedVan(van.id);
    }
    setLastTap(now);
  };

  const handleContinueToLocation = () => {
    if (!selectedVan) return;
    // Navigate to origin-destination with selected options
    console.log("Selected van:", selectedVan);
    console.log("Selected drivers:", selectedDrivers);
    router.push("/origin-destination");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#ea580c" />
      <View className="bg-orange-600 pt-16 pb-6">
        <View className="px-6">
          <Text className="text-2xl font-bold text-white mb-1">
            Select Van & Crew
          </Text>
          <Text className="text-sm text-orange-200">
            Choose the right van size and crew for your move.
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-6">
          {/* Van Selection */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Choose Van Type
            </Text>
            <View className="space-y-3">
              {vanTypes.map((van) => (
                <TouchableOpacity
                  key={van.id}
                  className={`rounded-xl p-5 shadow-sm border-2 ${
                    selectedVan === van.id
                      ? "border-blue-500 bg-blue-50"
                      : van.id === "large"
                        ? "border-gray-200 bg-white"
                        : "border-gray-100 bg-gray-50"
                  } ${van.id !== "large" ? "opacity-50" : ""}`}
                  onPress={() => handleVanTap(van)}
                  disabled={van.id !== "large"}
                  style={{ marginBottom: 12 }}
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-row items-start flex-1">
                      <View
                        className={`p-3 rounded-xl mr-4 ${
                          van.id === "large" ? "bg-blue-100" : "bg-gray-200"
                        }`}
                      >
                        <Truck
                          size={24}
                          color={van.id === "large" ? "#3b82f6" : "#9ca3af"}
                        />
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center mb-1">
                          <Text
                            className={`text-lg font-bold ${
                              van.id === "large"
                                ? "text-gray-900"
                                : "text-gray-400"
                            }`}
                          >
                            {van.name}
                          </Text>
                          {van.id === "large" && (
                            <View className="ml-3 bg-green-100 px-3 py-1 rounded-full">
                              <Text className="text-green-600 text-xs font-semibold">
                                Double-tap for details
                              </Text>
                            </View>
                          )}
                          {van.id !== "large" && (
                            <View className="ml-3 bg-red-100 px-3 py-1 rounded-full">
                              <Text className="text-red-600 text-xs font-semibold">
                                Unavailable
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text
                          className={`text-base font-medium mb-2 ${
                            van.id === "large"
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                        >
                          {van.capacity}
                        </Text>
                        <Text
                          className={`text-sm mb-1 ${
                            van.id === "large"
                              ? "text-gray-500"
                              : "text-gray-400"
                          }`}
                        >
                          Dimensions: {van.dimensions}
                        </Text>
                        <Text
                          className={`text-sm ${
                            van.id === "large"
                              ? "text-gray-600"
                              : "text-gray-400"
                          }`}
                        >
                          {van.description}
                        </Text>
                      </View>
                    </View>
                    <View className="ml-4">
                      <Text
                        className={`text-xl font-bold ${
                          van.id === "large" ? "text-blue-600" : "text-gray-400"
                        }`}
                      >
                        {van.price}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Driver Selection */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Choose Crew Size
            </Text>
            <View className="space-y-3">
              {driverOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  className={`rounded-xl p-5 shadow-sm border-2 ${
                    selectedDrivers === option.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                  onPress={() => setSelectedDrivers(option.id)}
                  style={{ marginBottom: 12 }}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <View className="bg-green-100 p-3 rounded-xl mr-4">
                        <Users size={24} color="#10b981" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-900 mb-1">
                          {option.count} Person{option.count > 1 ? "s" : ""}
                        </Text>
                        <Text className="text-sm text-gray-600 leading-relaxed">
                          {option.description}
                        </Text>
                      </View>
                    </View>
                    <View className="ml-4">
                      <Text className="text-base font-bold text-green-600">
                        {option.additionalCost}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Summary */}
          {selectedVan && (
            <View className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <Text className="text-xl font-bold text-gray-900 mb-4">
                Your Selection
              </Text>
              <View className="space-y-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-base text-gray-600">Van:</Text>
                  <Text className="text-base font-semibold text-gray-900">
                    {vanTypes.find((v) => v.id === selectedVan)?.name}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-base text-gray-600">Crew:</Text>
                  <Text className="text-base font-semibold text-gray-900">
                    {driverOptions.find((d) => d.id === selectedDrivers)?.count}{" "}
                    person{selectedDrivers !== "1" ? "s" : ""}
                  </Text>
                </View>
                <View className="border-t border-blue-200 mt-4 pt-4">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-lg font-bold text-gray-900">
                      Estimated Rate:
                    </Text>
                    <Text className="text-lg font-bold text-blue-600">
                      {vanTypes.find((v) => v.id === selectedVan)?.price}
                      {selectedDrivers !== "1" &&
                        ` ${driverOptions.find((d) => d.id === selectedDrivers)?.additionalCost}`}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity
            className={`py-5 px-8 rounded-2xl flex-row justify-center items-center shadow-lg ${
              selectedVan ? "bg-blue-600" : "bg-gray-300"
            }`}
            onPress={handleContinueToLocation}
            disabled={!selectedVan}
          >
            <Text className="text-white text-center font-bold text-lg mr-3">
              Continue to Origin & Destination
            </Text>
            <ChevronRight size={22} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View className="h-8" />

      {/* Van Details Modal */}
      <Modal
        visible={showVanModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowVanModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/80 px-4">
          <View className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-5/6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-3xl font-bold text-gray-900">
                {selectedVanDetails?.name}
              </Text>
              <TouchableOpacity
                onPress={() => setShowVanModal(false)}
                className="p-2 rounded-full bg-gray-100"
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-6">
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
                  }}
                  className="w-full h-56 rounded-xl"
                  resizeMode="cover"
                />
              </View>

              <View className="space-y-6 mb-6">
                <View className="bg-blue-50 p-5 rounded-xl">
                  <Text className="text-blue-800 font-semibold text-lg mb-2">
                    About This Van
                  </Text>
                  <Text className="text-blue-700 text-base leading-relaxed">
                    {selectedVanDetails?.description}. This van is perfect for
                    medium to large moves and comes equipped with professional
                    moving equipment.
                  </Text>
                </View>

                <View className="flex-row items-start">
                  <Package size={24} color="#3b82f6" />
                  <View className="ml-4 flex-1">
                    <Text className="text-sm text-gray-600 uppercase tracking-wide font-medium">
                      Load Capacity
                    </Text>
                    <Text className="text-xl font-bold text-gray-900 mt-1">
                      {selectedVanDetails?.capacity}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      Suitable for 3-4 bedroom houses with furniture and boxes
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-start">
                  <Truck size={24} color="#10b981" />
                  <View className="ml-4 flex-1">
                    <Text className="text-sm text-gray-600 uppercase tracking-wide font-medium">
                      Dimensions
                    </Text>
                    <Text className="text-xl font-bold text-gray-900 mt-1">
                      {selectedVanDetails?.dimensions}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      Length × Width × Height (internal cargo space)
                    </Text>
                  </View>
                </View>

                <View className="bg-green-50 p-5 rounded-xl">
                  <Text className="text-green-800 font-semibold text-lg mb-3">
                    Van Features
                  </Text>
                  <View className="space-y-2">
                    <Text className="text-green-700 text-base">
                      • Tail lift for easy loading
                    </Text>
                    <Text className="text-green-700 text-base">
                      • Professional moving blankets included
                    </Text>
                    <Text className="text-green-700 text-base">
                      • Secure tie-down points
                    </Text>
                    <Text className="text-green-700 text-base">
                      • GPS tracking for peace of mind
                    </Text>
                    <Text className="text-green-700 text-base">
                      • Fully insured and licensed
                    </Text>
                  </View>
                </View>

                <View className="bg-amber-50 p-5 rounded-xl">
                  <Text className="text-amber-800 font-semibold text-lg mb-2">
                    What Can Fit?
                  </Text>
                  <Text className="text-amber-700 text-base leading-relaxed">
                    Typically accommodates: 3-4 bedroom house contents,
                    including sofas, beds, wardrobes, dining sets, appliances,
                    and 40-60 moving boxes.
                  </Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              className="bg-blue-600 py-4 px-6 rounded-xl mt-4"
              onPress={() => {
                setShowVanModal(false);
                if (selectedVanDetails) {
                  setSelectedVan(selectedVanDetails.id);
                }
              }}
            >
              <Text className="text-white text-center font-semibold text-lg">
                Select This Van
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
