import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

const OTP_LENGTH = 6;
const RESEND_TIME = 120; // seconds

export default function EmailOtpVerifyScreen({ email, onVerify, onResend, onSwitchAccount, onChangeEmail }) {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(RESEND_TIME);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (text, idx) => {
    if (!/^[0-9]?$/.test(text)) return;
    const newOtp = [...otp];
    newOtp[idx] = text;
    setOtp(newOtp);
    if (text && idx < OTP_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleVerify = () => {
    onVerify && onVerify(otp.join(''));
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      {/* Illustration */}
      <View className="items-center mb-8">
        {/* <Image source={require('../assets/images/otp-illustration.png')} style={{ width: 180, height: 120 }} resizeMode="contain" /> */}
      </View>
      <Text className="text-xl font-bold text-center mb-2">Enter your Verification code</Text>
      <Text className="text-base text-center text-gray-600 mb-8">
        We will send you a One Time Passcode via this {email} email address
      </Text>
      <View className="flex-row justify-center mb-6">
        {otp.map((digit, idx) => (
          <TextInput
            key={idx}
            ref={el => (inputRefs.current[idx] = el)}
            className="border border-gray-300 rounded-xl mx-1 text-center text-xl"
            style={{ width: 48, height: 56 }}
            maxLength={1}
            keyboardType="number-pad"
            value={digit}
            onChangeText={text => handleChange(text, idx)}
            returnKeyType="next"
          />
        ))}
      </View>
      <View className="flex-row justify-center items-center mb-4">
        <Text className="text-gray-500 mr-2">Didn't get it?</Text>
        <TouchableOpacity disabled={timer > 0} onPress={onResend}>
          <Text className={`font-semibold ${timer > 0 ? 'text-gray-400' : 'text-[#70AECC]'}`}>
            Resend code
          </Text>
        </TouchableOpacity>
        <Text className="ml-2 text-gray-400">{timer > 0 ? `0:${timer.toString().padStart(2, '0')}` : ''}</Text>
      </View>
      <TouchableOpacity onPress={onSwitchAccount}>
        <Text className="text-center text-[#70AECC] underline mb-4">Not Mail? Switch Account</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ backgroundColor: '#70AECC' }}
        className="py-4 rounded-xl mb-4"
        onPress={handleVerify}
        disabled={otp.some(d => !d)}
      >
        <Text className="text-white text-center font-semibold text-lg">Verify OTP</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onChangeEmail}>
        <Text className="text-center text-green-700 underline">Change the email address</Text>
      </TouchableOpacity>
    </View>
  );
} 