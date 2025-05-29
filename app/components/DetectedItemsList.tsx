import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { Trash2, Edit, Plus, RefreshCw, X } from "lucide-react-native";

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
  items = [
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
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<{
    name: string;
    height: string;
    width: string;
    length: string;
  }>({ name: "", height: "", width: "", length: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
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
      onAddItem(newItemData);
      setNewItem({ name: "", height: "", width: "", length: "" });
      setShowAddModal(false);
      setHasChanges(true);
    }
  };

  const handleUpdateItem = (item: Item) => {
    onUpdateItem(item);
    setIsEditing(null);
    setHasChanges(true);
  };

  const handleRemoveItem = (id: string) => {
    onRemoveItem(id);
    setHasChanges(true);
  };

  const handleRecalculate = () => {
    onRecalculate();
    setHasChanges(false);
  };

  return (
    <View className="bg-white p-4 rounded-lg shadow-md">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold">Detected Items</Text>
        <TouchableOpacity
          onPress={() => setIsExpanded(!isExpanded)}
          className="p-2"
        >
          <Text className="text-blue-600 font-medium">
            {isExpanded ? "Collapse" : "Expand"}
          </Text>
        </TouchableOpacity>
      </View>

      {isExpanded && (
        <ScrollView
          className="max-h-96"
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
        >
          {items.map((item) => (
            <View key={item.id} className="mb-4 border-b border-gray-200 pb-3">
              {isEditing === item.id ? (
                <View className="bg-gray-50 p-3 rounded-md">
                  <TextInput
                    className="border border-gray-300 rounded-md p-2 mb-2"
                    value={item.name}
                    onChangeText={(text) =>
                      onUpdateItem({ ...item, name: text })
                    }
                    placeholder="Item name"
                  />
                  <View className="flex-row justify-between mb-2">
                    <View className="flex-1 mr-2">
                      <Text className="text-xs text-gray-500 mb-1">
                        Height (cm)
                      </Text>
                      <TextInput
                        className="border border-gray-300 rounded-md p-2"
                        value={item.height.toString()}
                        onChangeText={(text) => {
                          const height = parseFloat(text) || 0;
                          onUpdateItem({
                            ...item,
                            height,
                            volume:
                              (height * item.width * item.length) / 1000000,
                          });
                        }}
                        keyboardType="numeric"
                      />
                    </View>
                    <View className="flex-1 mr-2">
                      <Text className="text-xs text-gray-500 mb-1">
                        Width (cm)
                      </Text>
                      <TextInput
                        className="border border-gray-300 rounded-md p-2"
                        value={item.width.toString()}
                        onChangeText={(text) => {
                          const width = parseFloat(text) || 0;
                          onUpdateItem({
                            ...item,
                            width,
                            volume:
                              (item.height * width * item.length) / 1000000,
                          });
                        }}
                        keyboardType="numeric"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-gray-500 mb-1">
                        Length (cm)
                      </Text>
                      <TextInput
                        className="border border-gray-300 rounded-md p-2"
                        value={item.length.toString()}
                        onChangeText={(text) => {
                          const length = parseFloat(text) || 0;
                          onUpdateItem({
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
                  <View className="flex-row justify-end mt-2">
                    <TouchableOpacity
                      className="bg-gray-200 px-3 py-2 rounded-md mr-2"
                      onPress={() => setIsEditing(null)}
                    >
                      <Text>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-blue-500 px-3 py-2 rounded-md"
                      onPress={() => handleUpdateItem(item)}
                    >
                      <Text className="text-white">Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View>
                  <View className="flex-row justify-between items-center">
                    <Text className="font-semibold text-lg">{item.name}</Text>
                    <View className="flex-row">
                      <TouchableOpacity
                        className="p-2"
                        onPress={() => setIsEditing(item.id)}
                      >
                        <Edit size={18} color="#4B5563" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="p-2"
                        onPress={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View className="flex-row mt-1">
                    <Text className="text-gray-600 text-sm">
                      {item.height} × {item.width} × {item.length} cm
                    </Text>
                    <Text className="text-gray-600 text-sm ml-auto">
                      Volume: {item.volume.toFixed(2)} m³
                    </Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      <View className="mt-4 border-t border-gray-200 pt-3">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="font-semibold">Total Volume:</Text>
          <Text className="font-bold text-lg">{totalVolume} m³</Text>
        </View>

        <View className="flex-row justify-between flex-wrap gap-2">
          <TouchableOpacity
            className="bg-blue-500 px-3 py-2 rounded-md flex-row items-center flex-1 min-w-0"
            onPress={() => setShowAddModal(true)}
          >
            <Plus size={16} color="white" />
            <Text className="text-white ml-2 text-sm">Add Custom Item</Text>
          </TouchableOpacity>

          {hasChanges && (
            <TouchableOpacity
              className="bg-green-500 px-3 py-2 rounded-md flex-row items-center flex-1 min-w-0"
              onPress={handleRecalculate}
            >
              <RefreshCw size={16} color="white" />
              <Text className="text-white ml-2 text-sm">Recalculate</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Add Item Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-800">
                Add Custom Item
              </Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                className="p-1 rounded-full bg-gray-100"
              >
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Item Name
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-base bg-gray-50 focus:bg-white focus:border-blue-500"
                value={newItem.name}
                onChangeText={(text) => setNewItem({ ...newItem, name: text })}
                placeholder="e.g., Coffee Table"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-3">
                Dimensions (cm)
              </Text>
              <View className="flex-row justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-xs font-medium text-gray-600 mb-1">
                    Height
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 text-center bg-gray-50 focus:bg-white focus:border-blue-500"
                    value={newItem.height}
                    onChangeText={(text) =>
                      setNewItem({ ...newItem, height: text })
                    }
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-medium text-gray-600 mb-1">
                    Width
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 text-center bg-gray-50 focus:bg-white focus:border-blue-500"
                    value={newItem.width}
                    onChangeText={(text) =>
                      setNewItem({ ...newItem, width: text })
                    }
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-medium text-gray-600 mb-1">
                    Length
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 text-center bg-gray-50 focus:bg-white focus:border-blue-500"
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

            <View className="flex-row justify-end gap-3">
              <TouchableOpacity
                className="bg-gray-100 px-6 py-3 rounded-lg flex-1"
                onPress={() => setShowAddModal(false)}
              >
                <Text className="text-gray-700 font-medium text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-600 px-6 py-3 rounded-lg flex-1"
                onPress={handleAddItem}
              >
                <Text className="text-white font-medium text-center">
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
