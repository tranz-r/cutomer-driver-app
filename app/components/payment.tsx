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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { Menu } from 'lucide-react-native';
import { useStripe } from '@stripe/stripe-react-native';
import SlideOutMenu from './SlideOutMenu';

export default function Payment() {
  const [showSlideOutMenu, setShowSlideOutMenu] = useState(false);
  const insets = useSafeAreaInsets();

  // Mock data - in real app this would come from previous screens
  const bookingData = {
    name: "Michael E. Oyibo",
    email: "mcvavy@gmail.com",
    van: "Luton Van",
    crew: "2 persons",
    date: "Friday, 15 March 2024",
    duration: "4 hours",
    timeSlot: "Morning (8:00 - 12:00)",
    isFlexibleTime: false,
    origin: "82 Lamport Lane, Northampton NN2 7DW",
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

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_STRIPE_INTENT_BASE_URL;

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
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      googlePay: {
        merchantCountryCode: 'GB',
        currencyCode: 'GBP',
        testEnv: true, // Set to true for testing, false for production
      },
      applePay: {
        merchantCountryCode: 'GB',
      },
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#7080cc" />
      {/* Header with Menu Button */}
              <View 
          className="bg-[#7080cc] pb-6"
          style={{ paddingTop: insets.top }}
        >
          <View className="px-4 flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => setShowSlideOutMenu(true)}
              className="bg-white/20 p-3 rounded-full mr-3"
            >
              <Menu size={24} color="white" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-white mb-1">
                Booking Summary
              </Text>
              <Text className="text-sm text-white">
                Review your booking details before payment
              </Text>
            </View>
          </View>
        </View>

      {/* Scrollable Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6 pb-0">
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
        </View>
      </ScrollView>

      {/* Fixed Bottom Section */}
      <View className="bg-white border-t border-gray-100 shadow-lg">
        <View className="px-4 py-4">
          {/* Price Breakdown */}
          <View className="bg-white rounded-2xl p-6 mb-4 shadow-2xl border border-gray-100">
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-blue-500 rounded-full mr-3"></View>
                <Text className="text-xl font-bold text-gray-900">
                  Payment Summary
                </Text>
              </View>
              <View className="bg-blue-50 px-3 py-1 rounded-full">
                <Text className="text-sm font-semibold text-blue-600">
                  Secure Payment
                </Text>
              </View>
            </View>
            
            <View className="space-y-4">
              <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
                <Text className="text-base text-gray-600">
                  Base Rate (£{bookingData.quote.baseRate}/hour × {bookingData.duration.split(" ")[0]} hours)
                </Text>
                <Text className="text-base font-semibold text-gray-900">
                  £{bookingData.quote.subtotal.toFixed(2)}
                </Text>
              </View>
              
              {bookingData.isFlexibleTime && bookingData.quote.discount > 0 && (
                <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
                  <View className="flex-row items-center">
                    <Text className="text-base text-green-600">
                      Flexible Time Discount
                    </Text>
                    <View className="bg-green-100 px-2 py-1 rounded-full ml-2">
                      <Text className="text-xs font-semibold text-green-700">
                        {bookingData.quote.flexibleDiscount}% OFF
                      </Text>
                    </View>
                  </View>
                  <Text className="text-base font-semibold text-green-600">
                    -£{bookingData.quote.discount.toFixed(2)}
                  </Text>
                </View>
              )}
              
              <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
                <Text className="text-base text-gray-600">Subtotal</Text>
                <Text className="text-base font-semibold text-gray-900">
                  £{bookingData.quote.discountedTotal.toFixed(2)}
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
                <Text className="text-base text-gray-600">VAT (20%)</Text>
                <Text className="text-base font-semibold text-gray-900">
                  £{bookingData.quote.vat.toFixed(2)}
                </Text>
              </View>
              
              <View className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mt-4">
                <View className="flex-row justify-between items-center">
                  <Text className="text-xl font-bold text-gray-900">
                    Total Amount
                  </Text>
                  <Text className="text-2xl font-bold text-blue-600">
                    £{bookingData.quote.total.toFixed(2)}
                  </Text>
                </View>
                <Text className="text-sm text-gray-500 mt-1">
                  All taxes included • Secure payment
                </Text>
              </View>
            </View>
          </View>

          {/* Complete Booking Button */}
          <TouchableOpacity
            className={`py-4 px-6 rounded-xl flex-row justify-center items-center shadow-lg ${loading ? 'bg-[#70AECC] opacity-100' : 'bg-[#A0AEC0] opacity-60'}`}
            disabled={!loading}
            onPress={openPaymentSheet}
          >
            <Text className="text-white text-center font-bold text-lg mr-2">
              Checkout
            </Text>
            <CheckCircle size={20} color="white" />
          </TouchableOpacity>

          <Text className="text-center text-sm text-gray-500 mt-3">
            Proceed to secure payment
          </Text>
        </View>
      </View>

      {/* Slideout Menu */}
      <SlideOutMenu 
        visible={showSlideOutMenu} 
        onClose={() => setShowSlideOutMenu(false)} 
      />
    </SafeAreaView>
  );
}