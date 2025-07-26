import React, { useState } from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import { supabase } from '../../lib/supabase'
import { Alert } from 'react-native'
import { router } from 'expo-router'
import UserTypeModal from './UserTypeModal';
import { AppRole, getUserRole, assignUserRole, refreshSession } from '../../lib/hybrid-rbac';

export default function GoogleAuth() {
  const [showRoleModal, setShowRoleModal] = useState(false);

  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_AUTH_WEB_CLIENT_ID;
  console.log('Google Auth Web Client ID:', webClientId);
  
  // For debugging - remove this after fixing
  if (!webClientId) {
    console.error('Google Auth Web Client ID is not set!');
  }
  
  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId: webClientId || 'your_actual_client_id_here'
  })

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

        navigateToDashboard(role);
      } else {
        Alert.alert('Error', 'Failed to set account type. Please try again.');
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      Alert.alert('Error', 'Failed to set account type. Please try again.');
    }
  };

  return (
    <>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={async () => {
          try {
            await GoogleSignin.hasPlayServices()
            const userInfo = await GoogleSignin.signIn()
            console.log(JSON.stringify(userInfo, null, 2))

            
            if (userInfo?.data?.idToken) {
              console.log('Logging in via Google')
              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: userInfo.data.idToken,
              })
              console.log(error, data)

              if (error) {
                Alert.alert(error.message);
              } else {
                // Check if user has a role assigned
                const userRole = await getUserRole();
                console.log('User role after Google auth:', userRole);

                if (!userRole) {
                  // User doesn't have a role, show role selection modal
                  setShowRoleModal(true);
                } else {
                  // User has a role, navigate to appropriate dashboard
                  navigateToDashboard(userRole);
                }
              }
            } else {
              throw new Error('no ID token present!')
            }
          } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              // user cancelled the login flow
              console.log('user cancelled the login flow')
            } else if (error.code === statusCodes.IN_PROGRESS) {
              // operation (e.g. sign in) is in progress already
              console.log('operation (e.g. sign in) is in progress already')
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              // play services not available or outdated
              console.log('play services not available or outdated')
            } else {
              // some other error happened
              console.log('some other error happened')
              console.log(error)
            }
          }
        }}
      />
      <UserTypeModal
        visible={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onSelectUserType={handleRoleSelection}
      />
    </>
  )
}