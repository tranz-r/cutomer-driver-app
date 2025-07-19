import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView } from 'react-native';

export default function EmailOtpSendScreen({ onSend }) {
  const [email, setEmail] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 justify-center">
      {/* Illustration */}
      <View className="items-center mb-8">
        {/* <Image source={require('../assets/images/otp-illustration.png')} style={{ width: 180, height: 120 }} resizeMode="contain" /> */}
      </View>
      <Text className="text-xl font-bold text-center mb-2">OTP Verification</Text>
      <Text className="text-base text-center text-gray-600 mb-8">
        We will send you a One Time Passcode via this email address
      </Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-6 text-base"
        placeholder="mail@gmail.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
              <TouchableOpacity
          style={{ backgroundColor: '#70AECC' }}
          className="py-4 rounded-xl mb-4"
          onPress={() => onSend && onSend(email)}
          disabled={!email}
        >
          <Text className="text-white text-center font-semibold text-lg">Send OTP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 