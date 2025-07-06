import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Clock,
  Shield,
  Users,
  Package,
  MapPin,
  Bell,
  Smartphone,
  X,
  Info,
} from "lucide-react-native";
import { router } from "expo-router";

type PricingTier = {
  id: string;
  name: string;
  price: number;
  collectionDate: string;
  deliveryDate: string;
  deliveryTimescale: string;
  features: {
    name: string;
    included: boolean;
    value?: string;
    info?: string;
  }[];
  popular?: boolean;
};

export default function PricingTierScreen() {
  const [selectedTier, setSelectedTier] = useState<string>("eco-plus");
  const [expandedTier, setExpandedTier] = useState<string | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<{
    name: string;
    info: string;
  } | null>(null);

  const pricingTiers: PricingTier[] = [
    {
      id: "eco",
      name: "Tranzr Eco",
      price: 210.72,
      collectionDate: "5 Jul",
      deliveryDate: "8 Jul",
      deliveryTimescale: "5-7 working days",
      features: [
        { name: "State of the art service", included: true },
        { name: "Two men team", included: true },
        { name: "Careful protection", included: true },
        { name: "In time delivery", included: true },
        { name: "Level of service", included: true, value: "ground floor" },
        { name: "Damage cover", included: true, value: "up to £100" },
        { name: "Time slot", included: true, value: "4 hours" },
        { name: "Tracking (basic)", included: true },
        { name: "Time slot the day before", included: false },
        { name: "Real time tracking", included: false },
        { name: "SMS updates", included: false },
        { name: "1-2 stops away notifications", included: false },
      ],
    },
    {
      id: "eco-plus",
      name: "Tranzr Eco Plus",
      price: 228.96,
      collectionDate: "5 Jul",
      deliveryDate: "7 Jul",
      deliveryTimescale: "5-7 working days",
      popular: true,
      features: [
        { name: "State of the art service", included: true },
        { name: "Two men team", included: true },
        { name: "Careful protection", included: true },
        { name: "In time delivery", included: true },
        { name: "Level of service", included: true, value: "ground floor" },
        { name: "Damage cover", included: true, value: "up to £100" },
        { name: "Time slot", included: true, value: "4 hours" },
        { name: "Tracking (basic)", included: true },
        { name: "Time slot the day before", included: false },
        { name: "Real time tracking", included: false },
        { name: "SMS updates", included: false },
        { name: "1-2 stops away notifications", included: false },
      ],
    },
    {
      id: "standard",
      name: "Tranzr Standard",
      price: 249.22,
      collectionDate: "2 Jul",
      deliveryDate: "4 Jul",
      deliveryTimescale: "3-5 working days",
      features: [
        { name: "State of the art service", included: true },
        { name: "Two men team", included: true },
        { name: "Careful protection", included: true },
        { name: "In time delivery", included: true },
        { name: "Level of service", included: true, value: "ground floor" },
        { name: "Damage cover", included: true, value: "up to £150" },
        { name: "Time slot", included: true, value: "3 hours" },
        { name: "Tracking (basic)", included: true },
        { name: "Time slot the day before", included: true },
        { name: "Real time tracking", included: false },
        { name: "SMS updates", included: true },
        { name: "1-2 stops away notifications", included: false },
      ],
    },
    {
      id: "premium",
      name: "Tranzr Premium",
      price: 265.43,
      collectionDate: "2 Jul",
      deliveryDate: "3 Jul",
      deliveryTimescale: "2-3 working days",
      features: [
        { name: "State of the art service", included: true },
        { name: "Two men team", included: true },
        { name: "Careful protection", included: true },
        { name: "In time delivery", included: true },
        { name: "Level of service", included: true, value: "ground floor" },
        { name: "Damage cover", included: true, value: "up to £200" },
        { name: "Time slot", included: true, value: "2 hours" },
        { name: "Tracking (premium)", included: true },
        { name: "Time slot the day before", included: true },
        { name: "Real time tracking", included: true },
        { name: "SMS updates", included: true },
        { name: "1-2 stops away notifications", included: true },
      ],
    },
  ];

  const handleContinue = () => {
    const selectedTierData = pricingTiers.find(
      (tier) => tier.id === selectedTier,
    );
    console.log("Selected pricing tier:", selectedTierData);
    router.push("/summary");
  };

  const showFeatureInfo = (featureName: string, info: string) => {
    setSelectedFeature({ name: featureName, info });
    setShowInfoModal(true);
  };

  const renderFeature = (feature: any, tierColor: string) => {
    const hasInfo = feature.info;

    return (
      <View
        key={feature.name}
        className="flex-row items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
      >
        <View className="flex-row items-center flex-1">
          <Text className="text-sm text-gray-700 flex-1">{feature.name}</Text>
          {hasInfo && (
            <TouchableOpacity
              className="ml-2 p-1"
              onPress={() => showFeatureInfo(feature.name, feature.info)}
            >
              <Info size={14} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
        <View className="flex-row items-center">
          {feature.included ? (
            feature.value ? (
              <Text
                className={`text-sm font-medium ${tierColor === "red" ? "text-red-600" : "text-gray-700"}`}
              >
                {feature.value}
              </Text>
            ) : (
              <CheckCircle size={16} color="#10b981" />
            )
          ) : (
            <View className="w-4 h-4 rounded-full border-2 border-gray-300" />
          )}
        </View>
      </View>
    );
  };

  const renderTierCard = (tier: PricingTier) => {
    const isSelected = selectedTier === tier.id;
    const isExpanded = expandedTier === tier.id;
    const tierColor = tier.id === "premium" ? "red" : "gray";

    return (
      <View
        key={tier.id}
        className={`bg-white rounded-2xl mb-6 shadow-lg border-2 overflow-hidden ${
          isSelected ? "border-red-500 shadow-red-100" : "border-gray-100"
        }`}
      >
        {tier.popular && (
          <View className="bg-gradient-to-r from-red-500 to-red-600 px-4 py-3">
            <Text className="text-white font-bold text-center text-sm tracking-wide">
              ⭐ MOST POPULAR ⭐
            </Text>
          </View>
        )}

        <View className="p-6">
          {/* Header */}
          <View className="flex-row justify-between items-start mb-6">
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900 mb-3">
                {tier.name}
              </Text>
              <View className="bg-gray-50 rounded-xl p-4 mb-3">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm font-medium text-gray-600">
                    Collection
                  </Text>
                  <Text className="text-sm font-medium text-gray-600">
                    Delivery
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <View className="bg-orange-100 px-3 py-2 rounded-lg">
                    <Text className="text-sm font-bold text-orange-700">
                      {tier.collectionDate}
                    </Text>
                  </View>
                  <View className="flex-1 mx-3 h-px bg-gray-300" />
                  <View className="bg-green-100 px-3 py-2 rounded-lg">
                    <Text className="text-sm font-bold text-green-700">
                      {tier.deliveryDate}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="flex-row items-center">
                <Clock size={16} color="#6b7280" />
                <Text className="text-sm text-gray-600 ml-2">
                  {tier.deliveryTimescale}
                </Text>
              </View>
            </View>
            <View className="items-end ml-4">
              <View className="bg-red-50 rounded-2xl p-4 mb-3 items-center">
                <Text className="text-3xl font-bold text-red-600">
                  £{tier.price.toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity
                className={`px-8 py-3 rounded-full shadow-md ${
                  isSelected
                    ? "bg-red-600 shadow-red-200"
                    : "bg-red-500 shadow-red-100"
                }`}
                onPress={() => setSelectedTier(tier.id)}
              >
                <Text className="text-white font-bold text-sm">
                  {isSelected ? "Selected" : "Select"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* More Details Button */}
          <TouchableOpacity
            className="flex-row items-center justify-center py-3 mb-4 bg-blue-50 rounded-xl"
            onPress={() => setExpandedTier(isExpanded ? null : tier.id)}
          >
            <Text className="text-blue-700 font-semibold text-sm mr-2">
              {isExpanded ? "Hide details" : "View details"}
            </Text>
            <ChevronDown
              size={18}
              color="#1d4ed8"
              style={{
                transform: [{ rotate: isExpanded ? "180deg" : "0deg" }],
              }}
            />
          </TouchableOpacity>

          {/* Expanded Features */}
          {isExpanded && (
            <View className="border-t border-gray-200 pt-6">
              <Text className="text-lg font-bold text-gray-900 mb-4">
                🔧 Service Features
              </Text>
              <View className="bg-gray-50 rounded-xl p-4">
                {tier.features.map((feature) =>
                  renderFeature(feature, tierColor),
                )}
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#dc2626" />
      <View className="bg-red-600 pt-24 pb-6">
        <View className="px-4">
          <Text className="text-2xl font-bold text-white mb-1">
            Choose Your Service
          </Text>
          <Text className="text-sm text-red-200">
            Select the service level that best fits your needs
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {/* Service Info */}
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <View className="flex-row items-center mb-2">
              <Shield size={20} color="#2563eb" />
              <Text className="text-blue-900 font-semibold ml-2">
                Professional Moving Service
              </Text>
            </View>
            <Text className="text-blue-800 text-sm leading-relaxed">
              All tiers include professional movers, insurance coverage, and
              careful handling of your belongings. Choose based on your timeline
              and service preferences.
            </Text>
          </View>

          {/* Pricing Tiers */}
          {pricingTiers.map(renderTierCard)}

          {/* Summary */}
          <View className="bg-gray-50 border-l-4 border-gray-400 rounded-lg p-6 mb-8">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Your Selection
            </Text>
            {selectedTier && (
              <View className="space-y-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-base text-gray-600">Service:</Text>
                  <Text className="text-base font-semibold text-gray-900">
                    {pricingTiers.find((t) => t.id === selectedTier)?.name}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-base text-gray-600">Collection:</Text>
                  <Text className="text-base font-semibold text-gray-900">
                    {
                      pricingTiers.find((t) => t.id === selectedTier)
                        ?.collectionDate
                    }
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-base text-gray-600">Delivery:</Text>
                  <Text className="text-base font-semibold text-gray-900">
                    {
                      pricingTiers.find((t) => t.id === selectedTier)
                        ?.deliveryDate
                    }
                  </Text>
                </View>
                <View className="border-t border-gray-200 mt-4 pt-4">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-lg font-bold text-gray-900">
                      Total Price:
                    </Text>
                    <Text className="text-lg font-bold text-red-600">
                      £
                      {pricingTiers
                        .find((t) => t.id === selectedTier)
                        ?.price.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            className={`py-4 px-6 rounded-xl flex-row justify-center items-center shadow-lg ${
              selectedTier ? "bg-red-600" : "bg-gray-300"
            }`}
            onPress={handleContinue}
            disabled={!selectedTier}
          >
            <Text className="text-white text-center font-bold text-lg mr-2">
              Continue
            </Text>
            <ChevronRight size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View className="h-8" />

      {/* Feature Info Modal */}
      <Modal
        visible={showInfoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View className="flex-1 justify-center bg-black/70 px-6">
          <View className="bg-white rounded-2xl p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-900 flex-1">
                {selectedFeature?.name}
              </Text>
              <TouchableOpacity onPress={() => setShowInfoModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <Text className="text-base text-gray-600 leading-relaxed mb-6">
              {selectedFeature?.info}
            </Text>
            <TouchableOpacity
              className="bg-blue-600 py-3 px-6 rounded-xl"
              onPress={() => setShowInfoModal(false)}
            >
              <Text className="text-white font-semibold text-center">
                Got it
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
