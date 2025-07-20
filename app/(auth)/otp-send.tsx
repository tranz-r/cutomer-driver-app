import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import EmailOtpSendScreen from '../components/EmailOtpSendScreen';

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
      Alert.alert('OTP Sent', 'Check your email for the verification code.');
      router.push({ pathname: '/otp-verify', params: { email } });
    }
  };

  return (
    <EmailOtpSendScreen onSend={handleSend} />
  );
} 