import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  ChevronRight,
  Package,
  Search,
  X,
  Plus,
  Minus,
  Star,
  Trash2,
  Edit,
} from "lucide-react-native";
import { router } from "expo-router";
import itemsData from "../Tranzr-Item-data-with-enrichment.json";

type Item = {
  id: string;
  name: string;
  height: number;
  width: number;
  length: number;
  volume: number;
  quantity: number;
};

export default function BuildInventoryScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItemQuantities, setSelectedItemQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [isEditing, setIsEditing] = useState<string | null>(null);

  // Helper function to get dimensions from item data
  const getItemDimensions = (item: any) => {
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
      return [];
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

  const handleQuantityChange = (itemName: string, change: number) => {
    setSelectedItemQuantities((prev) => ({
      ...prev,
      [itemName]: Math.max(1, (prev[itemName] || 1) + change),
    }));
  };

  const handleSelectItem = (selectedItem: any) => {
    const quantity = selectedItemQuantities[selectedItem.name] || 1;
    const dimensions = getItemDimensions(selectedItem);

    // Check if item already exists in inventory
    const existingItemIndex = items.findIndex(
      (item) => item.name === selectedItem.name,
    );

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += quantity;
      setItems(updatedItems);
    } else {
      // Add new item
      const newItemData: Item = {
        id: Date.now().toString(),
        name: selectedItem.name,
        height: dimensions.height,
        width: dimensions.width,
        length: dimensions.length,
        volume: selectedItem.volume_m3 || 0,
        quantity: quantity,
      };
      setItems([...items, newItemData]);
    }

    // Reset state
    setSearchQuery("");
    setSelectedItemQuantities({});
    Keyboard.dismiss();
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const handleUpdateDimensions = (
    id: string,
    field: "height" | "width" | "length",
    value: string,
  ) => {
    const numValue = parseFloat(value) || 0;
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: numValue };
          // Recalculate volume based on new dimensions
          const volume =
            (updatedItem.height * updatedItem.width * updatedItem.length) /
            1000000; // Convert cm³ to m³
          return { ...updatedItem, volume };
        }
        return item;
      }),
    );
  };

  const totalVolume = items
    .reduce((sum, item) => sum + item.volume * item.quantity, 0)
    .toFixed(2);

  const handleContinueToVanSelection = () => {
    console.log("Navigating to van-selection with inventory:", items);
    router.push("/van-selection");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#7080cc" />
      <View style={{ backgroundColor: "#7080cc" }} className="pt-24 pb-6">
        <View className="px-4">
          <Text className="text-2xl font-bold text-white mb-1">
            Build Your Inventory
          </Text>
          <Text className="text-sm text-white">
            Search and add items from our database
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-4 py-6">
            {/* Search Section */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-4">
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
                    onChangeText={setSearchQuery}
                    placeholder="Type to search hundreds of items..."
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setSearchQuery("")}
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

            {/* Search Results */}
            {filteredItems.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-bold text-gray-900 mb-4">
                  Search Results
                </Text>
                <ScrollView
                  className="bg-gray-50 rounded-xl p-2"
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                  style={{ maxHeight: 400 }}
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

            {/* Current Inventory */}
            {items.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-bold text-gray-900 mb-4">
                  Your Inventory ({items.length} items)
                </Text>
                <View className="space-y-4">
                  {items.map((item, index) => (
                    <View key={item.id} className="mb-3">
                      {isEditing === item.id ? (
                        <View className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <TextInput
                            className="border border-purple-300 rounded-lg p-3 mb-3 bg-white text-base font-medium"
                            value={item.name}
                            onChangeText={(text) => {
                              setItems(
                                items.map((i) =>
                                  i.id === item.id ? { ...i, name: text } : i,
                                ),
                              );
                            }}
                            placeholder="Item name"
                          />
                          <View className="mb-3">
                            <Text className="text-sm font-bold text-purple-700 mb-2">
                              Dimensions (cm):
                            </Text>
                            <View className="flex-row space-x-2">
                              <View className="flex-1">
                                <Text className="text-xs text-purple-600 mb-1">
                                  Height
                                </Text>
                                <TextInput
                                  className="border border-purple-300 rounded-lg px-3 py-2 text-center font-medium bg-white"
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
                                <Text className="text-xs text-purple-600 mb-1">
                                  Width
                                </Text>
                                <TextInput
                                  className="border border-purple-300 rounded-lg px-3 py-2 text-center font-medium bg-white"
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
                                <Text className="text-xs text-purple-600 mb-1">
                                  Length
                                </Text>
                                <TextInput
                                  className="border border-purple-300 rounded-lg px-3 py-2 text-center font-medium bg-white"
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
                          <Text className="text-purple-600 text-xs mb-4">
                            Volume: {item.volume.toFixed(3)} m³ each
                          </Text>
                          <View className="flex-row justify-between">
                            <TouchableOpacity
                              className="bg-gray-200 px-6 py-3 rounded-lg flex-1 mr-2"
                              onPress={() => setIsEditing(null)}
                            >
                              <Text className="font-semibold text-gray-700 text-sm text-center">
                                Cancel
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              className="bg-purple-600 px-6 py-3 rounded-lg flex-1 ml-2"
                              onPress={() => setIsEditing(null)}
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
                              <View className="bg-purple-100 p-1.5 rounded-full mr-3">
                                <Text className="text-purple-600 font-bold text-sm">
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
                                    handleUpdateQuantity(
                                      item.id,
                                      item.quantity - 1,
                                    )
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
                                    handleUpdateQuantity(
                                      item.id,
                                      item.quantity + 1,
                                    )
                                  }
                                >
                                  <Plus size={16} color="#6B7280" />
                                </TouchableOpacity>
                              </View>
                              <TouchableOpacity
                                className="bg-purple-50 p-3 rounded-full mr-2"
                                onPress={() => setIsEditing(item.id)}
                              >
                                <Edit size={18} color="#8B5CF6" />
                              </TouchableOpacity>
                              <TouchableOpacity
                                className="bg-red-50 p-3 rounded-full"
                                onPress={() => handleRemoveItem(item.id)}
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
              </View>
            )}

            {/* Total Volume Summary */}
            {items.length > 0 && (
              <View className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg mb-6">
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-purple-700 font-medium text-sm mb-1">
                      Total Estimated Volume
                    </Text>
                    <Text className="text-purple-900 font-bold text-2xl">
                      {totalVolume} m³
                    </Text>
                    <Text className="text-purple-600 text-xs mt-1">
                      Based on{" "}
                      {items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                      items
                    </Text>
                  </View>
                  <View className="bg-purple-200 p-3 rounded-full">
                    <Package size={24} color="#7c3aed" />
                  </View>
                </View>
              </View>
            )}

            {/* Continue Button */}
            {items.length > 0 && (
              <TouchableOpacity
                className="py-4 px-6 rounded-xl flex-row justify-center items-center shadow-lg"
                style={{ backgroundColor: "#70AECC" }}
                onPress={handleContinueToVanSelection}
              >
                <Text className="text-white text-center font-semibold text-lg mr-2">
                  Continue
                </Text>
                <ChevronRight size={20} color="white" />
              </TouchableOpacity>
            )}

            {/* Empty State */}
            {items.length === 0 && (
              <View className="bg-gray-50 p-8 rounded-xl border-2 border-dashed border-gray-200">
                <View className="items-center">
                  <Package size={48} color="#9CA3AF" />
                  <Text className="text-gray-500 font-medium mt-4 text-center text-lg">
                    Start Building Your Inventory
                  </Text>
                  <Text className="text-gray-400 text-sm mt-2 text-center">
                    Search for items above to add them to your inventory
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View className="h-8" />
    </SafeAreaView>
  );
}
