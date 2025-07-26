import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import {
  X,
  FileText,
  Calendar,
  MessageCircle,
  User,
  ChevronRight,
  LogOut,
} from "lucide-react-native";
import { router } from "expo-router";
import { useSession } from "../../lib/contexts/SessionContext";

type SlideOutMenuProps = {
  visible: boolean;
  onClose: () => void;
};

const { width: screenWidth } = Dimensions.get("window");
const MENU_WIDTH = screenWidth * 0.8; // 80% of screen width

export default function SlideOutMenu({ visible, onClose }: SlideOutMenuProps) {
  const { signOut } = useSession();
  const slideAnimation = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide in animation
      Animated.parallel([
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide out animation
      Animated.parallel([
        Animated.timing(slideAnimation, {
          toValue: -MENU_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const menuItems = [
    {
      id: "quote",
      title: "Quote",
      subtitle: "Get a moving quote",
      icon: <FileText size={24} color="#3b82f6" />,
      onPress: () => {
        onClose();
        router.push("/item-detection");
      },
    },
    {
      id: "booking",
      title: "Booking",
      subtitle: "Manage your bookings",
      icon: <Calendar size={24} color="#10b981" />,
      onPress: () => {
        onClose();
        router.push("/customer-dashboard");
      },
    },
    {
      id: "messages",
      title: "Messages",
      subtitle: "Chat with support",
      icon: <MessageCircle size={24} color="#f59e0b" />,
      onPress: () => {
        onClose();
        // TODO: Navigate to messages screen when implemented
        console.log("Navigate to messages");
      },
    },
    {
      id: "account",
      title: "Account",
      subtitle: "Profile & settings",
      icon: <User size={24} color="#8b5cf6" />,
      onPress: () => {
        onClose();
        router.push("/login");
      },
    },
    {
      id: "logout",
      title: "Logout",
      subtitle: "Sign out of your account",
      icon: <LogOut size={24} color="#ef4444" />,
      onPress: async () => {
        onClose();
        await signOut();
      },
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          className="flex-1 bg-black"
          style={{
            opacity: overlayOpacity,
          }}
        />
      </TouchableWithoutFeedback>

      {/* Menu Panel */}
      <Animated.View
        className="absolute top-0 left-0 h-full bg-white shadow-2xl"
        style={{
          width: MENU_WIDTH,
          transform: [{ translateX: slideAnimation }],
        }}
      >
        {/* Header */}
        <View
          className="pt-16 pb-6 px-6 border-b border-gray-100"
          style={{ backgroundColor: "#7080cc" }}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-white mb-1">
                Tranzr Menu
              </Text>
              <Text className="text-sm text-white opacity-90">
                Quick access to your services
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="bg-white/20 p-2 rounded-full"
            >
              <X size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <View className="flex-1 px-4 py-6">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              className="flex-row items-center p-4 mb-3 bg-gray-50 rounded-xl border border-gray-100 shadow-sm"
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View className="bg-white p-3 rounded-full mr-4 shadow-sm">
                {item.icon}
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 mb-1">
                  {item.title}
                </Text>
                <Text className="text-sm text-gray-600">{item.subtitle}</Text>
              </View>
              <ChevronRight size={20} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View className="px-6 py-4 border-t border-gray-100">
          <Text className="text-center text-xs text-gray-500">
            Tranzr - Moving Made Simple
          </Text>
          <Text className="text-center text-xs text-gray-400 mt-1">
            Version 1.0.0
          </Text>
        </View>
      </Animated.View>
    </Modal>
  );
}
