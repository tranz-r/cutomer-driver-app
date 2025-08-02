import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Menu } from "lucide-react-native";
import SlideOutMenu from "./SlideOutMenu";

export default function HeaderMenuOnly() {
  const [showSlideOutMenu, setShowSlideOutMenu] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowSlideOutMenu(true)}
        className="bg-white/20 p-2 rounded-full"
        activeOpacity={0.7}
      >
        <Menu size={20} color="white" />
      </TouchableOpacity>
      
      <SlideOutMenu
        visible={showSlideOutMenu}
        onClose={() => setShowSlideOutMenu(false)}
      />
    </>
  );
} 