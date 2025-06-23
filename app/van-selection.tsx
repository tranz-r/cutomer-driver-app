import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  Image,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ChevronRight, Truck, Users, X, Package } from "lucide-react-native";
import { router } from "expo-router";

type VanType = {
  id: string;
  name: string;
  capacity: string;
  dimensions: string;
  price: string;
  description: string;
};

type DriverOption = {
  id: string;
  count: number;
  description: string;
  additionalCost: string;
};

export default function VanSelectionScreen() {
  const [selectedVan, setSelectedVan] = useState<string | null>("large");
  const [selectedDrivers, setSelectedDrivers] = useState<string>("1");
  const [showVanModal, setShowVanModal] = useState(false);
  const [selectedVanDetails, setSelectedVanDetails] = useState<VanType | null>(
    null,
  );
  const [lastTap, setLastTap] = useState<number>(0);

  const vanTypes: VanType[] = [
    {
      id: "small",
      name: "Small Van",
      capacity: "Up to 10m³",
      dimensions: "3.5m × 1.7m × 1.8m",
      price: "£45/hour",
      description: "Perfect for studio apartments or small moves",
    },
    {
      id: "medium",
      name: "Medium Van",
      capacity: "Up to 20m³",
      dimensions: "4.2m × 1.8m × 1.9m",
      price: "£65/hour",
      description: "Ideal for 1-2 bedroom apartments",
    },
    {
      id: "large",
      name: "3.5 Luton Van with Tail Lift",
      capacity: "Up to 35m³",
      dimensions: "5.5m × 2.1m × 2.2m",
      price: "£85/hour",
      description:
        "Professional 3.5 tonne Luton van with hydraulic tail lift - perfect for 3-4 bedroom houses",
    },
    {
      id: "xlarge",
      name: "Extra Large Van",
      capacity: "Up to 50m³",
      dimensions: "6.2m × 2.4m × 2.5m",
      price: "£110/hour",
      description: "Perfect for large houses or offices",
    },
  ];

  const driverOptions: DriverOption[] = [
    {
      id: "1",
      count: 1,
      description: "Driver only - you help with loading",
      additionalCost: "Included",
    },
    {
      id: "2",
      count: 2,
      description: "Driver + 1 helper for loading/unloading",
      additionalCost: "+£25/hour",
    },
    {
      id: "3",
      count: 3,
      description: "Driver + 2 helpers for heavy items",
      additionalCost: "+£45/hour",
    },
  ];

  const handleVanTap = (van: VanType) => {
    if (van.id !== "large") return;

    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (lastTap && now - lastTap < DOUBLE_TAP_DELAY) {
      // Double tap detected - set the van details and show modal
      setSelectedVanDetails(van);
      setShowVanModal(true);
    } else {
      // Single tap
      setSelectedVan(van.id);
    }
    setLastTap(now);
  };

  const handleContinueToLocation = () => {
    if (!selectedVan) return;
    // Navigate to origin-destination with selected options
    console.log("Selected van:", selectedVan);
    console.log("Selected drivers:", selectedDrivers);
    router.push("/origin-destination");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#ea580c" />
      <View className="bg-orange-600 pt-24 pb-6">
        <View className="px-6">
          <Text className="text-2xl font-bold text-white mb-1">
            Select Van & Crew
          </Text>
          <Text className="text-sm text-orange-200">
            Choose the right van size and crew for your move.
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-6">
          {/* Van Selection */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Choose Van Type
            </Text>
            <View className="space-y-3">
              {vanTypes.map((van) => (
                <TouchableOpacity
                  key={van.id}
                  className={`rounded-xl p-5 shadow-sm border-2 ${
                    selectedVan === van.id
                      ? "border-blue-500 bg-blue-50"
                      : van.id === "large"
                        ? "border-gray-200 bg-white"
                        : "border-gray-100 bg-gray-50"
                  } ${van.id !== "large" ? "opacity-50" : ""}`}
                  onPress={() => handleVanTap(van)}
                  disabled={van.id !== "large"}
                  style={{ marginBottom: 12 }}
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-row items-start flex-1">
                      <View
                        className={`p-3 rounded-xl mr-4 ${
                          van.id === "large" ? "bg-blue-100" : "bg-gray-200"
                        }`}
                      >
                        <Truck
                          size={24}
                          color={van.id === "large" ? "#3b82f6" : "#9ca3af"}
                        />
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center mb-1">
                          <Text
                            className={`text-lg font-bold ${
                              van.id === "large"
                                ? "text-gray-900"
                                : "text-gray-400"
                            }`}
                          >
                            {van.name}
                          </Text>
                        </View>
                        <Text
                          className={`text-base font-medium mb-2 ${
                            van.id === "large"
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                        >
                          {van.capacity}
                        </Text>
                        <Text
                          className={`text-sm mb-1 ${
                            van.id === "large"
                              ? "text-gray-500"
                              : "text-gray-400"
                          }`}
                        >
                          Dimensions: {van.dimensions}
                        </Text>
                        <Text
                          className={`text-sm mb-3 ${
                            van.id === "large"
                              ? "text-gray-600"
                              : "text-gray-400"
                          }`}
                        >
                          {van.description}
                        </Text>

                        {/* Status and action info moved to bottom */}
                        <View className="flex-row items-center justify-between">
                          {van.id === "large" ? (
                            <View className="bg-green-100 px-3 py-1 rounded-full">
                              <Text className="text-green-600 text-xs font-semibold">
                                Available
                              </Text>
                            </View>
                          ) : (
                            <View className="bg-red-100 px-3 py-1 rounded-full">
                              <Text className="text-red-600 text-xs font-semibold">
                                Unavailable
                              </Text>
                            </View>
                          )}

                          {van.id === "large" && (
                            <View className="bg-blue-100 px-3 py-1 rounded-full">
                              <Text className="text-blue-600 text-xs font-semibold">
                                Double-tap for details
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                    <View className="ml-4">
                      <Text
                        className={`text-xl font-bold ${
                          van.id === "large" ? "text-blue-600" : "text-gray-400"
                        }`}
                      >
                        {van.price}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Driver Selection */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Choose Crew Size
            </Text>
            <View className="space-y-3">
              {driverOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  className={`rounded-xl p-5 shadow-sm border-2 ${
                    selectedDrivers === option.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                  onPress={() => setSelectedDrivers(option.id)}
                  style={{ marginBottom: 12 }}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <View className="bg-green-100 p-3 rounded-xl mr-4">
                        <Users size={24} color="#10b981" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-900 mb-1">
                          {option.count} Person{option.count > 1 ? "s" : ""}
                        </Text>
                        <Text className="text-sm text-gray-600 leading-relaxed">
                          {option.description}
                        </Text>
                      </View>
                    </View>
                    <View className="ml-4">
                      <Text className="text-base font-bold text-green-600">
                        {option.additionalCost}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Summary */}
          {selectedVan && (
            <View className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <Text className="text-xl font-bold text-gray-900 mb-4">
                Your Selection
              </Text>
              <View className="space-y-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-base text-gray-600">Van:</Text>
                  <Text className="text-base font-semibold text-gray-900">
                    {vanTypes.find((v) => v.id === selectedVan)?.name}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-base text-gray-600">Crew:</Text>
                  <Text className="text-base font-semibold text-gray-900">
                    {driverOptions.find((d) => d.id === selectedDrivers)?.count}{" "}
                    person{selectedDrivers !== "1" ? "s" : ""}
                  </Text>
                </View>
                <View className="border-t border-blue-200 mt-4 pt-4">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-lg font-bold text-gray-900">
                      Estimated Rate:
                    </Text>
                    <Text className="text-lg font-bold text-blue-600">
                      {vanTypes.find((v) => v.id === selectedVan)?.price}
                      {selectedDrivers !== "1" &&
                        ` ${driverOptions.find((d) => d.id === selectedDrivers)?.additionalCost}`}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity
            className={`py-5 px-8 rounded-2xl flex-row justify-center items-center shadow-lg ${
              selectedVan ? "bg-blue-600" : "bg-gray-300"
            }`}
            onPress={handleContinueToLocation}
            disabled={!selectedVan}
          >
            <Text className="text-white text-center font-bold text-lg mr-3">
              Continue to Origin & Destination
            </Text>
            <ChevronRight size={22} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View className="h-8" />

      {/* Van Details Modal */}
      <Modal
        visible={showVanModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowVanModal(false)}
      >
        <View className="flex-1 justify-end bg-black/70">
          <View className="bg-white rounded-t-2xl flex-1 mt-20">
            <View className="flex-row justify-between items-center p-6 pb-4 border-b border-gray-200">
              <Text className="text-2xl font-bold text-gray-900">
                {selectedVanDetails?.name || "3.5 Luton Van with Tail Lift"}
              </Text>
              <TouchableOpacity
                onPress={() => setShowVanModal(false)}
                className="p-2 rounded-full bg-gray-100"
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              className="flex-1 px-6"
            >
              {/* Van Image Gallery */}
              <View className="mb-6">
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-4"
                >
                  <View className="flex-row space-x-3">
                    <Image
                      source={{
                        uri: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
                      }}
                      className="w-80 h-48 rounded-xl"
                      resizeMode="cover"
                    />
                    <Image
                      source={{
                        uri: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80",
                      }}
                      className="w-80 h-48 rounded-xl"
                      resizeMode="cover"
                    />
                    <Image
                      source={{
                        uri: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=600&q=80",
                      }}
                      className="w-80 h-48 rounded-xl"
                      resizeMode="cover"
                    />
                    <Image
                      source={{
                        uri: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80",
                      }}
                      className="w-80 h-48 rounded-xl"
                      resizeMode="cover"
                    />
                    <Image
                      source={{
                        uri: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80",
                      }}
                      className="w-80 h-48 rounded-xl"
                      resizeMode="cover"
                    />
                    <Image
                      source={{
                        uri: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&q=80",
                      }}
                      className="w-80 h-48 rounded-xl"
                      resizeMode="cover"
                    />
                  </View>
                </ScrollView>
                <Text className="text-center text-gray-500 text-sm">
                  Swipe to see more photos
                </Text>
              </View>

              <View className="py-4">
                <View className="space-y-8">
                  {/* About This Van */}
                  <View className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 mb-2">
                    <Text className="text-blue-900 font-bold text-xl mb-3">
                      About This Van
                    </Text>
                    <Text className="text-blue-800 text-base leading-relaxed">
                      {selectedVanDetails?.description ||
                        "Professional 3.5 tonne Luton van with hydraulic tail lift - perfect for 3-4 bedroom houses"}
                      . This professional Luton van features a spacious cargo
                      area with hydraulic tail lift for effortless loading.
                      Perfect for house moves with our experienced crew.
                    </Text>
                  </View>

                  {/* Key Specifications Grid */}
                  <View className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
                    <Text className="text-gray-900 font-bold text-xl mb-6">
                      Key Specifications
                    </Text>
                    <View className="flex-row flex-wrap gap-3">
                      <View className="bg-blue-50 p-4 rounded-xl flex-1 min-w-[140px] mb-3">
                        <View className="items-center mb-2">
                          <Package size={24} color="#3b82f6" />
                          <Text className="text-blue-700 text-xs font-medium mt-1 text-center">
                            Load Capacity
                          </Text>
                        </View>
                        <Text className="text-blue-900 font-bold text-base text-center">
                          {selectedVanDetails?.capacity || "Up to 35m³"}
                        </Text>
                      </View>

                      <View className="bg-green-50 p-4 rounded-xl flex-1 min-w-[140px] mb-3">
                        <View className="items-center mb-2">
                          <Truck size={24} color="#10b981" />
                          <Text className="text-green-700 text-xs font-medium mt-1 text-center">
                            Internal Dimensions
                          </Text>
                        </View>
                        <Text className="text-green-900 font-bold text-base text-center">
                          {selectedVanDetails?.dimensions ||
                            "5.5m × 2.1m × 2.2m"}
                        </Text>
                      </View>

                      <View className="bg-yellow-50 p-4 rounded-xl flex-1 min-w-[140px] mb-3">
                        <View className="items-center mb-2">
                          <Text className="text-yellow-600 font-bold text-xl">
                            ⚖️
                          </Text>
                          <Text className="text-yellow-700 text-xs font-medium mt-1 text-center">
                            Max Gross Weight
                          </Text>
                        </View>
                        <Text className="text-yellow-900 font-bold text-base text-center">
                          3.5 Tonnes
                        </Text>
                      </View>

                      <View className="bg-purple-50 p-4 rounded-xl flex-1 min-w-[140px] mb-3">
                        <View className="items-center mb-2">
                          <Text className="text-purple-600 font-bold text-xl">
                            🔧
                          </Text>
                          <Text className="text-purple-700 text-xs font-medium mt-1 text-center">
                            Tail Lift Capacity
                          </Text>
                        </View>
                        <Text className="text-purple-900 font-bold text-base text-center">
                          500kg
                        </Text>
                      </View>

                      <View className="bg-red-50 p-4 rounded-xl flex-1 min-w-[140px] mb-3">
                        <View className="items-center mb-2">
                          <Text className="text-red-600 font-bold text-xl">
                            ⛽
                          </Text>
                          <Text className="text-red-700 text-xs font-medium mt-1 text-center">
                            Emission Standard
                          </Text>
                        </View>
                        <Text className="text-red-900 font-bold text-base text-center">
                          Euro 6
                        </Text>
                      </View>

                      <View className="bg-indigo-50 p-4 rounded-xl flex-1 min-w-[140px] mb-3">
                        <View className="items-center mb-2">
                          <Text className="text-indigo-600 font-bold text-xl">
                            🚪
                          </Text>
                          <Text className="text-indigo-700 text-xs font-medium mt-1 text-center">
                            Loading Height
                          </Text>
                        </View>
                        <Text className="text-indigo-900 font-bold text-base text-center">
                          2.1m
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Tail Lift Feature */}
                  <View className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-200 mb-2">
                    <View className="flex-row items-center mb-3">
                      <View className="bg-orange-100 p-3 rounded-full mr-4">
                        <Text className="text-orange-600 font-bold text-lg">
                          ⬆️
                        </Text>
                      </View>
                      <Text className="text-orange-900 font-bold text-xl">
                        Hydraulic Tail Lift
                      </Text>
                    </View>
                    <Text className="text-orange-800 text-base leading-relaxed mb-3">
                      Our Luton van comes equipped with a powerful hydraulic
                      tail lift that can handle up to 500kg, making loading and
                      unloading heavy furniture effortless.
                    </Text>
                    <View className="bg-orange-100 p-3 rounded-xl">
                      <Text className="text-orange-700 text-sm font-medium">
                        ✓ No manual lifting of heavy items
                        {"\n"}✓ Reduces risk of damage
                        {"\n"}✓ Faster loading/unloading
                        {"\n"}✓ Professional equipment included
                      </Text>
                    </View>
                  </View>

                  {/* Premium Features */}
                  <View className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200 mb-2">
                    <Text className="text-purple-900 font-bold text-xl mb-4">
                      Premium Features Included
                    </Text>
                    <View className="space-y-3">
                      <View className="flex-row items-center">
                        <View className="bg-purple-100 p-2 rounded-full mr-3">
                          <Text className="text-purple-600">🛡️</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-purple-900 font-semibold">
                            Professional Moving Blankets
                          </Text>
                          <Text className="text-purple-700 text-sm">
                            Protect your furniture during transport
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row items-center">
                        <View className="bg-purple-100 p-2 rounded-full mr-3">
                          <Text className="text-purple-600">🔒</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-purple-900 font-semibold">
                            Secure Tie-Down System
                          </Text>
                          <Text className="text-purple-700 text-sm">
                            Multiple anchor points for safe transport
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row items-center">
                        <View className="bg-purple-100 p-2 rounded-full mr-3">
                          <Text className="text-purple-600">📍</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-purple-900 font-semibold">
                            Real-Time GPS Tracking
                          </Text>
                          <Text className="text-purple-700 text-sm">
                            Track your belongings throughout the move
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row items-center">
                        <View className="bg-purple-100 p-2 rounded-full mr-3">
                          <Text className="text-purple-600">🛡️</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-purple-900 font-semibold">
                            Fully Insured & Licensed
                          </Text>
                          <Text className="text-purple-700 text-sm">
                            Complete peace of mind coverage
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* What Can Fit */}
                  <View className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200 mb-2">
                    <Text className="text-emerald-900 font-bold text-xl mb-4">
                      Perfect For Your Move
                    </Text>
                    <View className="space-y-4">
                      <View>
                        <Text className="text-emerald-800 font-semibold text-lg mb-2">
                          Typical 3-4 Bedroom House:
                        </Text>
                        <Text className="text-emerald-700 text-base leading-relaxed">
                          • Living room: 3-seater sofa, armchairs, coffee table,
                          TV unit
                          {"\n"}• Dining room: 6-seater table, chairs, sideboard
                          {"\n"}• Bedrooms: Double beds, wardrobes, chest of
                          drawers
                          {"\n"}• Kitchen: Appliances, dining sets, cookware
                          {"\n"}• Storage: 40-60 moving boxes, miscellaneous
                          items
                        </Text>
                      </View>

                      <View>
                        <Text className="text-emerald-800 font-semibold text-lg mb-2">
                          Large Items That Fit Easily:
                        </Text>
                        <Text className="text-emerald-700 text-base leading-relaxed">
                          • King size beds and mattresses
                          {"\n"}• Large wardrobes (up to 2m wide)
                          {"\n"}• Washing machines & refrigerators
                          {"\n"}• Dining tables (8+ seaters)
                          {"\n"}• Piano or large musical instruments
                          {"\n"}• Exercise equipment & gym sets
                        </Text>
                      </View>

                      <View className="bg-emerald-100 p-4 rounded-xl">
                        <Text className="text-emerald-800 font-semibold text-base">
                          💡 Pro Tip: Our experienced team will maximize space
                          efficiency and ensure everything fits securely!
                        </Text>
                      </View>

                      <View className="bg-teal-100 p-4 rounded-xl">
                        <Text className="text-teal-800 font-semibold text-base mb-2">
                          📦 Volume Calculator:
                        </Text>
                        <Text className="text-teal-700 text-sm">
                          • 1-2 bedroom flat: 15-25m³
                          {"\n"}• 3 bedroom house: 25-35m³
                          {"\n"}• 4+ bedroom house: 35m³+
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Safety & Compliance */}
                  <View className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-200 mb-2">
                    <Text className="text-red-900 font-bold text-xl mb-4">
                      Safety & Compliance
                    </Text>
                    <View className="space-y-3">
                      <View className="flex-row items-center">
                        <View className="bg-red-100 p-2 rounded-full mr-3">
                          <Text className="text-red-600">🛡️</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-red-900 font-semibold">
                            Fully Licensed & Insured
                          </Text>
                          <Text className="text-red-700 text-sm">
                            £2M public liability insurance included
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row items-center">
                        <View className="bg-red-100 p-2 rounded-full mr-3">
                          <Text className="text-red-600">✅</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-red-900 font-semibold">
                            Regular Safety Inspections
                          </Text>
                          <Text className="text-red-700 text-sm">
                            MOT tested & serviced every 6 weeks
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row items-center">
                        <View className="bg-red-100 p-2 rounded-full mr-3">
                          <Text className="text-red-600">👨‍💼</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-red-900 font-semibold">
                            Professional Drivers
                          </Text>
                          <Text className="text-red-700 text-sm">
                            CPC qualified with clean driving records
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row items-center">
                        <View className="bg-red-100 p-2 rounded-full mr-3">
                          <Text className="text-red-600">🔒</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-red-900 font-semibold">
                            Secure Loading System
                          </Text>
                          <Text className="text-red-700 text-sm">
                            Professional tie-down points & load bars
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Environmental Impact */}
                  <View className="bg-gradient-to-r from-green-50 to-lime-50 p-6 rounded-2xl border border-green-200 mb-2">
                    <Text className="text-green-900 font-bold text-xl mb-4">
                      Environmental Commitment
                    </Text>
                    <View className="space-y-3">
                      <View className="flex-row items-center">
                        <View className="bg-green-100 p-2 rounded-full mr-3">
                          <Text className="text-green-600">🌱</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-green-900 font-semibold">
                            Euro 6 Low Emission Engine
                          </Text>
                          <Text className="text-green-700 text-sm">
                            Meets latest environmental standards
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row items-center">
                        <View className="bg-green-100 p-2 rounded-full mr-3">
                          <Text className="text-green-600">♻️</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-green-900 font-semibold">
                            Eco-Friendly Operations
                          </Text>
                          <Text className="text-green-700 text-sm">
                            Optimized routes to reduce carbon footprint
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row items-center">
                        <View className="bg-green-100 p-2 rounded-full mr-3">
                          <Text className="text-green-600">🌍</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-green-900 font-semibold">
                            Carbon Offset Program
                          </Text>
                          <Text className="text-green-700 text-sm">
                            We offset 100% of emissions from your move
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Pricing Breakdown */}
                  <View className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-2xl border border-gray-200 mb-2">
                    <Text className="text-gray-900 font-bold text-xl mb-4">
                      Transparent Pricing
                    </Text>
                    <View className="space-y-3">
                      <View className="flex-row justify-between items-center">
                        <Text className="text-gray-700 text-base">
                          Van hire (per hour)
                        </Text>
                        <Text className="text-gray-900 font-bold text-lg">
                          {selectedVanDetails?.price || "£85/hour"}
                        </Text>
                      </View>
                      <View className="flex-row justify-between items-center">
                        <Text className="text-gray-700 text-base">
                          Fuel & insurance
                        </Text>
                        <Text className="text-green-600 font-semibold">
                          Included
                        </Text>
                      </View>
                      <View className="flex-row justify-between items-center">
                        <Text className="text-gray-700 text-base">
                          Professional equipment
                        </Text>
                        <Text className="text-green-600 font-semibold">
                          Included
                        </Text>
                      </View>
                      <View className="flex-row justify-between items-center">
                        <Text className="text-gray-700 text-base">
                          Tail lift operation
                        </Text>
                        <Text className="text-green-600 font-semibold">
                          Included
                        </Text>
                      </View>
                      <View className="flex-row justify-between items-center">
                        <Text className="text-gray-700 text-base">
                          Moving blankets & straps
                        </Text>
                        <Text className="text-green-600 font-semibold">
                          Included
                        </Text>
                      </View>
                      <View className="border-t border-gray-300 pt-3">
                        <Text className="text-gray-600 text-sm text-center">
                          No hidden fees • Pay only for time used • Minimum 2
                          hours
                        </Text>
                      </View>
                      <View className="bg-blue-100 p-3 rounded-xl">
                        <Text className="text-blue-800 font-semibold text-sm text-center">
                          💰 Average move cost: £170-£340 (2-4 hours)
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View className="p-6 pt-4 border-t border-gray-200 bg-white">
              <TouchableOpacity
                className="bg-blue-600 py-4 px-6 rounded-xl"
                onPress={() => {
                  setShowVanModal(false);
                  if (selectedVanDetails) {
                    setSelectedVan(selectedVanDetails.id);
                  }
                }}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  Select This Van
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
