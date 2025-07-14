import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPER_BASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPER_BASE_ANON_KEY!;

// Create a custom storage adapter for React Native
const customStorage = {
  getItem: async (key: string) => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    // Fallback to AsyncStorage for React Native
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.warn("Storage getItem error:", error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
      return;
    }
    // Fallback to AsyncStorage for React Native
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.warn("Storage setItem error:", error);
    }
  },
  removeItem: async (key: string) => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(key);
      return;
    }
    // Fallback to AsyncStorage for React Native
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.warn("Storage removeItem error:", error);
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Auth helper functions
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  fullName?: string,
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  return { data, error };
};

export const signInWithOTP = async (email: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });
  return { data, error };
};

export const verifyOTP = async (email: string, token: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });
  return { data, error };
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: Platform.OS === "web" ? window.location.origin : undefined,
    },
  });
  return { data, error };
};

export const signInWithFacebook = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      redirectTo: Platform.OS === "web" ? window.location.origin : undefined,
    },
  });
  return { data, error };
};

export const signInWithApple = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: {
      redirectTo: Platform.OS === "web" ? window.location.origin : undefined,
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo:
      Platform.OS === "web" ? `${window.location.origin}/auth` : undefined,
  });
  return { data, error };
};
