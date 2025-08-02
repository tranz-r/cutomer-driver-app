import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getUserRole } from '../lib/hybrid-rbac';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function CustomerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const checkRole = async () => {
      const role = await getUserRole();
      if (role !== 'customer') {
        router.replace('/login');
      } else {
        setAuthorized(true);
      }
      setLoading(false);
    };
    checkRole();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007AFF" />;
  }
  if (!authorized) return null;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Content */}
      <View style={styles.container}>
        <Text style={styles.title}>🛍️ Customer Dashboard</Text>
        <Text style={styles.subtitle}>Welcome, Customer!</Text>
        <Text style={styles.info}>Book new moves, track your orders, and manage your account here.</Text>
        {/* Add more creative customer features here */}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  info: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
  },
});
