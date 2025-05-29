import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import {
  Clock,
  Shield,
  Calendar,
  Truck,
  ArrowRight,
} from "lucide-react-native";

export default function LandingScreen() {
  const handleGetStarted = () => {
    router.push("/item-detection");
  };

  const handleDriverFlow = () => {
    // Navigate to driver flow (placeholder for now)
    console.log("Navigate to driver flow");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScrollView className="flex-1">
        <View className="px-6 py-8">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="bg-blue-600 rounded-full p-4 mb-4">
              <Text className="text-2xl font-bold text-white">T</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-800 mb-2">
              Tranzr
            </Text>
            <Text className="text-lg text-gray-600 text-center">
              Professional moving services at your fingertips
            </Text>
          </View>

          {/* Services Overview */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Why Choose Tranzr?
            </Text>

            <View className="space-y-4">
              <View className="flex-row items-center bg-blue-50 p-4 rounded-xl">
                <View className="bg-blue-100 p-3 rounded-full mr-4">
                  <Clock size={24} color="#3b82f6" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-800">
                    Quick Quotes
                  </Text>
                  <Text className="text-gray-600">
                    Get instant estimates using AI-powered item detection
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center bg-green-50 p-4 rounded-xl">
                <View className="bg-green-100 p-3 rounded-full mr-4">
                  <Shield size={24} color="#10b981" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-800">
                    Verified Drivers
                  </Text>
                  <Text className="text-gray-600">
                    All our drivers are background-checked and insured
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center bg-purple-50 p-4 rounded-xl">
                <View className="bg-purple-100 p-3 rounded-full mr-4">
                  <Calendar size={24} color="#8b5cf6" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-800">
                    Easy Bookings
                  </Text>
                  <Text className="text-gray-600">
                    Schedule your move with just a few taps
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Get Started Button */}
          <TouchableOpacity
            className="bg-blue-600 py-4 px-6 rounded-xl flex-row justify-center items-center mb-6"
            onPress={handleGetStarted}
          >
            <Text className="text-white text-center font-semibold text-lg mr-2">
              Get Moving Quote
            </Text>
            <ArrowRight size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Driver option at bottom */}
      <View className="border-t border-gray-200 py-4 px-6">
        <TouchableOpacity
          className="flex-row items-center justify-center"
          onPress={handleDriverFlow}
        >
          <Truck size={16} color="#6B7280" />
          <Text className="text-gray-500 ml-2 text-sm">I'm a driver</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
