import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  X,
  ShoppingCart,
  Trash2,
  Edit,
  Plus,
  Minus,
  Package,
} from "lucide-react-native";
import { useCart } from "../contexts/CartContext";

type ShoppingCartModalProps = {
  visible: boolean;
  onClose: () => void;
};

const ShoppingCartModal = ({ visible, onClose }: ShoppingCartModalProps) => {
  const { items, removeItem, updateItem, updateQuantity, getTotalVolume } =
    useCart();
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const handleUpdateDimensions = (
    itemId: string,
    field: "height" | "width" | "length",
    value: string,
  ) => {
    const numValue = parseFloat(value) || 0;
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const updatedItem = { ...item, [field]: numValue };
    // Recalculate volume based on new dimensions
    const volume =
      (updatedItem.height * updatedItem.width * updatedItem.length) / 1000000;
    updatedItem.volume = volume;

    updateItem(updatedItem);
  };

  const totalVolume = getTotalVolume().toFixed(2);

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ paddingTop: Platform.OS === "ios" ? 44 : 24 }}
      >
        <View className="flex-1 bg-white">
          <View className="bg-white flex-1">
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <View className="flex-row items-center">
                <View className="bg-blue-100 p-2 rounded-full mr-3">
                  <ShoppingCart size={20} color="#3b82f6" />
                </View>
                <View>
                  <Text className="text-xl font-bold text-gray-900">
                    Shopping Cart
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={onClose}
                className="p-2 rounded-full bg-gray-100"
              >
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Cart Items */}
            <ScrollView
              className="flex-1 p-4"
              showsVerticalScrollIndicator={false}
            >
              {items.length === 0 ? (
                <View className="flex-1 items-center justify-center py-12">
                  <View className="bg-gray-100 p-6 rounded-full mb-4">
                    <ShoppingCart size={48} color="#9ca3af" />
                  </View>
                  <Text className="text-lg font-semibold text-gray-500 mb-2">
                    Your cart is empty
                  </Text>
                  <Text className="text-gray-400 text-center">
                    Add items from the inventory screens to get started
                  </Text>
                </View>
              ) : (
                <View className="space-y-4">
                  {items.map((item, index) => (
                    <View key={item.id} className="mb-4">
                      {editingItemId === item.id ? (
                        <View className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <TextInput
                            className="border border-blue-300 rounded-lg p-3 mb-3 bg-white text-base font-medium"
                            value={item.name}
                            onChangeText={(text) => {
                              updateItem({ ...item, name: text });
                            }}
                            placeholder="Item name"
                          />
                          <View className="mb-3">
                            <Text className="text-sm font-bold text-blue-700 mb-2">
                              Dimensions (cm):
                            </Text>
                            <View className="flex-row space-x-2">
                              <View className="flex-1">
                                <Text className="text-xs text-blue-600 mb-1">
                                  Height
                                </Text>
                                <TextInput
                                  className="border border-blue-300 rounded-lg px-3 py-2 text-center font-medium bg-white"
                                  value={item.height.toString()}
                                  onChangeText={(value) =>
                                    handleUpdateDimensions(
                                      item.id,
                                      "height",
                                      value,
                                    )
                                  }
                                  keyboardType="numeric"
                                  placeholder="0"
                                />
                              </View>
                              <View className="flex-1">
                                <Text className="text-xs text-blue-600 mb-1">
                                  Width
                                </Text>
                                <TextInput
                                  className="border border-blue-300 rounded-lg px-3 py-2 text-center font-medium bg-white"
                                  value={item.width.toString()}
                                  onChangeText={(value) =>
                                    handleUpdateDimensions(
                                      item.id,
                                      "width",
                                      value,
                                    )
                                  }
                                  keyboardType="numeric"
                                  placeholder="0"
                                />
                              </View>
                              <View className="flex-1">
                                <Text className="text-xs text-blue-600 mb-1">
                                  Length
                                </Text>
                                <TextInput
                                  className="border border-blue-300 rounded-lg px-3 py-2 text-center font-medium bg-white"
                                  value={item.length.toString()}
                                  onChangeText={(value) =>
                                    handleUpdateDimensions(
                                      item.id,
                                      "length",
                                      value,
                                    )
                                  }
                                  keyboardType="numeric"
                                  placeholder="0"
                                />
                              </View>
                            </View>
                          </View>
                          <Text className="text-blue-600 text-xs mb-4">
                            Volume: {item.volume.toFixed(3)} m³ each
                          </Text>
                          <View className="flex-row justify-between">
                            <TouchableOpacity
                              className="bg-gray-200 px-6 py-3 rounded-lg flex-1 mr-2"
                              onPress={() => setEditingItemId(null)}
                            >
                              <Text className="font-semibold text-gray-700 text-sm text-center">
                                Cancel
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              className="bg-blue-600 px-6 py-3 rounded-lg flex-1 ml-2"
                              onPress={() => setEditingItemId(null)}
                            >
                              <Text className="text-white font-semibold text-sm text-center">
                                Save
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        <View className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                          <View className="flex-row justify-between items-start">
                            <View className="flex-row items-center flex-1">
                              <View className="bg-blue-100 p-1.5 rounded-full mr-3">
                                <Text className="text-blue-600 font-bold text-sm">
                                  {index + 1}
                                </Text>
                              </View>
                              <View className="flex-1 mr-4">
                                <Text className="font-bold text-lg text-gray-900 mb-1">
                                  {item.name}
                                </Text>
                                <Text className="text-gray-600 text-sm">
                                  {item.height} × {item.width} × {item.length}{" "}
                                  cm
                                </Text>
                                <Text className="text-gray-500 text-xs mt-1">
                                  Volume: {item.volume.toFixed(3)} m³ each •
                                  Qty: {item.quantity}
                                </Text>
                              </View>
                            </View>
                            <View className="flex-row items-center">
                              <View className="flex-row items-center bg-gray-100 rounded-lg mr-3">
                                <TouchableOpacity
                                  className="p-2"
                                  onPress={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                >
                                  <Minus size={16} color="#6B7280" />
                                </TouchableOpacity>
                                <Text className="mx-3 font-bold text-lg">
                                  {item.quantity}
                                </Text>
                                <TouchableOpacity
                                  className="p-2"
                                  onPress={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                >
                                  <Plus size={16} color="#6B7280" />
                                </TouchableOpacity>
                              </View>
                              <TouchableOpacity
                                className="bg-blue-50 p-3 rounded-full mr-2"
                                onPress={() => setEditingItemId(item.id)}
                              >
                                <Edit size={18} color="#3b82f6" />
                              </TouchableOpacity>
                              <TouchableOpacity
                                className="bg-red-50 p-3 rounded-full"
                                onPress={() => removeItem(item.id)}
                              >
                                <Trash2 size={18} color="#ef4444" />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>

            {/* Footer with Total */}
            {items.length > 0 && (
              <View className="border-t border-gray-200 p-4">
                <View className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="text-blue-700 font-medium text-sm mb-1">
                        Total Estimated Volume
                      </Text>
                      <Text className="text-blue-900 font-bold text-2xl">
                        {totalVolume} m³
                      </Text>
                      <Text className="text-blue-600 text-xs mt-1">
                        Based on{" "}
                        {items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                        items
                      </Text>
                    </View>
                    <View className="bg-blue-200 p-3 rounded-full">
                      <Package size={24} color="#1e40af" />
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ShoppingCartModal;
