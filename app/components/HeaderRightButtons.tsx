import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { ShoppingCart, Menu } from "lucide-react-native";
import { useCart } from "../contexts/CartContext";
import InventoryCartModal from "./InventoryCartModal";
import SlideOutMenu from "./SlideOutMenu";

export default function HeaderRightButtons() {
  const [showInventoryCartModal, setShowInventoryCartModal] = useState(false);
  const [showSlideOutMenu, setShowSlideOutMenu] = useState(false);
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <>
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => setShowInventoryCartModal(true)}
          className="relative p-2"
          activeOpacity={0.7}
        >
          <ShoppingCart size={20} color="white" />
          {totalItems > 0 && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[16px] h-4 items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {totalItems > 99 ? "99+" : totalItems}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setShowSlideOutMenu(true)}
          className="bg-white/20 p-2 rounded-full ml-2"
          activeOpacity={0.7}
        >
          <Menu size={20} color="white" />
        </TouchableOpacity>
      </View>
      
      <InventoryCartModal
        visible={showInventoryCartModal}
        onClose={() => setShowInventoryCartModal(false)}
      />
      
      <SlideOutMenu
        visible={showSlideOutMenu}
        onClose={() => setShowSlideOutMenu(false)}
      />
    </>
  );
} 