import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../lib/supabase';
import EmailOtpVerifyScreen from './components/EmailOtpVerifyScreen';

export default function OtpVerifyScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const handleVerify = async (otp: string) => {
    setLoading(true);
    const { data: { session }, error } = await supabase.auth.verifyOtp({
      email: email as string,
      token: otp,
      type: 'email',
    });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else if (session) {
      router.replace('/customer-dashboard');
    }
  };

  const handleResend = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email: email as string,
      options: {
        shouldCreateUser: false,
      },
    });
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('OTP Resent', 'Check your email for the new code.');
    }
  };

  return (
    <EmailOtpVerifyScreen
      email={email as string}
      onVerify={handleVerify}
      onResend={handleResend}
      onSwitchAccount={() => router.replace('/otp-send')}
      onChangeEmail={() => router.replace('/otp-send')}
    />
  );
} 