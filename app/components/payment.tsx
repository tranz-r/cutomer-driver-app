import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  Alert,
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
import { Platform } from "react-native";

// STRIPE INTEGRATION - COMMENTED OUT FOR WEB COMPATIBILITY
// Uncomment the following lines for native development builds:
// import { useStripe } from '@stripe/stripe-react-native';

export default function Payment() {
  // Mock data - in real app this would come from previous screens
  const bookingData = {
    name: "John Doe",
    email: "john.doe@example.com",
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

  // STRIPE INTEGRATION - COMMENTED OUT FOR WEB COMPATIBILITY
  // Uncomment the following lines for native development builds:
  // const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  // STRIPE API URL - COMMENTED OUT FOR WEB COMPATIBILITY
  // const API_URL = process.env.EXPO_PUBLIC_STRIPE_INTENT_BASE_URL;

  // STRIPE PAYMENT FUNCTIONS - COMMENTED OUT FOR WEB COMPATIBILITY
  // Uncomment the following functions for native development builds:
  /*
  const fetchPaymentSheetParams = async () => {
    console.log("fetching payment sheet params");
    const response = await fetch(`${API_URL}/api/v1/checkout/payment-sheet`, {
      method: 'POST',
      body: JSON.stringify({
        amount: bookingData.quote.total,
        email: bookingData.email,
        name: bookingData.name
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log("response", response);

    const { paymentIntent, ephemeralKey, customer } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const {
      paymentIntent,
      ephemeralKey,
      customer,
    } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Tranzr Moves",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: bookingData.name,
        email: bookingData.email,
        address: {
          line1: bookingData.origin,
          line2: bookingData.destination,
          city: bookingData.origin,
          state: bookingData.origin,
          postalCode: "SW1A 1AA",
          country: "GB",
        }
      }
    });

    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      router.push("/success");
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);
  */

  // MOCK PAYMENT FUNCTION - FOR WEB COMPATIBILITY
  const handleMockPayment = async () => {
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Payment Successful!",
        "Your booking has been confirmed. You will receive a confirmation email shortly.",
        [
          {
            text: "OK",
            onPress: () => router.push("/success"),
          },
        ],
      );
    }, 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#7080cc" />
      <View style={{ backgroundColor: "#7080cc" }} className="pt-24 pb-6">
        <View className="px-4">
          <Text className="text-2xl font-bold text-white mb-1">
            Booking Summary
          </Text>
          <Text className="text-sm text-white">
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

          {/* Mock Payment Notice */}
          <View className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-200">
            <Text className="text-sm text-yellow-800 text-center font-medium">
              🧪 Mock Payment Mode - No real payment will be processed
            </Text>
          </View>

          {/* Complete Booking Button */}
          <TouchableOpacity
            className="py-4 px-6 rounded-xl flex-row justify-center items-center shadow-lg"
            disabled={loading}
            style={{
              backgroundColor: loading ? "#A0AEC0" : "#70AECC",
              opacity: loading ? 0.6 : 1,
            }}
            onPress={handleMockPayment}
          >
            <Text className="text-white text-center font-bold text-lg mr-2">
              {loading ? "Processing..." : "Complete Booking (Mock)"}
            </Text>
            <CheckCircle size={20} color="white" />
          </TouchableOpacity>

          <Text className="text-center text-sm text-gray-500 mt-3">
            {loading
              ? "Simulating payment processing..."
              : "Mock payment - for testing purposes"}
          </Text>
        </View>
      </ScrollView>
      <View className="h-8" />
    </SafeAreaView>
  );
}
