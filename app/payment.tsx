import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  CreditCard,
  Lock,
  Calendar,
  User,
  MapPin,
  ArrowLeft,
  CheckCircle,
} from "lucide-react-native";
import { router } from "expo-router";

export default function PaymentScreen() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock booking data - in real app this would come from state/props
  const bookingData = {
    van: "Luton Van",
    crew: "2 persons",
    date: "Friday, 15 March 2024",
    duration: "4 hours",
    timeSlot: "Morning (8:00 - 12:00)",
    origin: "123 High Street, London SW1A 1AA",
    destination: "456 Park Lane, London W1K 1QA",
    total: 528,
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, "");
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(" ") : cleaned;
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handlePayment = async () => {
    if (
      !cardNumber.trim() ||
      !expiryDate.trim() ||
      !cvv.trim() ||
      !cardholderName.trim()
    ) {
      Alert.alert("Error", "Please fill in all payment details");
      return;
    }

    if (cardNumber.replace(/\s/g, "").length < 16) {
      Alert.alert("Error", "Please enter a valid card number");
      return;
    }

    if (cvv.length < 3) {
      Alert.alert("Error", "Please enter a valid CVV");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate Stripe payment processing
      const paymentData = {
        amount: bookingData.total * 100, // Convert to cents
        currency: "gbp",
        card: {
          number: cardNumber.replace(/\s/g, ""),
          exp_month: expiryDate.split("/")[0],
          exp_year: "20" + expiryDate.split("/")[1],
          cvc: cvv,
        },
        billing_details: {
          name: cardholderName,
          address: {
            line1: billingAddress,
          },
        },
      };

      // Simulate API call to backend with Stripe integration
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Simulate successful payment
      const paymentResult = {
        success: true,
        payment_intent_id: "pi_" + Math.random().toString(36).substr(2, 9),
        amount_received: paymentData.amount,
      };

      if (paymentResult.success) {
        setIsProcessing(false);
        router.replace("/success");
      } else {
        throw new Error("Payment failed");
      }
    } catch (error) {
      setIsProcessing(false);
      Alert.alert(
        "Payment Failed",
        "There was an issue processing your payment. Please check your card details and try again.",
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full bg-gray-100"
        >
          <ArrowLeft size={20} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900 ml-4">
          Payment Details
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Booking Summary */}
        <View className="bg-blue-50 mx-4 mt-4 p-4 rounded-xl border border-blue-200">
          <Text className="text-lg font-bold text-blue-900 mb-3">
            Booking Summary
          </Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-blue-800">Service:</Text>
              <Text className="text-blue-900 font-semibold">
                {bookingData.van} + {bookingData.crew}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-blue-800">Date:</Text>
              <Text className="text-blue-900 font-semibold">
                {bookingData.date}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-blue-800">Duration:</Text>
              <Text className="text-blue-900 font-semibold">
                {bookingData.duration}
              </Text>
            </View>
            <View className="border-t border-blue-300 pt-2 mt-3">
              <View className="flex-row justify-between">
                <Text className="text-lg font-bold text-blue-900">
                  Total Amount:
                </Text>
                <Text className="text-xl font-bold text-blue-600">
                  £{bookingData.total}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Form */}
        <View className="px-4 py-6">
          <Text className="text-xl font-bold text-gray-900 mb-6">
            Payment Information
          </Text>

          {/* Stripe Integration Notice */}
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <Text className="text-blue-800 font-semibold mb-2">
              🔒 Secure Payment with Stripe
            </Text>
            <Text className="text-blue-700 text-sm">
              Your payment is processed securely through Stripe. All card
              details are encrypted and never stored on our servers.
            </Text>
          </View>

          {/* Card Number */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Card Number
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl p-4 bg-gray-50">
              <CreditCard size={20} color="#6b7280" />
              <TextInput
                className="flex-1 ml-3 text-base text-gray-900"
                value={cardNumber}
                onChangeText={(text) => {
                  const formatted = formatCardNumber(text);
                  if (formatted.replace(/\s/g, "").length <= 16) {
                    setCardNumber(formatted);
                  }
                }}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                maxLength={19}
              />
            </View>
          </View>

          {/* Expiry and CVV */}
          <View className="flex-row mb-4">
            <View className="flex-1 mr-2">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Expiry Date
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-xl p-4 bg-gray-50">
                <Calendar size={20} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-900"
                  value={expiryDate}
                  onChangeText={(text) => {
                    const formatted = formatExpiryDate(text);
                    if (formatted.length <= 5) {
                      setExpiryDate(formatted);
                    }
                  }}
                  placeholder="MM/YY"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                CVV
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-xl p-4 bg-gray-50">
                <Lock size={20} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-900"
                  value={cvv}
                  onChangeText={(text) => {
                    if (text.length <= 4) {
                      setCvv(text.replace(/\D/g, ""));
                    }
                  }}
                  placeholder="123"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
          </View>

          {/* Cardholder Name */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Cardholder Name
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl p-4 bg-gray-50">
              <User size={20} color="#6b7280" />
              <TextInput
                className="flex-1 ml-3 text-base text-gray-900"
                value={cardholderName}
                onChangeText={setCardholderName}
                placeholder="John Smith"
                placeholderTextColor="#9ca3af"
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Billing Address */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Billing Address
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl p-4 bg-gray-50">
              <MapPin size={20} color="#6b7280" />
              <TextInput
                className="flex-1 ml-3 text-base text-gray-900"
                value={billingAddress}
                onChangeText={setBillingAddress}
                placeholder="123 Main Street, London, UK"
                placeholderTextColor="#9ca3af"
                multiline
              />
            </View>
          </View>

          {/* Security Notice */}
          <View className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <View className="flex-row items-center">
              <Lock size={20} color="#059669" />
              <Text className="text-green-800 font-semibold ml-2">
                Secure Payment
              </Text>
            </View>
            <Text className="text-green-700 text-sm mt-2">
              Your payment information is encrypted and secure. We use
              industry-standard SSL encryption to protect your data.
            </Text>
          </View>

          {/* Pay Button */}
          <TouchableOpacity
            className={`py-4 px-6 rounded-xl flex-row justify-center items-center ${
              isProcessing ? "bg-gray-400" : "bg-green-600"
            }`}
            onPress={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Text className="text-white font-semibold text-lg">
                Processing Payment...
              </Text>
            ) : (
              <>
                <CheckCircle size={22} color="white" />
                <Text className="text-white font-semibold text-lg ml-2">
                  Pay £{bookingData.total}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <Text className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
            By completing this payment, you agree to our Terms of Service and
            confirm that you have read our Privacy Policy.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
