import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { ShoppingCart } from "lucide-react-native";
import { useCart } from "../contexts/CartContext";
import InventoryCartModal from "./InventoryCartModal";

export default function HeaderCartButton() {
  const [showInventoryCartModal, setShowInventoryCartModal] = useState(false);
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowInventoryCartModal(true)}
        className="relative p-2"
        activeOpacity={0.7}
      >
        <ShoppingCart size={20} color="white" />
        {totalItems > 0 && (
          <View className="absolute -top-1 -right-1 bg-secondary-400 rounded-full min-w-[16px] h-4 items-center justify-center">
            <Text className="text-white text-xs font-bold">
              {totalItems > 99 ? "99+" : totalItems}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      
      <InventoryCartModal
        visible={showInventoryCartModal}
        onClose={() => setShowInventoryCartModal(false)}
      />
    </>
  );
} 