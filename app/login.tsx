import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import GoogleAuth from './components/GoogleAuth';
import { useSession } from '../lib/contexts/SessionContext';

export default function LoginScreen() {
  const router = useRouter();
  const { session, isLoading } = useSession();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Show loading screen while checking session
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#6B7280' }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const handleSendOtp = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
      },
    });
    setLoading(false);
    
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.push({ pathname: '/otp-verify', params: { email: email.trim() } });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'center' }}>
          <View style={{ alignItems: 'center', marginBottom: 48 }}>
            <Text style={{ 
              fontSize: 28, 
              fontWeight: 'bold', 
              color: '#1F2937',
              marginBottom: 8,
              textAlign: 'center'
            }}>
              Welcome to Tranzr
            </Text>
            <Text style={{ 
              fontSize: 16, 
              color: '#6B7280',
              textAlign: 'center',
              lineHeight: 24
            }}>
              Sign in with One-Time Password (OTP)
            </Text>
          </View>

          <View style={{ marginBottom: 32 }}>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 16,
                fontSize: 16,
                backgroundColor: '#F9FAFB',
                marginBottom: 16
              }}
              placeholder="Enter your email address"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <TouchableOpacity
              style={{
                backgroundColor: '#70AECC',
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: 'center',
                opacity: email.trim() ? 1 : 0.6
              }}
              onPress={handleSendOtp}
              disabled={!email.trim() || loading}
            >
              <Text style={{ 
                color: 'white', 
                fontSize: 16, 
                fontWeight: '600' 
              }}>
                {loading ? 'Sending...' : 'Send OTP'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            marginBottom: 32 
          }}>
            <View style={{ 
              flex: 1, 
              height: 1, 
              backgroundColor: '#E5E7EB' 
            }} />
            <Text style={{ 
              marginHorizontal: 16, 
              color: '#6B7280', 
              fontSize: 14 
            }}>
              or continue with
            </Text>
            <View style={{ 
              flex: 1, 
              height: 1, 
              backgroundColor: '#E5E7EB' 
            }} />
          </View>

          <View style={{ alignItems: 'center' }}>
            <GoogleAuth />
          </View>
        </View>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
} 