import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';
import EmailOtpVerifyScreen from '../components/EmailOtpVerifyScreen';
import UserTypeModal from '../components/UserTypeModal';
import { AppRole, getUserRole, assignUserRole, refreshSession } from '../../lib/hybrid-rbac';

export default function OtpVerifyScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

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
      // Check if user has a role assigned
      const userRole = await getUserRole();
      
      if (!userRole) {
        // User doesn't have a role, show role selection modal
        setShowRoleModal(true);
      } else {
        // User has a role, navigate to appropriate dashboard
        navigateToDashboard(userRole);
      }
    }
  };

  const navigateToDashboard = (role: AppRole) => {
    switch (role) {
      case 'customer':
        router.replace('/customer-dashboard');
        break;
      case 'driver':
        router.replace('/customer-dashboard'); // Use existing route for now
        break;
      case 'commercial_client':
        router.replace('/customer-dashboard'); // Use existing route for now
        break;
      default:
        router.replace('/customer-dashboard');
    }
  };

  const handleRoleSelection = async (role: AppRole) => {
    try {
      // Get current user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'User not found');
        return;
      }

      console.log('Assigning role:', role, 'to user:', user.id);

      // Assign role via .NET API
      const success = await assignUserRole(user.id, role);
      console.log('Role assignment result:', success);
      
      if (success) {
        // Refresh session to get updated JWT with role claim
        console.log('Refreshing session...');
        await refreshSession();
        
        // Verify the role was assigned by checking JWT
        const updatedRole = await getUserRole();
        console.log('Updated role from JWT:', updatedRole);
        
        //Alert.alert('Success', 'Account type set successfully!');
        navigateToDashboard(role);
      } else {
        Alert.alert('Error', 'Failed to set account type. Please try again.');
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      Alert.alert('Error', 'Failed to set account type. Please try again.');
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
    <>
      <EmailOtpVerifyScreen
        email={email as string}
        onVerify={handleVerify}
        onResend={handleResend}
        onSwitchAccount={() => router.replace('/otp-send')}
        onChangeEmail={() => router.replace('/otp-send')}
      />
      <UserTypeModal
        visible={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onSelectUserType={handleRoleSelection}
      />
    </>
  );
} 