import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  CheckCircle,
  MapPin,
  Calendar,
  Clock,
  Truck,
  Users,
  Mail,
  X,
} from "lucide-react-native";
import { router } from "expo-router";

export default function SummaryScreen() {
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  // Mock data - in real app this would come from previous screens
  const bookingData = {
    van: "Luton Van",
    crew: "2 persons",
    date: "Friday, 15 March 2024",
    duration: "4 hours",
    timeSlot: "Morning (8:00 - 12:00)",
    isFlexibleTime: false,
    origin: "123 High Street, London SW1A 1AA",
    destination: "456 Park Lane, London W1K 1QA",
    originFloor: "Ground Floor",
    destinationFloor: "2nd Floor",
    originElevator: true,
    destinationElevator: false,
    distance: "12.5 miles",
    quote: {
      baseRate: 110,
      subtotal: 440,
      discount: 0,
      discountedTotal: 440,
      vat: 88,
      total: 528,
      flexibleDiscount: 15,
    },
  };

  const handleCompleteBooking = () => {
    setIsCheckingAuth(true);

    // Simulate checking authentication status
    setTimeout(() => {
      setIsCheckingAuth(false);
      if (!isSignedIn) {
        // Navigate to auth screen - user will be redirected to payment after registration
        router.push("/auth");
      } else {
        // User is logged in, go directly to payment
        router.push("/payment");
      }
    }, 500);
  };

  const handleSignIn = (method: string) => {
    console.log(`Signing in with ${method}`);
    setIsSignedIn(true);
    setShowSignInModal(false);
    // Simulate successful login and navigate to customer dashboard
    router.replace("/customer-dashboard");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#475569" />
      <View className="bg-slate-600 pt-24 pb-6">
        <View className="px-4">
          <Text className="text-2xl font-bold text-white mb-1">
            Booking Summary
          </Text>
          <Text className="text-sm text-slate-200">
            Review your booking details before completing your reservation.
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {/* Service Details */}
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Service Details
            </Text>
            <View className="space-y-4">
              <View className="flex-row items-center">
                <Truck size={20} color="#3b82f6" />
                <View className="ml-3 flex-1">
                  <Text className="text-sm text-gray-600">Van Type</Text>
                  <Text className="text-base font-semibold text-gray-900">
                    {bookingData.van}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center">
                <Users size={20} color="#10b981" />
                <View className="ml-3 flex-1">
                  <Text className="text-sm text-gray-600">Crew Size</Text>
                  <Text className="text-base font-semibold text-gray-900">
                    {bookingData.crew}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Date & Time */}
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Date & Time
            </Text>
            <View className="space-y-4">
              <View className="flex-row items-center">
                <Calendar size={20} color="#f59e0b" />
                <View className="ml-3 flex-1">
                  <Text className="text-sm text-gray-600">Moving Date</Text>
                  <Text className="text-base font-semibold text-gray-900">
                    {bookingData.date}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center">
                <Clock size={20} color="#8b5cf6" />
                <View className="ml-3 flex-1">
                  <Text className="text-sm text-gray-600">Duration</Text>
                  <Text className="text-base font-semibold text-gray-900">
                    {bookingData.duration}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center">
                <Clock size={20} color="#06b6d4" />
                <View className="ml-3 flex-1">
                  <Text className="text-sm text-gray-600">Time Slot</Text>
                  <Text className="text-base font-semibold text-gray-900">
                    {bookingData.isFlexibleTime
                      ? "Flexible"
                      : bookingData.timeSlot}
                  </Text>
                  {bookingData.isFlexibleTime && (
                    <Text className="text-sm text-green-600 font-medium">
                      {bookingData.quote.flexibleDiscount}% discount applied
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Locations */}
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Locations
            </Text>
            <View className="space-y-4">
              <View className="flex-row items-start">
                <MapPin size={20} color="#10b981" />
                <View className="ml-3 flex-1">
                  <Text className="text-sm text-gray-600">Pickup Address</Text>
                  <Text className="text-base font-semibold text-gray-900 mb-1">
                    {bookingData.origin}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {bookingData.originFloor} •{" "}
                    {bookingData.originElevator
                      ? "Elevator Available"
                      : "No Elevator"}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-start">
                <MapPin size={20} color="#ef4444" />
                <View className="ml-3 flex-1">
                  <Text className="text-sm text-gray-600">
                    Delivery Address
                  </Text>
                  <Text className="text-base font-semibold text-gray-900 mb-1">
                    {bookingData.destination}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {bookingData.destinationFloor} •{" "}
                    {bookingData.destinationElevator
                      ? "Elevator Available"
                      : "No Elevator"}
                  </Text>
                </View>
              </View>
              <View className="bg-blue-50 rounded-lg p-3 mt-3">
                <Text className="text-sm text-blue-800">
                  <Text className="font-semibold">Distance:</Text>{" "}
                  {bookingData.distance}
                </Text>
              </View>
            </View>
          </View>

          {/* Price Breakdown */}
          <View className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Price Breakdown
            </Text>
            <View className="space-y-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-base text-gray-600">
                  Base Rate (£{bookingData.quote.baseRate}/hour ×{" "}
                  {bookingData.duration.split(" ")[0]} hours):
                </Text>
                <Text className="text-base font-semibold text-gray-900">
                  £{bookingData.quote.subtotal.toFixed(2)}
                </Text>
              </View>
              {bookingData.isFlexibleTime && bookingData.quote.discount > 0 && (
                <View className="flex-row justify-between items-center">
                  <Text className="text-base text-green-600">
                    Flexible Time Discount ({bookingData.quote.flexibleDiscount}
                    %):
                  </Text>
                  <Text className="text-base font-semibold text-green-600">
                    -£{bookingData.quote.discount.toFixed(2)}
                  </Text>
                </View>
              )}
              <View className="flex-row justify-between items-center">
                <Text className="text-base text-gray-600">Subtotal:</Text>
                <Text className="text-base font-semibold text-gray-900">
                  £{bookingData.quote.discountedTotal.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-base text-gray-600">VAT (20%):</Text>
                <Text className="text-base font-semibold text-gray-900">
                  £{bookingData.quote.vat.toFixed(2)}
                </Text>
              </View>
              <View className="border-t border-blue-200 pt-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-xl font-bold text-gray-900">
                    Total Amount:
                  </Text>
                  <Text className="text-xl font-bold text-blue-600">
                    £{bookingData.quote.total.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Complete Booking Button */}
          <TouchableOpacity
            className={`py-5 px-8 rounded-2xl flex-row justify-center items-center shadow-lg ${
              isCheckingAuth ? "bg-gray-400" : "bg-green-600"
            }`}
            onPress={handleCompleteBooking}
            disabled={isCheckingAuth}
          >
            {isCheckingAuth ? (
              <Text className="text-white text-center font-bold text-lg">
                Checking...
              </Text>
            ) : (
              <>
                <CheckCircle size={22} color="white" />
                <Text className="text-white text-center font-bold text-lg ml-3">
                  Checkout
                </Text>
              </>
            )}
          </TouchableOpacity>

          <Text className="text-center text-sm text-gray-500 mt-3">
            {isSignedIn
              ? "Proceed to secure payment"
              : "You'll be asked to sign in to complete your booking"}
          </Text>
        </View>
      </ScrollView>
      <View className="h-8" />

      {/* Sign In Modal */}
      <Modal
        visible={showSignInModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSignInModal(false)}
      >
        <View className="flex-1 justify-center bg-black/70 px-6">
          <View className="bg-white rounded-2xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-900">
                Sign In to Continue
              </Text>
              <TouchableOpacity onPress={() => setShowSignInModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Text className="text-base text-gray-600 mb-6 text-center">
              Choose your preferred sign-in method to complete your booking.
            </Text>

            <View className="space-y-4">
              <TouchableOpacity
                className="flex-row items-center justify-center py-4 px-6 bg-blue-600 rounded-xl"
                onPress={() => handleSignIn("Google")}
              >
                <Text className="text-white font-semibold text-base">
                  Continue with Google
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center justify-center py-4 px-6 bg-blue-800 rounded-xl"
                onPress={() => handleSignIn("Facebook")}
              >
                <Text className="text-white font-semibold text-base">
                  Continue with Facebook
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center justify-center py-4 px-6 bg-black rounded-xl"
                onPress={() => handleSignIn("Apple")}
              >
                <Text className="text-white font-semibold text-base">
                  Continue with Apple
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center justify-center py-4 px-6 bg-gray-600 rounded-xl"
                onPress={() => handleSignIn("Email")}
              >
                <Mail size={20} color="white" />
                <Text className="text-white font-semibold text-base ml-2">
                  Continue with Email
                </Text>
              </TouchableOpacity>
            </View>

            <Text className="text-center text-xs text-gray-500 mt-6">
              By continuing, you agree to our Terms of Service and Privacy
              Policy.
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
