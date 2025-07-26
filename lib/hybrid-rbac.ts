import { supabase } from './supabase';
import { jwtDecode } from 'jwt-decode';

export type AppRole = 'customer' | 'driver' | 'commercial_client' | 'admin';

interface JWTPayload {
  user_role?: AppRole;
  [key: string]: any;
}

// READ operations (fast, direct Supabase)
export async function getUserRole(): Promise<AppRole | null> {
  try {
    const { data } = await supabase.auth.getSession();
    if (!data?.session?.access_token) return null;
    
    const jwt = jwtDecode<JWTPayload>(data.session.access_token);
    return jwt.user_role || null;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

// WRITE operations (secure, via .NET API)
export async function assignUserRole(userId: string, role: AppRole): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      console.error('No valid session found');
      return false;
    }

    const baseUrl = process.env.EXPO_PUBLIC_STRIPE_INTENT_BASE_URL;
    if (!baseUrl) {
      console.error('EXPO_PUBLIC_STRIPE_INTENT_BASE_URL not configured');
      return false;
    }
    
    const response = await fetch(`${baseUrl}/api/v1/auth/role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ userId, role }),
    });
    
    if (!response.ok) {
      console.error('API request failed:', response.status, response.statusText);
      return false;
    }
    
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error assigning role:', error);
    return false;
  }
}

// Utility function to refresh session after role assignment
export async function refreshSession(): Promise<void> {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Error refreshing session:', error);
    }
  } catch (error) {
    console.error('Error refreshing session:', error);
  }
}

// Helper function to check if user has specific role
export async function hasRole(requiredRole: AppRole): Promise<boolean> {
  const userRole = await getUserRole();
  return userRole === requiredRole;
}

// Helper function to get user permissions based on role
export async function getUserPermissions(): Promise<string[]> {
  const role = await getUserRole();
  if (!role) return [];
  
  // This would typically come from the role_permissions table
  // For now, return basic permissions based on role
  const rolePermissions: Record<AppRole, string[]> = {
    customer: ['bookings.read', 'bookings.write'],
    driver: ['jobs.accept', 'jobs.update_status', 'routes.view'],
    commercial_client: ['bookings.read', 'bookings.write', 'analytics.read'],
    admin: ['bookings.read', 'bookings.write', 'bookings.delete', 'jobs.accept', 'jobs.update_status', 'routes.view', 'users.read', 'users.write', 'analytics.read']
  };
  
  return rolePermissions[role] || [];
} 