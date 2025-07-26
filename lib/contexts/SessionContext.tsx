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
        }
        // If no role, don't redirect - let user stay on current screen
      }
      // If no session, don't redirect - let user stay on current screen
    } catch (error) {
      console.error('Error refreshing session:', error);
      // Don't redirect on error - let user stay on current screen
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      // Navigate to landing screen after sign out
      router.replace('/landing');
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
      setSession(session);
      
      if (session && event === 'SIGNED_IN') {
        // Check user role and navigate to appropriate dashboard
        const userRole = await getUserRole();
        if (userRole) {
          navigateToDashboard(userRole);
        }
        // If no role, don't redirect - let user stay on current screen
      }
      // Don't auto-redirect on sign out - let user stay on current screen
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
            // Only navigate if user has a role and is not already on the correct screen
            navigateToDashboard(userRole);
          }
          // Don't redirect if no role - let user stay on current screen
        } catch (error) {
          console.error('Error checking user role:', error);
          // Don't redirect on error - let user stay on current screen
        }
      };
      
      checkSessionAndRole();
    }
    // Don't auto-redirect if no session - let user stay on current screen
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