import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getUserRole, hasRole, getUserPermissions } from '../../lib/hybrid-rbac';

export default function RBACTest() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isCustomer, setIsCustomer] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function testRBAC() {
      try {
        console.log('=== Testing Hybrid RBAC Library ===');
        
        // Test getUserRole
        const role = await getUserRole();
        console.log('User role:', role);
        setUserRole(role);
        
        // Test hasRole
        const customerCheck = await hasRole('customer');
        console.log('Is customer:', customerCheck);
        setIsCustomer(customerCheck);
        
        // Test getUserPermissions
        const userPerms = await getUserPermissions();
        console.log('User permissions:', userPerms);
        setPermissions(userPerms);
        
        console.log('=== RBAC Tests Complete ===');
      } catch (error) {
        console.error('RBAC test error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    testRBAC();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Testing RBAC Library...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RBAC Test Results</Text>
      <Text style={styles.text}>User Role: {userRole || 'None'}</Text>
      <Text style={styles.text}>Is Customer: {isCustomer ? 'Yes' : 'No'}</Text>
      <Text style={styles.text}>Permissions: {permissions.join(', ') || 'None'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    margin: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
}); 