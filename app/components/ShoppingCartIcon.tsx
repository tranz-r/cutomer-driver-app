import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ShoppingCart } from "lucide-react-native";
import { useCart } from "../contexts/CartContext";

type ShoppingCartIconProps = {
  onPress: () => void;
  color?: string;
};

const ShoppingCartIcon = ({
  onPress,
  color = "white",
}: ShoppingCartIconProps) => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="relative p-2"
      activeOpacity={0.7}
    >
      <ShoppingCart size={24} color={color} />
      {totalItems > 0 && (
        <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[20px] h-5 items-center justify-center">
          <Text className="text-white text-xs font-bold">
            {totalItems > 99 ? "99+" : totalItems}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ShoppingCartIcon;
