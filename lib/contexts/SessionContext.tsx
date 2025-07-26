import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { getUserRole, AppRole } from '../hybrid-rbac';
import { router } from 'expo-router';

interface SessionContextType {
  session: any;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  navigateToDashboard: (role: AppRole) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigateToDashboard = (role: AppRole) => {
    switch (role) {
      case 'customer':
        router.replace('/customer-dashboard');
        break;
      case 'driver':
        router.replace('/driver-dashboard');
        break;
      case 'commercial_client':
        router.replace('/commercial-dashboard');
        break;
      default:
        router.replace('/customer-dashboard');
    }
  };

  const refreshSession = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      
      if (currentSession) {
        // Check user role and navigate to appropriate dashboard
        const userRole = await getUserRole();
        if (userRole) {
          navigateToDashboard(userRole);
        } else {
          // User has no role, redirect to OTP send for role selection
          router.replace('/otp-send');
        }
      } else {
        // No session, redirect to OTP send
        router.replace('/otp-send');
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      router.replace('/otp-send');
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      router.replace('/otp-send');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      setSession(session);
      
      if (session && event === 'SIGNED_IN') {
        // Check user role and navigate to appropriate dashboard
        const userRole = await getUserRole();
        if (userRole) {
          navigateToDashboard(userRole);
        } else {
          // User has no role, redirect to OTP send for role selection
          router.replace('/otp-send');
        }
      } else if (event === 'SIGNED_OUT') {
        router.replace('/otp-send');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check session and role on app load
  useEffect(() => {
    if (!isLoading && session) {
      const checkSessionAndRole = async () => {
        try {
          const userRole = await getUserRole();
          if (userRole) {
            navigateToDashboard(userRole);
          } else {
            // User has no role, redirect to OTP send for role selection
            router.replace('/otp-send');
          }
        } catch (error) {
          console.error('Error checking user role:', error);
          router.replace('/otp-send');
        }
      };
      
      checkSessionAndRole();
    } else if (!isLoading && !session) {
      // No session, redirect to OTP send
      router.replace('/otp-send');
    }
  }, [isLoading, session]);

  const value = {
    session,
    isLoading,
    signOut,
    refreshSession,
    navigateToDashboard,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
} 