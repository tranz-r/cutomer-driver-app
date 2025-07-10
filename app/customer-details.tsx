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
  ChevronRight,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Circle,
} from "lucide-react-native";
import { router } from "expo-router";

export default function CustomerDetailsScreen() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [collectionEmail, setCollectionEmail] = useState("");
  const [collectionPhone, setCollectionPhone] = useState("");
  const [deliveryName, setDeliveryName] = useState("");
  const [deliveryEmail, setDeliveryEmail] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [sameAsCustomerCollection, setSameAsCustomerCollection] =
    useState(true);
  const [sameAsCustomerDelivery, setSameAsCustomerDelivery] = useState(true);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[+]?[0-9\s-()]{10,}$/;
    return phoneRegex.test(phone);
  };

  const handleContinue = () => {
    // Validate required fields
    if (!customerName.trim()) {
      Alert.alert("Validation Error", "Please enter your name");
      return;
    }
    if (!customerEmail.trim() || !validateEmail(customerEmail)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }
    if (!customerPhone.trim() || !validatePhone(customerPhone)) {
      Alert.alert("Validation Error", "Please enter a valid phone number");
      return;
    }

    // Validate collection details if not same as customer
    if (!sameAsCustomerCollection) {
      if (!collectionName.trim()) {
        Alert.alert("Validation Error", "Please enter collection contact name");
        return;
      }
      if (!collectionEmail.trim() || !validateEmail(collectionEmail)) {
        Alert.alert(
          "Validation Error",
          "Please enter a valid collection email",
        );
        return;
      }
      if (!collectionPhone.trim() || !validatePhone(collectionPhone)) {
        Alert.alert(
          "Validation Error",
          "Please enter a valid collection phone",
        );
        return;
      }
    }

    // Validate delivery details if not same as customer
    if (!sameAsCustomerDelivery) {
      if (!deliveryName.trim()) {
        Alert.alert("Validation Error", "Please enter delivery contact name");
        return;
      }
      if (!deliveryEmail.trim() || !validateEmail(deliveryEmail)) {
        Alert.alert("Validation Error", "Please enter a valid delivery email");
        return;
      }
      if (!deliveryPhone.trim() || !validatePhone(deliveryPhone)) {
        Alert.alert("Validation Error", "Please enter a valid delivery phone");
        return;
      }
    }

    const customerDetails = {
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
      collection: sameAsCustomerCollection
        ? {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
          }
        : {
            name: collectionName,
            email: collectionEmail,
            phone: collectionPhone,
          },
      delivery: sameAsCustomerDelivery
        ? {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
          }
        : {
            name: deliveryName,
            email: deliveryEmail,
            phone: deliveryPhone,
          },
    };

    console.log("Customer Details:", customerDetails);
    router.push("/pricing-tier");
  };

  const renderContactSection = (
    title: string,
    nameValue: string,
    emailValue: string,
    phoneValue: string,
    onNameChange: (text: string) => void,
    onEmailChange: (text: string) => void,
    onPhoneChange: (text: string) => void,
    sameAsCustomer?: boolean,
    onSameAsCustomerChange?: (value: boolean) => void,
  ) => {
    return (
      <View className="mb-8">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-gray-800">{title}</Text>
          {onSameAsCustomerChange && (
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => onSameAsCustomerChange(!sameAsCustomer)}
            >
              {sameAsCustomer ? (
                <CheckCircle size={20} color="#3b82f6" />
              ) : (
                <Circle size={20} color="#9ca3af" />
              )}
              <Text className="text-sm text-gray-600 ml-2">
                Same as Customer
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {(!sameAsCustomer || !onSameAsCustomerChange) && (
          <View className="space-y-4">
            {/* Name Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Full Name
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg p-4 bg-white">
                <User size={20} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-800"
                  placeholder="Enter full name"
                  value={nameValue}
                  onChangeText={onNameChange}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Email Address
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg p-4 bg-white">
                <Mail size={20} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-800"
                  placeholder="Enter email address"
                  value={emailValue}
                  onChangeText={onEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Phone Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg p-4 bg-white">
                <Phone size={20} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-800"
                  placeholder="Enter phone number"
                  value={phoneValue}
                  onChangeText={onPhoneChange}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>
        )}

        {sameAsCustomer && onSameAsCustomerChange && (
          <View className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Text className="text-blue-800 text-sm">
              Using customer details for {title.toLowerCase()}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#7080cc" />
      <View style={{ backgroundColor: "#7080cc" }} className="pt-24 pb-6">
        <View className="px-4">
          <Text className="text-2xl font-bold text-white mb-1">
            Contact Details
          </Text>
          <Text className="text-sm text-white">
            Please provide contact information for your move
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {/* Customer Details */}
          {renderContactSection(
            "Customer Details",
            customerName,
            customerEmail,
            customerPhone,
            setCustomerName,
            setCustomerEmail,
            setCustomerPhone,
          )}

          {/* Collection Details */}
          {renderContactSection(
            "Collection Details",
            collectionName,
            collectionEmail,
            collectionPhone,
            setCollectionName,
            setCollectionEmail,
            setCollectionPhone,
            sameAsCustomerCollection,
            setSameAsCustomerCollection,
          )}

          {/* Delivery Details */}
          {renderContactSection(
            "Delivery Details",
            deliveryName,
            deliveryEmail,
            deliveryPhone,
            setDeliveryName,
            setDeliveryEmail,
            setDeliveryPhone,
            sameAsCustomerDelivery,
            setSameAsCustomerDelivery,
          )}

          {/* Summary */}
          <View className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Contact Summary
            </Text>
            <View className="space-y-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-base text-gray-600">Customer:</Text>
                <Text className="text-base font-semibold text-gray-900">
                  {customerName || "Not provided"}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-base text-gray-600">Email:</Text>
                <Text className="text-base font-semibold text-gray-900">
                  {customerEmail || "Not provided"}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-base text-gray-600">Phone:</Text>
                <Text className="text-base font-semibold text-gray-900">
                  {customerPhone || "Not provided"}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-base text-gray-600">Collection:</Text>
                <Text className="text-base font-semibold text-gray-900">
                  {sameAsCustomerCollection
                    ? "Same as customer"
                    : collectionName || "Separate contact"}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-base text-gray-600">Delivery:</Text>
                <Text className="text-base font-semibold text-gray-900">
                  {sameAsCustomerDelivery
                    ? "Same as customer"
                    : deliveryName || "Separate contact"}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            className="py-4 px-6 rounded-xl flex-row justify-center items-center shadow-lg"
            style={{ backgroundColor: "#70AECC" }}
            onPress={handleContinue}
          >
            <Text className="text-white text-center font-bold text-lg mr-2">
              Continue
            </Text>
            <ChevronRight size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View className="h-8" />
    </SafeAreaView>
  );
}
