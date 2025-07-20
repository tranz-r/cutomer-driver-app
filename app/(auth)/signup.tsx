import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Eye, EyeOff } from 'lucide-react-native';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  function validatePassword(pw) {
    return pw.length >= 8 && /\d/.test(pw);
  }

  async function signUpWithEmail() {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert('Error', 'Password must be at least 8 characters and contain a number.');
      return;
    }

    console.log('signing up with email: ', email, 'and password: ', password)
    setLoading(true);
    const { data: { session }, error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      let message = 'An error occurred. Please try again.';
      switch (error.code) {
        case 'user_already_exists':
          message = 'An account with this email already exists.';
          break;
        case 'email_address_invalid':
          message = 'Please enter a valid email address.';
          break;
        case 'weak_password':
          message = 'Password is too weak. Please use a stronger password.';
          break;
        case 'signup_disabled':
          message = 'Sign ups are currently disabled. Please try again later.';
          break;
        case 'validation_failed':
          message = 'Please check your input and try again.';
          break;
        default:
          if (error.message) message = error.message;
          break;
      }
      Alert.alert('Sign Up Error', message);
      return;
    }

    console.log(JSON.stringify(session, null, 2))

    if (!session) {
      Alert.alert('Check your inbox', 'Please check your inbox for email verification!');
    }
    if (!error && session) router.replace('/customer-dashboard');
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 justify-center">
      {/* Illustration */}
      <View className="items-center mb-8">
        {/* <Image source={require('../assets/images/auth-illustration.png')} className="w-44 h-32" resizeMode="contain" /> */}
      </View>
      <Text className="text-2xl font-bold text-center mb-1 text-gray-900 mb-8">Sign up</Text>
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
      <View className="mb-3">
        <Text className="text-gray-700 font-semibold mb-1 ml-1">Confirm Password</Text>
        <View className="flex-row items-center bg-gray-100 rounded-xl px-2">
          <TextInput
            className="flex-1 px-2 py-3 text-base text-gray-900 bg-gray-100"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword((v) => !v)} className="p-2">
            {showConfirmPassword ? (
              <EyeOff size={22} color="#6b7280" />
            ) : (
              <Eye size={22} color="#6b7280" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        className="bg-[#70AECC] rounded-xl py-4 mb-3"
        onPress={signUpWithEmail}
        disabled={loading}
      >
        <Text className="text-white text-center font-bold text-base">Sign up</Text>
      </TouchableOpacity>
      <TouchableOpacity className="items-center mb-4" onPress={() => router.push('/otp-send')}>
        <Text className="text-[#70AECC] underline font-bold text-base mt-1">Sign up with One Time Password (OTP)</Text>
      </TouchableOpacity>
              <TouchableOpacity className="items-center" onPress={() => router.replace('/login')}>
          <Text className="text-green-700 text-center font-semibold text-base">Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 