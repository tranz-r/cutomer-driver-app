import React, { useState } from 'react';
import { View } from 'react-native';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import EmailOtpSendScreen from '../components/EmailOtpSendScreen';
import GoogleAuth from '../components/GoogleAuth';

export default function OtpSendScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSend = async (email: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true, // or false if you want to restrict to existing users
      },
    });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.push({ pathname: '/otp-verify', params: { email } });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center' }}>
      <EmailOtpSendScreen onSend={handleSend} />
      <View style={{ alignItems: 'center', marginTop: 16 }}>
        <GoogleAuth />
      </View>
    </View>
  );
} 