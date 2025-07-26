import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import UserTypeModal from './UserTypeModal';
import { AppRole } from '../../lib/hybrid-rbac';

export default function UserTypeModalTest() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AppRole | null>(null);

  const handleSelectUserType = (role: AppRole) => {
    setSelectedRole(role);
    Alert.alert(
      'Role Selected',
      `You selected: ${role}`,
      [{ text: 'OK', onPress: () => console.log('Role selection confirmed') }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>UserTypeModal Test</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Open Role Selection Modal</Text>
      </TouchableOpacity>

      {selectedRole && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Selected Role: <Text style={styles.roleText}>{selectedRole}</Text>
          </Text>
        </View>
      )}

      <UserTypeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectUserType={handleSelectUserType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
  roleText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
}); 