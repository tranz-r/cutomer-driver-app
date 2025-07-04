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
import { router, useLocalSearchParams } from "expo-router";
import Svg, { Path, G } from "react-native-svg";

// Facebook Icon Component
const FacebookIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <Path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </Svg>
);

// Google Icon Component
const GoogleIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24">
    <Path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <Path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <Path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <Path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </Svg>
);

// Apple Icon Component
const AppleIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <Path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </Svg>
);

export default function AuthScreen() {
  const { redirectTo } = useLocalSearchParams();
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

      // Check if redirectTo parameter is set to dashboard
      if (redirectTo === "dashboard") {
        // User came from success screen, redirect to dashboard
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
      } else if (redirectTo === "payment") {
        // User came from booking flow (summary screen), redirect to payment
        Alert.alert(
          "Success",
          isSignUp
            ? "Account created successfully! Redirecting to payment..."
            : "Welcome back! Redirecting to payment...",
          [
            {
              text: "OK",
              onPress: () => router.replace("/payment"),
            },
          ],
        );
      } else {
        // Normal login flow (from landing page), go to dashboard
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
      }
    }, 1500);
  };

  const handleSocialAuth = (provider: string) => {
    // Check if redirectTo parameter is set to dashboard
    if (redirectTo === "dashboard") {
      // User came from success screen, redirect to dashboard
      Alert.alert("Success", `Signed in with ${provider}!`, [
        {
          text: "OK",
          onPress: () => router.replace("/customer-dashboard"),
        },
      ]);
    } else if (redirectTo === "payment") {
      // User came from booking flow (summary screen), redirect to payment
      Alert.alert(
        "Success",
        `Signed in with ${provider}! Redirecting to payment...`,
        [
          {
            text: "OK",
            onPress: () => router.replace("/payment"),
          },
        ],
      );
    } else {
      // Normal login flow (from landing page), go to dashboard
      Alert.alert("Success", `Signed in with ${provider}!`, [
        {
          text: "OK",
          onPress: () => router.replace("/customer-dashboard"),
        },
      ]);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#2563eb" translucent={false} />
      <View className="bg-blue-600 pt-24 pb-6">
        <View className="px-4">
          <Text className="text-2xl font-bold text-white mb-1">
            Authentication
          </Text>
          <Text className="text-sm text-blue-200">
            {isSignUp
              ? "Create your account to get started"
              : "Sign in to your account"}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View className="items-center mb-8">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {isSignUp ? "Join Tranzr" : "Sign In"}
          </Text>
        </View>

        {/* Social Login Buttons */}
        <View className="mb-6">
          <Text className="text-center text-gray-600 mb-6">
            Continue with social
          </Text>
          <View className="flex-row justify-center items-center">
            <TouchableOpacity
              className="w-16 h-16 bg-[#1877F2] rounded-full items-center justify-center shadow-lg mx-4"
              onPress={() => handleSocialAuth("Facebook")}
            >
              <FacebookIcon />
            </TouchableOpacity>

            <TouchableOpacity
              className="w-16 h-16 bg-white border border-gray-200 rounded-full items-center justify-center shadow-sm mx-4"
              onPress={() => handleSocialAuth("Google")}
            >
              <GoogleIcon />
            </TouchableOpacity>

            <TouchableOpacity
              className="w-16 h-16 bg-black rounded-full items-center justify-center shadow-lg mx-4"
              onPress={() => handleSocialAuth("Apple")}
            >
              <AppleIcon />
            </TouchableOpacity>
          </View>
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
      <View className="h-8" />
    </SafeAreaView>
  );
}
