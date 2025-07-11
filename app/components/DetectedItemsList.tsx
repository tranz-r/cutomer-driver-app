import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Plus, Package, ShoppingCart } from "lucide-react-native";
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
  onAddToCart?: (item: Omit<Item, "id">) => void;
  autoAddToCart?: boolean;
};

import { useCart } from "../contexts/CartContext";
import { router } from "expo-router";

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
  onAddToCart = () => {},
  autoAddToCart = false,
}: DetectedItemsListProps) => {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showCartAnimation, setShowCartAnimation] = useState(false);
  const [addedItemsCount, setAddedItemsCount] = useState(0);
  const cartAnimationScale = useRef(new Animated.Value(1)).current;
  const cartAnimationOpacity = useRef(new Animated.Value(0)).current;
  const { getTotalItems } = useCart();

  // Auto-add items to cart when component becomes visible and autoAddToCart is enabled
  useEffect(() => {
    if (isVisible && autoAddToCart && items.length > 0) {
      const timer = setTimeout(() => {
        handleAutoAddToCart();
      }, 1000); // Delay to allow the detection animation to complete

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoAddToCart, items.length]);

  const handleAutoAddToCart = () => {
    const initialCartCount = getTotalItems();
    items.forEach((item, index) => {
      setTimeout(() => {
        onAddToCart({
          name: item.name,
          height: item.height,
          width: item.width,
          length: item.length,
          volume: item.volume,
        });

        // Update count to show current cart total
        const currentCartTotal = initialCartCount + index + 1;
        setAddedItemsCount(currentCartTotal);

        // Trigger animation for each item added
        triggerCartAnimation();

        // Show completion message after all items are added
        if (index === items.length - 1) {
          setTimeout(() => {
            setShowCartAnimation(true);
            setTimeout(() => setShowCartAnimation(false), 3000);
          }, 500);
        }
      }, index * 300); // Stagger the additions
    });
  };

  const triggerCartAnimation = () => {
    // Scale animation
    Animated.sequence([
      Animated.timing(cartAnimationScale, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cartAnimationScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Opacity animation for the notification
    Animated.sequence([
      Animated.timing(cartAnimationOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(cartAnimationOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  if (!isVisible) return null;

  const totalVolume = items
    .reduce((sum, item) => sum + item.volume, 0)
    .toFixed(2);

  const handleAddCustomItem = () => {
    router.push("/build-inventory");
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
      {/* Cart Animation Notification */}
      {showCartAnimation && (
        <Animated.View
          className="absolute top-2 right-2 bg-green-500 px-3 py-2 rounded-full z-10 flex-row items-center"
          style={{
            opacity: cartAnimationOpacity,
            transform: [{ scale: cartAnimationScale }],
          }}
        >
          <ShoppingCart size={16} color="white" />
          <Text className="text-white font-bold text-sm ml-2">
            {items.length} items added to cart!
          </Text>
        </Animated.View>
      )}

      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <Animated.View
            className="bg-blue-100 p-2 rounded-full mr-3"
            style={{ transform: [{ scale: cartAnimationScale }] }}
          >
            <Package size={20} color="#3b82f6" />
          </Animated.View>
          <View>
            <Text className="text-xl font-bold text-gray-900">
              Detected Items
            </Text>
            <Text className="text-xs text-gray-500">
              {autoAddToCart
                ? "Auto-adding to cart..."
                : "AI-powered item recognition"}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setIsExpanded(!isExpanded)}
          className="bg-blue-50 px-3 py-1 rounded-lg"
        >
          <Text className="text-blue-700 font-semibold text-sm">
            {isExpanded ? "Hide" : "Show Details"}
          </Text>
        </TouchableOpacity>
      </View>

      {isExpanded && (
        <View className="mb-4">
          {/* Detection Summary */}
          <View className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="bg-green-100 p-2 rounded-full mr-3">
                  <ShoppingCart size={20} color="#16a34a" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-lg text-green-900">
                    {items.length} Items Detected & Added
                  </Text>
                  <Text className="text-green-700 text-sm">
                    All detected items have been automatically added to your
                    cart
                  </Text>
                  <Text className="text-green-600 text-xs mt-1">
                    Total Volume: {totalVolume} m³
                  </Text>
                </View>
              </View>
              <View className="bg-green-200 p-2 rounded-full">
                <Text className="text-green-800 font-bold text-lg">✓</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <View className="mt-4 pt-4 border-t border-gray-200">
        {/* Add Custom Item Button */}
        <TouchableOpacity
          className="bg-purple-500 p-3 rounded-xl shadow-sm"
          onPress={handleAddCustomItem}
        >
          <View className="flex-row items-center justify-center">
            <Plus size={18} color="white" />
            <Text className="text-white font-bold text-base ml-2">
              Add Custom Item
            </Text>
          </View>
        </TouchableOpacity>

        <Text className="text-gray-500 text-xs text-center mt-2">
          Didn't detect something? Add it manually above
        </Text>
      </View>
    </View>
  );
};

export default DetectedItemsList;
