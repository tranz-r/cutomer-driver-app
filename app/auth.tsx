import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
} from "lucide-react-native";
import { router } from "expo-router";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    if (isSignUp) {
      if (!fullName.trim()) {
        Alert.alert("Error", "Please enter your full name");
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return;
      }
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        "Success",
        isSignUp ? "Account created successfully!" : "Welcome back!",
        [
          {
            text: "OK",
            onPress: () => router.replace("/customer-dashboard"),
          },
        ],
      );
    }, 1500);
  };

  const handleSocialAuth = (provider: string) => {
    Alert.alert("Success", `Signed in with ${provider}!`, [
      {
        text: "OK",
        onPress: () => router.replace("/customer-dashboard"),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#2563eb" translucent={false} />
      <View className="bg-blue-600 pt-20 pb-6">
        <View className="px-4">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2 rounded-full bg-white/20 mr-4"
            >
              <ArrowLeft size={20} color="white" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-white mb-1">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </Text>
              <Text className="text-sm text-blue-200">
                {isSignUp
                  ? "Create your account to get started"
                  : "Sign in to your account"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Logo and Title */}
        <View className="items-center mb-8">
          <View className="bg-blue-600 rounded-full p-4 mb-4">
            <Text className="text-2xl font-bold text-white">T</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {isSignUp ? "Join Tranzr" : "Welcome Back"}
          </Text>
          <Text className="text-gray-600 text-center">
            {isSignUp
              ? "Create your account to get started"
              : "Sign in to your account"}
          </Text>
        </View>

        {/* Social Login Buttons */}
        <View className="mb-6">
          <TouchableOpacity
            className="flex-row items-center justify-center py-4 px-6 bg-[#1877F2] rounded-2xl mb-4 shadow-lg"
            onPress={() => handleSocialAuth("Facebook")}
          >
            <View className="bg-white rounded-full p-1 mr-3">
              <Text className="text-[#1877F2] text-sm font-bold">f</Text>
            </View>
            <Text className="text-white font-semibold text-base">
              Continue with Facebook
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-center py-4 px-6 bg-white border border-gray-200 rounded-2xl mb-4 shadow-sm"
            onPress={() => handleSocialAuth("Google")}
          >
            <View className="bg-white rounded-full p-1 mr-3 border border-gray-200">
              <Text className="text-[#4285F4] text-sm font-bold">G</Text>
            </View>
            <Text className="text-gray-700 font-semibold text-base">
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-center py-4 px-6 bg-black rounded-2xl mb-4 shadow-lg"
            onPress={() => handleSocialAuth("Apple")}
          >
            <View className="bg-white rounded-full p-1 mr-3">
              <Text className="text-black text-sm font-bold">A</Text>
            </View>
            <Text className="text-white font-semibold text-base">
              Continue with Apple
            </Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-4 text-gray-500 text-sm">or</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        {/* Email Form */}
        <View className="mb-6">
          {isSignUp && (
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-xl p-4 bg-gray-50">
                <User size={20} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-900"
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="words"
                />
              </View>
            </View>
          )}

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl p-4 bg-gray-50">
              <Mail size={20} color="#6b7280" />
              <TextInput
                className="flex-1 ml-3 text-base text-gray-900"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Password
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl p-4 bg-gray-50">
              <Lock size={20} color="#6b7280" />
              <TextInput
                className="flex-1 ml-3 text-base text-gray-900"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color="#6b7280" />
                ) : (
                  <Eye size={20} color="#6b7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {isSignUp && (
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-xl p-4 bg-gray-50">
                <Lock size={20} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-900"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color="#6b7280" />
                  ) : (
                    <Eye size={20} color="#6b7280" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className={`py-4 px-6 rounded-xl flex-row justify-center items-center mb-6 ${
            isLoading ? "bg-gray-400" : "bg-blue-600"
          }`}
          onPress={handleEmailAuth}
          disabled={isLoading}
        >
          {isLoading ? (
            <Text className="text-white font-semibold text-base">
              {isSignUp ? "Creating Account..." : "Signing In..."}
            </Text>
          ) : (
            <>
              <CheckCircle size={20} color="white" />
              <Text className="text-white font-semibold text-base ml-2">
                {isSignUp ? "Create Account" : "Sign In"}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Toggle Sign Up/Sign In */}
        <View className="flex-row justify-center items-center mb-8">
          <Text className="text-gray-600">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
          </Text>
          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text className="text-blue-600 font-semibold ml-2">
              {isSignUp ? "Sign In" : "Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>

        {!isSignUp && (
          <TouchableOpacity className="items-center mb-8">
            <Text className="text-blue-600 font-semibold">
              Forgot Password?
            </Text>
          </TouchableOpacity>
        )}

        {isSignUp && (
          <Text className="text-xs text-gray-500 text-center mb-8 leading-relaxed">
            By creating an account, you agree to our{" "}
            <Text className="text-blue-600">Terms of Service</Text> and{" "}
            <Text className="text-blue-600">Privacy Policy</Text>.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
