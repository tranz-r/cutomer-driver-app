import React from "react";
import { View, Text, SafeAreaView } from "react-native";

export default function PaymentScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold text-gray-900">Payment Screen</Text>
        <Text className="text-gray-600 mt-2">
          Payment functionality coming soon
        </Text>
      </View>
    </SafeAreaView>
  );
}
