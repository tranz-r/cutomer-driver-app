import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Trash2,
  Edit,
  Plus,
  RefreshCw,
  X,
  Package,
  Search,
  Minus,
  ChevronDown,
  Star,
} from "lucide-react-native";
import itemsData from "../../Tranzr-Item-data-with-enrichment.json";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItemQuantities, setSelectedItemQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  // Helper function to get dimensions from item data
  const getItemDimensions = (item: any) => {
    // Handle different dimension property formats
    if (item.dimensions_cm) {
      return {
        height: item.dimensions_cm.height,
        width: item.dimensions_cm.width,
        length: item.dimensions_cm.length,
      };
    } else if (item.length_cm || item.width_cm || item.height_cm) {
      return {
        height: item.height_cm || item.height || 0,
        width: item.width_cm || item.width || 0,
        length: item.length_cm || item.length || 0,
      };
    } else {
      return {
        height: item.height || 0,
        width: item.width || 0,
        length: item.length || 0,
      };
    }
  };

  // Memoized filtered items for better performance
  const filteredItems = useMemo(() => {
    if (searchQuery.trim() === "") {
      return itemsData.goods
        .sort((a, b) => (b.popularity_index || 0) - (a.popularity_index || 0))
        .slice(0, 20); // Show top 20 popular items when no search
    }

    const query = searchQuery.toLowerCase();
    return itemsData.goods
      .filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(query);
        const categoryMatch =
          item.category_id && item.category_id.toString().includes(query);
        return nameMatch || categoryMatch;
      })
      .sort((a, b) => {
        // Prioritize exact matches and popular items
        const aExact = a.name.toLowerCase().startsWith(query) ? 1 : 0;
        const bExact = b.name.toLowerCase().startsWith(query) ? 1 : 0;
        if (aExact !== bExact) return bExact - aExact;
        return (b.popularity_index || 0) - (a.popularity_index || 0);
      })
      .slice(0, 50); // Limit results for performance
  }, [searchQuery]);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setShowSuggestions(text.length > 0);
  };

  const handleQuantityChange = (itemName: string, change: number) => {
    setSelectedItemQuantities((prev) => ({
      ...prev,
      [itemName]: Math.max(1, (prev[itemName] || 1) + change),
    }));
  };

  const handleSelectItem = (selectedItem: any) => {
    const quantity = selectedItemQuantities[selectedItem.name] || 1;
    const dimensions = getItemDimensions(selectedItem);

    for (let i = 0; i < quantity; i++) {
      const newItemData: Item = {
        id: `${Date.now()}-${i}`,
        name: selectedItem.name,
        height: dimensions.height,
        width: dimensions.width,
        length: dimensions.length,
        volume: selectedItem.volume_m3 || 0,
      };
      const updatedItems = [...items, newItemData];
      setItems(updatedItems);
      onAddItem(newItemData);
    }

    // Reset state
    setSearchQuery("");
    setSelectedItemQuantities({});
    setShowSuggestions(false);
    setShowAddModal(false);
    Keyboard.dismiss();
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
        <View className="space-y-4 mb-4">
          {items.map((item, index) => (
            <View key={item.id} className="mb-4">
              {isEditing === item.id ? (
                <View className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <TextInput
                    className="border border-blue-300 rounded-lg p-2 mb-2 bg-white text-sm font-medium"
                    value={item.name}
                    onChangeText={(text) => {
                      const updatedItems = items.map((i) =>
                        i.id === item.id ? { ...i, name: text } : i,
                      );
                      setItems(updatedItems);
                    }}
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
                          const updatedItems = items.map((i) =>
                            i.id === item.id
                              ? {
                                  ...i,
                                  height,
                                  volume:
                                    (height * i.width * i.length) / 1000000,
                                }
                              : i,
                          );
                          setItems(updatedItems);
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
                          const updatedItems = items.map((i) =>
                            i.id === item.id
                              ? {
                                  ...i,
                                  width,
                                  volume:
                                    (i.height * width * i.length) / 1000000,
                                }
                              : i,
                          );
                          setItems(updatedItems);
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
                          const updatedItems = items.map((i) =>
                            i.id === item.id
                              ? {
                                  ...i,
                                  length,
                                  volume:
                                    (i.height * i.width * length) / 1000000,
                                }
                              : i,
                          );
                          setItems(updatedItems);
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
                      onPress={() => {
                        const currentItem = items.find((i) => i.id === item.id);
                        if (currentItem) {
                          onUpdateItem(currentItem);
                        }
                        setIsEditing(null);
                      }}
                    >
                      <Text className="text-white font-semibold text-sm text-center">
                        Save
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
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
                    <View className="flex-row items-center">
                      <TouchableOpacity
                        className="bg-blue-50 p-4 rounded-full min-w-[48px] min-h-[48px] items-center justify-center mr-3"
                        onPress={() => setIsEditing(item.id)}
                      >
                        <Edit size={22} color="#3b82f6" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="bg-red-50 p-4 rounded-full min-w-[48px] min-h-[48px] items-center justify-center"
                        onPress={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 size={22} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
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
        <View className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-blue-700 font-medium text-sm mb-1">
                Total Estimated Volume
              </Text>
              <Text className="text-blue-900 font-bold text-2xl">
                {totalVolume} m³
              </Text>
            </View>
            <View className="bg-blue-200 p-3 rounded-full">
              <Package size={24} color="#1e40af" />
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
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-2xl p-4 shadow-lg max-h-[90%]">
              {/* Header */}
              <View className="items-center mb-4">
                <View className="w-10 h-1 bg-gray-300 rounded-full mb-3" />
                <Text className="text-xl font-bold text-gray-900 mb-1">
                  Add Item from Database
                </Text>
                <Text className="text-gray-500 text-center text-sm">
                  Search from our extensive items database
                </Text>
              </View>

              {/* Modern Search Input */}
              <View className="mb-4">
                <Text className="text-sm font-bold text-gray-800 mb-2">
                  Search Items Database
                </Text>
                <View className="relative">
                  <View className="flex-row items-center border-2 border-purple-200 rounded-xl bg-white shadow-sm">
                    <View className="pl-4">
                      <Search size={20} color="#8B5CF6" />
                    </View>
                    <TextInput
                      className="flex-1 p-4 text-base font-medium"
                      value={searchQuery}
                      onChangeText={handleSearchChange}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Type to search hundreds of items..."
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                      <TouchableOpacity
                        onPress={() => {
                          setSearchQuery("");
                          setShowSuggestions(false);
                        }}
                        className="pr-4"
                      >
                        <X size={20} color="#9CA3AF" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Search Stats */}
                  {searchQuery.length > 0 && (
                    <View className="mt-2 px-2">
                      <View className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <Text className="text-sm font-bold text-purple-800">
                          Found {filteredItems.length} items matching "
                          {searchQuery}"
                        </Text>
                        <Text className="text-xs text-purple-600 mt-1">
                          💡 Scroll down to see all available options
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>

              {/* Modern Search Results */}
              {filteredItems.length > 0 && (
                <View className="mb-4" style={{ maxHeight: 400 }}>
                  <ScrollView
                    className="bg-gray-50 rounded-xl p-2"
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                  >
                    {filteredItems.map((item, index) => {
                      const quantity = selectedItemQuantities[item.name] || 1;
                      const isPopular = (item.popularity_index || 0) > 50;
                      const dimensions = getItemDimensions(item);

                      return (
                        <View
                          key={`${item.id || item.name}-${index}`}
                          className="bg-white border border-gray-100 rounded-xl p-4 mb-2 shadow-sm"
                        >
                          <View className="flex-row justify-between items-start">
                            <View className="flex-1 mr-3">
                              <View className="flex-row items-center mb-1">
                                <Text className="font-bold text-gray-900 text-base flex-1">
                                  {item.name}
                                </Text>
                                {isPopular && (
                                  <View className="bg-yellow-100 px-2 py-1 rounded-full ml-2">
                                    <View className="flex-row items-center">
                                      <Star
                                        size={12}
                                        color="#F59E0B"
                                        fill="#F59E0B"
                                      />
                                      <Text className="text-yellow-700 text-xs font-semibold ml-1">
                                        Popular
                                      </Text>
                                    </View>
                                  </View>
                                )}
                              </View>

                              <View className="flex-row items-center mb-2">
                                <Text className="text-purple-600 text-sm font-medium">
                                  {dimensions.height} × {dimensions.width} ×{" "}
                                  {dimensions.length} cm
                                </Text>
                              </View>

                              <Text className="text-gray-500 text-sm">
                                Vol: {item.volume_m3 || 0} m³
                              </Text>
                            </View>

                            <View className="items-center">
                              <View className="flex-row items-center bg-gray-100 rounded-lg mb-3">
                                <TouchableOpacity
                                  className="p-4 min-w-[48px] min-h-[48px] items-center justify-center"
                                  onPress={() =>
                                    handleQuantityChange(item.name, -1)
                                  }
                                >
                                  <Minus size={20} color="#6B7280" />
                                </TouchableOpacity>
                                <Text className="mx-4 font-bold text-xl min-w-[32px] text-center">
                                  {quantity}
                                </Text>
                                <TouchableOpacity
                                  className="p-4 min-w-[48px] min-h-[48px] items-center justify-center"
                                  onPress={() =>
                                    handleQuantityChange(item.name, 1)
                                  }
                                >
                                  <Plus size={20} color="#6B7280" />
                                </TouchableOpacity>
                              </View>

                              <TouchableOpacity
                                className="bg-purple-500 px-6 py-4 rounded-lg shadow-sm min-w-[100px] min-h-[48px] items-center justify-center"
                                onPress={() => handleSelectItem(item)}
                              >
                                <Text className="text-white font-bold text-base">
                                  Add {quantity > 1 ? `(${quantity})` : ""}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              )}

              {/* No Results Message */}
              {searchQuery.length > 0 && filteredItems.length === 0 && (
                <View className="mb-4 p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <View className="items-center">
                    <Search size={32} color="#9CA3AF" />
                    <Text className="text-gray-500 font-medium mt-2 text-center">
                      No items found for "{searchQuery}"
                    </Text>
                    <Text className="text-gray-400 text-sm mt-1 text-center">
                      Try a different search term
                    </Text>
                  </View>
                </View>
              )}

              {/* Action Button */}
              <View className="mt-6">
                <TouchableOpacity
                  className="bg-gray-100 px-8 py-4 rounded-xl shadow-sm"
                  onPress={() => {
                    setShowAddModal(false);
                    setSearchQuery("");
                    setSelectedItemQuantities({});
                    setShowSuggestions(false);
                    setNewItem({ name: "", height: "", width: "", length: "" });
                    Keyboard.dismiss();
                  }}
                >
                  <Text className="text-gray-700 font-bold text-base text-center">
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default DetectedItemsList;
