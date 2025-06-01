import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  CheckCircle,
  Calendar,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react-native";
import { router } from "expo-router";

export default function SuccessScreen() {
  const scaleAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animate success icon
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 1.2,
        duration: 600,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate content
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 800,
        delay: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGoToDashboard = () => {
    router.replace("/customer-dashboard");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#059669" translucent={false} />

      {/* Header */}
      <View className="bg-emerald-600 pt-24 pb-6">
        <View className="px-4">
          <Text className="text-2xl font-bold text-white mb-1">
            Booking Complete
          </Text>
          <Text className="text-sm text-emerald-200">
            Your move has been successfully confirmed
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-8">
          {/* Success Animation */}
          <Animated.View
            className="items-center mb-8"
            style={{
              transform: [{ scale: scaleAnimation }],
            }}
          >
            <View className="bg-green-100 rounded-full p-6 mb-4">
              <CheckCircle size={64} color="#059669" />
            </View>
          </Animated.View>

          {/* Success Content */}
          <Animated.View
            className="items-center"
            style={{
              opacity: fadeAnimation,
              transform: [{ translateY: slideAnimation }],
            }}
          >
            <Text className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Booking Confirmed!
            </Text>

            <Text className="text-lg text-gray-600 text-center mb-8 leading-relaxed">
              Your move has been successfully booked. We've sent you a
              confirmation email with all the details.
            </Text>

            {/* Booking Details Card */}
            <View className="bg-blue-50 rounded-2xl p-6 mb-8 w-full border border-blue-200">
              <Text className="text-lg font-bold text-blue-900 mb-4">
                What's Next?
              </Text>

              <View className="space-y-3">
                <View className="flex-row items-center mb-3">
                  <View className="bg-blue-100 p-2 rounded-full mr-3">
                    <Mail size={16} color="#2563eb" />
                  </View>
                  <Text className="text-blue-800 flex-1">
                    Check your email for booking confirmation
                  </Text>
                </View>

                <View className="flex-row items-center mb-3">
                  <View className="bg-blue-100 p-2 rounded-full mr-3">
                    <Phone size={16} color="#2563eb" />
                  </View>
                  <Text className="text-blue-800 flex-1">
                    Our team will contact you 24 hours before your move
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <View className="bg-blue-100 p-2 rounded-full mr-3">
                    <Calendar size={16} color="#2563eb" />
                  </View>
                  <Text className="text-blue-800 flex-1">
                    Track your booking status in your dashboard
                  </Text>
                </View>
              </View>
            </View>

            {/* Important Information */}
            <View className="bg-amber-50 rounded-xl p-4 mb-8 w-full border border-amber-200">
              <Text className="text-amber-800 font-semibold mb-2">
                📋 Important Reminders
              </Text>
              <Text className="text-amber-700 text-sm leading-relaxed">
                • Please have all items packed and ready before our team arrives
                {"\n"}• Ensure clear access to both pickup and delivery
                locations{"\n"}• Keep your phone available for driver
                communication
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="w-full space-y-3">
              <TouchableOpacity
                className="bg-blue-600 py-4 px-6 rounded-xl flex-row justify-center items-center shadow-lg mb-4"
                onPress={handleGoToDashboard}
              >
                <Text className="text-white font-semibold text-lg mr-2">
                  Go to Dashboard
                </Text>
                <ArrowRight size={20} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-gray-100 py-4 px-6 rounded-xl flex-row justify-center items-center"
                onPress={() => router.push("/item-detection")}
              >
                <Text className="text-gray-700 font-semibold text-lg">
                  Book Another Move
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Support Contact */}
      <View className="px-6 pb-6 bg-gray-50 border-t border-gray-200">
        <Text className="text-center text-gray-500 text-sm mb-2 pt-4">
          Need help? Contact our support team
        </Text>
        <TouchableOpacity className="items-center">
          <Text className="text-blue-600 font-semibold">
            support@tranzr.com • +44 20 1234 5678
          </Text>
        </TouchableOpacity>
      </View>
      <View className="h-8" />
    </SafeAreaView>
  );
}
