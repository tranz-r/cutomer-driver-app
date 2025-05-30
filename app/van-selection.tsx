import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ChevronRight, Truck, Users } from "lucide-react-native";
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

  const handleContinueToLocation = () => {
    if (!selectedVan) return;
    // Navigate to origin-destination with selected options
    console.log("Selected van:", selectedVan);
    console.log("Selected drivers:", selectedDrivers);
    router.push("/origin-destination");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#1f2937" />
      <View className="bg-gray-800 h-12" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-4 pt-16">
          <Text className="text-3xl font-bold text-gray-900 mb-3">
            Select Van & Crew
          </Text>
          <Text className="text-base text-gray-600 mb-8 leading-relaxed">
            Choose the right van size and crew for your move.
          </Text>

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
                  onPress={() => van.id === "large" && setSelectedVan(van.id)}
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
    </SafeAreaView>
  );
}
