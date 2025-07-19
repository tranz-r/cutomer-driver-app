import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import GoogleAuth from './components/GoogleAuth';
import { Eye, EyeOff } from 'lucide-react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      Alert.alert(error.message);
    } else {
      router.replace('/customer-dashboard');
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 justify-center">
      {/* Illustration */}
      <View className="items-center mb-8">
        {/* <Image source={require('../assets/images/auth-illustration.png')} className="w-44 h-32" resizeMode="contain" /> */}
      </View>
      <Text className="text-2xl font-bold text-center mb-1 text-gray-900 mb-8">Sign in</Text>
      <View className="mb-3">
        <Text className="text-gray-700 font-semibold mb-1 ml-1">Email</Text>
        <TextInput
          className="bg-gray-100 rounded-xl px-4 py-3 text-base text-gray-900"
          placeholder="email@address.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View className="mb-3">
        <Text className="text-gray-700 font-semibold mb-1 ml-1">Password</Text>
        <View className="flex-row items-center bg-gray-100 rounded-xl px-2">
          <TextInput
            className="flex-1 px-2 py-3 text-base text-gray-900 bg-gray-100"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword((v) => !v)} className="p-2">
            {showPassword ? (
              <EyeOff size={22} color="#6b7280" />
            ) : (
              <Eye size={22} color="#6b7280" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        className="bg-[#70AECC] rounded-xl py-4 mb-3"
        onPress={signInWithEmail}
        disabled={loading}
      >
        <Text className="text-white text-center font-bold text-base">Log In</Text>
      </TouchableOpacity>
      {/* Forgot password and Sign up links */}
      <View className="mb-4">
        <TouchableOpacity className="items-center mb-2">
          <Text className="text-green-700 text-center font-semibold text-base">Forgot your password?</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center" onPress={() => router.push('/signup')}>
          <Text className="text-green-700 text-center font-semibold text-base">Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity className="items-center mb-4" onPress={() => router.push('/otp-send')}>
        <Text className="text-[#70AECC] underline font-bold text-base mt-1">Sign in with One Time Password (OTP)</Text>
      </TouchableOpacity>
      {/* Divider */}
      <View className="flex-row items-center my-3">
        <View className="flex-1 h-px bg-gray-200" />
        <Text className="mx-3 text-gray-400 text-sm">or continue with</Text>
        <View className="flex-1 h-px bg-gray-200" />
      </View>
      {/* Social Auth - Only Google */}
      <View className="items-center mt-4">
        <GoogleAuth />
      </View>
      </View>
    </SafeAreaView>
  );
} 