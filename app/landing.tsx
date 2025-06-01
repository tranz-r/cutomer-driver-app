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
      <StatusBar style="light" backgroundColor="#2563eb" />
      <View className="bg-blue-600 pt-40 pb-6">
        <View className="px-4">
          <Text className="text-2xl font-bold text-white mb-1">
            Welcome to Tranzr
          </Text>
          <Text className="text-sm text-blue-200">
            Professional moving services at your fingertips
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {/* Header */}
          <View className="items-center mb-6">
            <View className="bg-blue-600 rounded-full p-3 mb-3">
              <Text className="text-xl font-bold text-white">T</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Tranzr
            </Text>
          </View>

          {/* Services Overview */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
              Why Choose Tranzr?
            </Text>

            <View className="space-y-3">
              <View className="flex-row items-center bg-blue-50 p-3 rounded-xl">
                <View className="bg-blue-100 p-2 rounded-full mr-3">
                  <Clock size={20} color="#3b82f6" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-800">
                    Quick Quotes
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Get instant estimates using AI-powered item detection
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center bg-green-50 p-3 rounded-xl">
                <View className="bg-green-100 p-2 rounded-full mr-3">
                  <Shield size={20} color="#10b981" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-800">
                    Verified Drivers
                  </Text>
                  <Text className="text-sm text-gray-600">
                    All our drivers are background-checked and insured
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center bg-purple-50 p-3 rounded-xl">
                <View className="bg-purple-100 p-2 rounded-full mr-3">
                  <Calendar size={20} color="#8b5cf6" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-800">
                    Easy Bookings
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Schedule your move with just a few taps
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Sign In Option */}
          <View className="mb-4">
            <TouchableOpacity
              className="bg-gray-100 py-3 px-4 rounded-xl flex-row justify-center items-center mb-3 border border-gray-200"
              onPress={() => router.push("/auth")}
            >
              <Text className="text-gray-700 text-center font-semibold text-base">
                Already have an account? Sign In
              </Text>
            </TouchableOpacity>
          </View>

          {/* Get Started Button */}
          <TouchableOpacity
            className="bg-blue-600 py-3 px-4 rounded-xl flex-row justify-center items-center mb-4"
            onPress={handleGetStarted}
          >
            <Text className="text-white text-center font-semibold text-base mr-2">
              Get Moving Quote
            </Text>
            <ArrowRight size={18} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Driver option - moved to more visible location */}
      <View className="border-t border-gray-200 py-4 px-4 bg-gray-50">
        <TouchableOpacity
          className="flex-row items-center justify-center py-3 px-4 bg-white rounded-lg border border-gray-200"
          onPress={handleDriverFlow}
        >
          <Truck size={18} color="#4B5563" />
          <Text className="text-gray-700 ml-2 text-sm font-medium">
            I'm a driver - Join our team
          </Text>
        </TouchableOpacity>
      </View>
      <View className="h-8" />
    </SafeAreaView>
  );
}
