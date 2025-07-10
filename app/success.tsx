import React, { useEffect, useRef, useState } from "react";
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
  Hash,
} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function SuccessScreen() {
  const { confirmation } = useLocalSearchParams();
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const scaleAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Set confirmation number from params or generate a new one
    const confNum = confirmation || "TRZ" + Date.now().toString().slice(-6);
    setConfirmationNumber(confNum.toString());

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
  }, [confirmation]);

  const handleGoToDashboard = () => {
    // Navigate to auth screen with redirect parameter
    router.push("/auth?redirectTo=dashboard");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#7080cc" translucent={false} />

      {/* Header */}
      <View style={{ backgroundColor: "#7080cc" }} className="pt-24 pb-6">
        <View className="px-4">
          <Text className="text-2xl font-bold text-white mb-1">
            Booking Complete
          </Text>
          <Text className="text-sm text-white">
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

            <Text className="text-lg text-gray-600 text-center mb-6 leading-relaxed">
              Your move has been successfully booked. We've sent you a
              confirmation email with all the details.
            </Text>

            {/* Booking Confirmation Number */}
            <View className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 w-full">
              <View className="flex-row items-center justify-center mb-3">
                <Hash size={20} color="#059669" />
                <Text className="text-green-800 font-semibold ml-2">
                  Booking Confirmation
                </Text>
              </View>
              <Text className="text-3xl font-bold text-green-900 text-center mb-2">
                {confirmationNumber}
              </Text>
              <Text className="text-green-700 text-sm text-center">
                Please save this confirmation number for your records
              </Text>
            </View>

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
                className="py-4 px-6 rounded-xl flex-row justify-center items-center shadow-lg mb-4"
                style={{ backgroundColor: "#70AECC" }}
                onPress={handleGoToDashboard}
              >
                <Text className="text-white font-semibold text-lg mr-2">
                  Continue
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
