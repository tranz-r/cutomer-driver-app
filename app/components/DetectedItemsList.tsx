import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { Trash2, Edit, Plus, RefreshCw, X, Package } from "lucide-react-native";

type Item = {
  id: string;
  name: string;
  height: number;
  width: number;
  length: number;
  volume: number;
};

type DetectedItemsListProps = {
  items?: Item[];
  onAddItem?: (item: Item) => void;
  onRemoveItem?: (id: string) => void;
  onUpdateItem?: (item: Item) => void;
  onRecalculate?: () => void;
  isVisible?: boolean;
};

const DetectedItemsList = ({
  items: initialItems = [
    { id: "1", name: "Sofa", height: 85, width: 200, length: 90, volume: 1.53 },
    {
      id: "2",
      name: "Dining Table",
      height: 75,
      width: 160,
      length: 90,
      volume: 1.08,
    },
    {
      id: "3",
      name: "Bookshelf",
      height: 180,
      width: 80,
      length: 30,
      volume: 0.432,
    },
  ],
  onAddItem = () => {},
  onRemoveItem = () => {},
  onUpdateItem = () => {},
  onRecalculate = () => {},
  isVisible = true,
}: DetectedItemsListProps) => {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<{
    name: string;
    height: string;
    width: string;
    length: string;
  }>({ name: "", height: "", width: "", length: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  if (!isVisible) return null;

  const totalVolume = items
    .reduce((sum, item) => sum + item.volume, 0)
    .toFixed(2);

  const handleAddItem = () => {
    const height = parseFloat(newItem.height);
    const width = parseFloat(newItem.width);
    const length = parseFloat(newItem.length);

    if (newItem.name && !isNaN(height) && !isNaN(width) && !isNaN(length)) {
      const volume = (height * width * length) / 1000000;
      const newItemData: Item = {
        id: Date.now().toString(),
        name: newItem.name,
        height,
        width,
        length,
        volume,
      };
      const updatedItems = [...items, newItemData];
      setItems(updatedItems);
      onAddItem(newItemData);
      setNewItem({ name: "", height: "", width: "", length: "" });
      setShowAddModal(false);
    }
  };

  const handleUpdateItem = (item: Item) => {
    const updatedItems = items.map((i) => (i.id === item.id ? item : i));
    setItems(updatedItems);
    onUpdateItem(item);
    setIsEditing(null);
  };

  const handleRemoveItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    onRemoveItem(id);
  };

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <View className="bg-blue-100 p-2 rounded-full mr-3">
            <Package size={20} color="#3b82f6" />
          </View>
          <View>
            <Text className="text-xl font-bold text-gray-900">
              Detected Items
            </Text>
            <Text className="text-xs text-gray-500">
              AI-powered item recognition
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setIsExpanded(!isExpanded)}
          className="bg-blue-50 px-3 py-1 rounded-lg"
        >
          <Text className="text-blue-700 font-semibold text-sm">
            {isExpanded ? "Collapse" : "Expand"}
          </Text>
        </TouchableOpacity>
      </View>

      {isExpanded && (
        <ScrollView
          className="max-h-80"
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
        >
          {items.map((item, index) => (
            <View key={item.id} className="mb-3">
              {isEditing === item.id ? (
                <View className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <TextInput
                    className="border border-blue-300 rounded-lg p-2 mb-2 bg-white text-sm font-medium"
                    value={item.name}
                    onChangeText={(text) =>
                      handleUpdateItem({ ...item, name: text })
                    }
                    placeholder="Item name"
                  />
                  <View className="flex-row justify-between mb-4">
                    <View className="flex-1 mx-1">
                      <Text className="text-xs font-semibold text-blue-700 mb-2">
                        Height (cm)
                      </Text>
                      <TextInput
                        className="border border-blue-300 rounded-lg p-3 bg-white text-center font-medium text-sm"
                        value={item.height.toString()}
                        onChangeText={(text) => {
                          const height = parseFloat(text) || 0;
                          handleUpdateItem({
                            ...item,
                            height,
                            volume:
                              (height * item.width * item.length) / 1000000,
                          });
                        }}
                        keyboardType="numeric"
                      />
                    </View>
                    <View className="flex-1 mx-1">
                      <Text className="text-xs font-semibold text-blue-700 mb-2">
                        Width (cm)
                      </Text>
                      <TextInput
                        className="border border-blue-300 rounded-lg p-3 bg-white text-center font-medium text-sm"
                        value={item.width.toString()}
                        onChangeText={(text) => {
                          const width = parseFloat(text) || 0;
                          handleUpdateItem({
                            ...item,
                            width,
                            volume:
                              (item.height * width * item.length) / 1000000,
                          });
                        }}
                        keyboardType="numeric"
                      />
                    </View>
                    <View className="flex-1 mx-1">
                      <Text className="text-xs font-semibold text-blue-700 mb-2">
                        Length (cm)
                      </Text>
                      <TextInput
                        className="border border-blue-300 rounded-lg p-3 bg-white text-center font-medium text-sm"
                        value={item.length.toString()}
                        onChangeText={(text) => {
                          const length = parseFloat(text) || 0;
                          handleUpdateItem({
                            ...item,
                            length,
                            volume:
                              (item.height * item.width * length) / 1000000,
                          });
                        }}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                  <View className="flex-row justify-between mt-6">
                    <TouchableOpacity
                      className="bg-gray-200 px-8 py-3 rounded-lg flex-1 mr-4"
                      onPress={() => setIsEditing(null)}
                    >
                      <Text className="font-semibold text-gray-700 text-sm text-center">
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-blue-600 px-8 py-3 rounded-lg flex-1"
                      onPress={() => setIsEditing(null)}
                    >
                      <Text className="text-white font-semibold text-sm text-center">
                        Save
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center flex-1">
                      <View className="bg-blue-100 p-1.5 rounded-full mr-2">
                        <Text className="text-blue-600 font-bold text-sm">
                          {index + 1}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="font-bold text-lg text-gray-900">
                          {item.name}
                        </Text>
                        <Text className="text-gray-600 text-sm">
                          {item.height} × {item.width} × {item.length} cm
                        </Text>
                        <Text className="text-gray-500 text-xs mt-1">
                          Volume: {item.volume.toFixed(2)} m³
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center space-x-1">
                      <TouchableOpacity
                        className="bg-blue-50 p-1.5 rounded-full"
                        onPress={() => setIsEditing(item.id)}
                      >
                        <Edit size={16} color="#3b82f6" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="bg-red-50 p-1.5 rounded-full"
                        onPress={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 size={16} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      <View className="mt-4 pt-4 border-t border-gray-200">
        {/* Add Custom Item Button */}
        <TouchableOpacity
          className="bg-purple-500 p-3 rounded-xl shadow-sm mb-4"
          onPress={() => setShowAddModal(true)}
        >
          <View className="flex-row items-center justify-center">
            <Plus size={18} color="white" />
            <Text className="text-white font-bold text-base ml-2">
              Add Custom Item
            </Text>
          </View>
        </TouchableOpacity>

        {/* Total Volume Summary */}
        <View className="bg-blue-600 p-4 rounded-xl shadow-sm">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-blue-100 font-medium text-sm mb-1">
                Total Estimated Volume
              </Text>
              <Text className="text-white font-bold text-2xl">
                {totalVolume} m³
              </Text>
            </View>
            <View className="bg-white/20 p-3 rounded-full">
              <Package size={24} color="#ffffff" />
            </View>
          </View>
        </View>
      </View>

      {/* Add Item Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-2xl p-4 shadow-lg">
            {/* Header */}
            <View className="items-center mb-4">
              <View className="w-10 h-1 bg-gray-300 rounded-full mb-3" />
              <Text className="text-xl font-bold text-gray-900 mb-1">
                Add Custom Item
              </Text>
              <Text className="text-gray-500 text-center text-sm">
                Manually add items that weren't detected
              </Text>
            </View>

            {/* Item Name Input */}
            <View className="mb-4">
              <Text className="text-sm font-bold text-gray-800 mb-2">
                Item Name
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-base bg-gray-50"
                value={newItem.name}
                onChangeText={(text) => setNewItem({ ...newItem, name: text })}
                placeholder="e.g., Coffee Table, Wardrobe"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Dimensions Input */}
            <View className="mb-8">
              <Text className="text-sm font-bold text-gray-800 mb-4">
                Dimensions (centimeters)
              </Text>
              <View className="flex-row justify-between">
                <View className="flex-1 mx-1">
                  <Text className="text-xs font-semibold text-purple-700 mb-2 text-center">
                    Height
                  </Text>
                  <TextInput
                    className="border border-purple-200 rounded-lg p-3 text-center text-sm bg-purple-50 font-medium"
                    value={newItem.height}
                    onChangeText={(text) =>
                      setNewItem({ ...newItem, height: text })
                    }
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View className="flex-1 mx-1">
                  <Text className="text-xs font-semibold text-purple-700 mb-2 text-center">
                    Width
                  </Text>
                  <TextInput
                    className="border border-purple-200 rounded-lg p-3 text-center text-sm bg-purple-50 font-medium"
                    value={newItem.width}
                    onChangeText={(text) =>
                      setNewItem({ ...newItem, width: text })
                    }
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View className="flex-1 mx-1">
                  <Text className="text-xs font-semibold text-purple-700 mb-2 text-center">
                    Length
                  </Text>
                  <TextInput
                    className="border border-purple-200 rounded-lg p-3 text-center text-sm bg-purple-50 font-medium"
                    value={newItem.length}
                    onChangeText={(text) =>
                      setNewItem({ ...newItem, length: text })
                    }
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                className="bg-gray-100 px-8 py-4 rounded-lg flex-1 mr-4"
                onPress={() => setShowAddModal(false)}
              >
                <Text className="text-gray-700 font-bold text-base text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-purple-500 px-8 py-4 rounded-lg flex-1 shadow-sm"
                onPress={handleAddItem}
              >
                <Text className="text-white font-bold text-base text-center">
                  Add Item
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DetectedItemsList;
