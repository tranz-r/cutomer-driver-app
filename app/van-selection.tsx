import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ChevronRight, Truck, Users, Package } from "lucide-react-native";
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
    // Navigate to location workflow with selected options
    console.log("Selected van:", selectedVan);
    console.log("Selected drivers:", selectedDrivers);
    // TODO: Pass data to location screen
    // router.push('/location-workflow');
  };

  return (
    <SafeAreaView className="flex-1 bg-white pt-12">
      <StatusBar style="dark" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-4">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Select Van & Crew
          </Text>
          <Text className="text-sm text-gray-600 mb-6">
            Choose the right van size and crew for your move.
          </Text>

          {/* Van Selection */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Choose Van Type
            </Text>
            {vanTypes.map((van) => (
              <TouchableOpacity
                key={van.id}
                className={`border rounded-lg p-4 mb-3 ${
                  selectedVan === van.id
                    ? "border-blue-500 bg-blue-50"
                    : van.id === "large"
                      ? "border-gray-200 bg-white"
                      : "border-gray-200 bg-gray-100"
                }`}
                onPress={() => van.id === "large" && setSelectedVan(van.id)}
                disabled={van.id !== "large"}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <View
                      className={`p-2 rounded-full mr-3 ${
                        van.id === "large" ? "bg-blue-100" : "bg-gray-200"
                      }`}
                    >
                      <Truck
                        size={20}
                        color={van.id === "large" ? "#3b82f6" : "#9ca3af"}
                      />
                    </View>
                    <View>
                      <Text
                        className={`text-base font-semibold ${
                          van.id === "large" ? "text-gray-800" : "text-gray-400"
                        }`}
                      >
                        {van.name}
                        {van.id !== "large" && " (Unavailable)"}
                      </Text>
                      <Text
                        className={`text-sm ${
                          van.id === "large" ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {van.capacity}
                      </Text>
                    </View>
                  </View>
                  <Text
                    className={`text-lg font-bold ${
                      van.id === "large" ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    {van.price}
                  </Text>
                </View>
                <Text
                  className={`text-xs mb-1 ${
                    van.id === "large" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Dimensions: {van.dimensions}
                </Text>
                <Text
                  className={`text-sm ${
                    van.id === "large" ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {van.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Driver Selection */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Choose Crew Size
            </Text>
            {driverOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                className={`border rounded-lg p-4 mb-3 ${
                  selectedDrivers === option.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
                onPress={() => setSelectedDrivers(option.id)}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <View className="bg-green-100 p-2 rounded-full mr-3">
                      <Users size={20} color="#10b981" />
                    </View>
                    <View>
                      <Text className="text-base font-semibold text-gray-800">
                        {option.count} Person{option.count > 1 ? "s" : ""}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {option.description}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-sm font-medium text-green-600">
                    {option.additionalCost}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Summary */}
          {selectedVan && (
            <View className="bg-gray-50 rounded-lg p-4 mb-6">
              <Text className="text-base font-semibold text-gray-800 mb-2">
                Your Selection
              </Text>
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-sm text-gray-600">Van:</Text>
                <Text className="text-sm font-medium text-gray-800">
                  {vanTypes.find((v) => v.id === selectedVan)?.name}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-sm text-gray-600">Crew:</Text>
                <Text className="text-sm font-medium text-gray-800">
                  {driverOptions.find((d) => d.id === selectedDrivers)?.count}{" "}
                  person{selectedDrivers !== "1" ? "s" : ""}
                </Text>
              </View>
              <View className="border-t border-gray-200 mt-2 pt-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-base font-semibold text-gray-800">
                    Estimated Rate:
                  </Text>
                  <Text className="text-base font-bold text-blue-600">
                    {vanTypes.find((v) => v.id === selectedVan)?.price}
                    {selectedDrivers !== "1" &&
                      ` ${driverOptions.find((d) => d.id === selectedDrivers)?.additionalCost}`}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity
            className={`py-4 px-6 rounded-xl flex-row justify-center items-center ${
              selectedVan ? "bg-blue-600" : "bg-gray-300"
            }`}
            onPress={handleContinueToLocation}
            disabled={!selectedVan}
          >
            <Text className="text-white text-center font-semibold text-lg mr-2">
              Continue to Location
            </Text>
            <ChevronRight size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
