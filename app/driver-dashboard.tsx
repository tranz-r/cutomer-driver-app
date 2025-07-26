import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { getUserRole } from '../lib/hybrid-rbac';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Menu } from 'lucide-react-native';
import SlideOutMenu from './components/SlideOutMenu';

export default function DriverDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [showSlideOutMenu, setShowSlideOutMenu] = useState(false);
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
      {/* Header */}
      <View
        style={{
          backgroundColor: "#7080cc",
          paddingTop: insets.top
        }}
        className="pb-6"
      >
        <View className="px-4 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => setShowSlideOutMenu(true)}
            className="bg-white/20 p-3 rounded-full mr-3"
          >
            <Menu size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-white mb-1">
              Driver Dashboard
            </Text>
            <Text className="text-sm text-white">
              Manage your deliveries and earnings
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.container}>
        <Text style={styles.title}>🚚 Driver Dashboard</Text>
        <Text style={styles.subtitle}>Welcome, Driver!</Text>
        <Text style={styles.info}>Here you can view your assigned jobs, accept new deliveries, and track your earnings.</Text>
        {/* Add more creative driver features here */}
      </View>

      {/* SlideOutMenu */}
      <SlideOutMenu
        visible={showSlideOutMenu}
        onClose={() => setShowSlideOutMenu(false)}
      />
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