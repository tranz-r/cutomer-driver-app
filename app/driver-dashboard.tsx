import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { getUserRole } from '../lib/hybrid-rbac';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function DriverDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const checkRole = async () => {
      const role = await getUserRole();
      if (role !== 'driver') {
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
        <Text style={styles.title}>🚚 Driver Dashboard</Text>
        <Text style={styles.subtitle}>Welcome, Driver!</Text>
        <Text style={styles.info}>Here you can view your assigned jobs, accept new deliveries, and track your earnings.</Text>
        {/* Add more creative driver features here */}
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