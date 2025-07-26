import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { AppRole } from '../../lib/hybrid-rbac';

interface UserTypeModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectUserType: (role: AppRole) => void;
}

const { width, height } = Dimensions.get('window');

export default function UserTypeModal({ visible, onClose, onSelectUserType }: UserTypeModalProps) {
  const handleRoleSelection = (role: AppRole) => {
    onSelectUserType(role);
    onClose();
  };

  const roleOptions = [
    {
      role: 'customer' as AppRole,
      title: 'Customer',
      description: 'I need to move items from one place to another',
      icon: '🛍️',
    },
    {
      role: 'driver' as AppRole,
      title: 'Driver',
      description: 'I want to provide delivery services',
      icon: '🚚',
    },
    {
      role: 'commercial_client' as AppRole,
      title: 'Commercial Client',
      description: 'I represent a business with regular shipping needs',
      icon: '🏢',
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <SafeAreaView style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Choose Your Account Type</Text>
              <Text style={styles.subtitle}>
                Select the type of account that best describes how you'll use Tranzr
              </Text>
            </View>

            {/* Role Options */}
            <View style={styles.optionsContainer}>
              {roleOptions.map((option, index) => (
                <TouchableOpacity
                  key={option.role}
                  style={styles.roleOption}
                  onPress={() => handleRoleSelection(option.role)}
                  activeOpacity={0.7}
                >
                  <View style={styles.roleIcon}>
                    <Text style={styles.iconText}>{option.icon}</Text>
                  </View>
                  <View style={styles.roleContent}>
                    <Text style={styles.roleTitle}>{option.title}</Text>
                    <Text style={styles.roleDescription}>{option.description}</Text>
                  </View>
                  <View style={styles.arrowContainer}>
                    <Text style={styles.arrow}>→</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Cancel Button */}
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: height * 0.6,
    maxHeight: height * 0.8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  optionsContainer: {
    flex: 1,
    gap: 16,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconText: {
    fontSize: 24,
  },
  roleContent: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  arrowContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
}); 