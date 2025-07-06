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
import Svg, { Path } from "react-native-svg";

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
      <View className="bg-blue-600 pt-24 pb-6">
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
          {/* Services Overview */}
          <View className="mb-8">
            <View className="space-y-4">
              <View className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-2xl shadow-sm border border-blue-200">
                <View className="flex-row items-center">
                  <View className="bg-blue-500 p-3 rounded-full mr-4">
                    <Clock size={24} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-blue-900 mb-1">
                      Quick Quotes
                    </Text>
                    <Text className="text-sm text-blue-700">
                      Get instant estimates using AI-powered item detection
                    </Text>
                  </View>
                </View>
              </View>

              <View className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-2xl shadow-sm border border-green-200">
                <View className="flex-row items-center">
                  <View className="bg-green-500 p-3 rounded-full mr-4">
                    <Shield size={24} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-green-900 mb-1">
                      Verified Drivers
                    </Text>
                    <Text className="text-sm text-green-700">
                      All our drivers are background-checked and insured
                    </Text>
                  </View>
                </View>
              </View>

              <View className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-2xl shadow-sm border border-purple-200">
                <View className="flex-row items-center">
                  <View className="bg-purple-500 p-3 rounded-full mr-4">
                    <Calendar size={24} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-purple-900 mb-1">
                      Easy Bookings
                    </Text>
                    <Text className="text-sm text-purple-700">
                      Schedule your move with just a few taps
                    </Text>
                  </View>
                </View>
              </View>

              <View className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-2xl shadow-sm border border-orange-200">
                <View className="flex-row items-center">
                  <View className="bg-orange-500 p-3 rounded-full mr-4">
                    <Truck size={24} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-orange-900 mb-1">
                      Professional Service
                    </Text>
                    <Text className="text-sm text-orange-700">
                      Experienced movers with modern equipment
                    </Text>
                  </View>
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
