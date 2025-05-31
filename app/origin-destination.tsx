import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  ChevronRight,
  MapPin,
  Navigation,
  AlertCircle,
} from "lucide-react-native";
import { router } from "expo-router";

type FloorOption = {
  value: string;
  label: string;
};

export default function OriginDestinationScreen() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [originFloor, setOriginFloor] = useState("ground");
  const [destinationFloor, setDestinationFloor] = useState("ground");
  const [originElevator, setOriginElevator] = useState(true);
  const [destinationElevator, setDestinationElevator] = useState(true);
  const [showOriginFloors, setShowOriginFloors] = useState(false);
  const [showDestinationFloors, setShowDestinationFloors] = useState(false);
  const [distance, setDistance] = useState("12.5 miles");
  const [showMap, setShowMap] = useState(false);

  const floorOptions: FloorOption[] = [
    { value: "ground", label: "Ground Floor" },
    { value: "1", label: "1st Floor" },
    { value: "2", label: "2nd Floor" },
    { value: "3", label: "3rd Floor" },
    { value: "4", label: "4th Floor" },
    { value: "5", label: "5th Floor" },
    { value: "6+", label: "6th Floor or Higher" },
  ];

  const calculateExtraCost = () => {
    let extraCost = 0;

    // Origin extra cost
    if (!originElevator && originFloor !== "ground" && originFloor !== "1") {
      extraCost += 15; // 15% extra for no elevator above 2nd floor
    }

    // Destination extra cost
    if (
      !destinationElevator &&
      destinationFloor !== "ground" &&
      destinationFloor !== "1"
    ) {
      extraCost += 15; // 15% extra for no elevator above 2nd floor
    }

    return extraCost;
  };

  const handleDestinationBlur = () => {
    if (destination.trim()) {
      setShowMap(true);
    }
  };

  const handleContinue = () => {
    if (!origin.trim() || !destination.trim()) return;
    // Navigate to date and time selection with all data
    console.log("Origin:", origin);
    console.log("Destination:", destination);
    console.log("Origin Floor:", originFloor);
    console.log("Destination Floor:", destinationFloor);
    console.log("Origin Elevator:", originElevator);
    console.log("Destination Elevator:", destinationElevator);
    console.log("Extra Cost:", calculateExtraCost());
    router.push("/date-time");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#0891b2" />
      <View className="bg-cyan-600 pt-16 pb-6">
        <View className="px-4">
          <Text className="text-2xl font-bold text-white mb-1">
            Origin & Destination
          </Text>
          <Text className="text-sm text-cyan-200">
            Enter your pickup and delivery addresses to calculate the route and
            costs.
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {/* Origin Address */}
          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-800 mb-2">
              Pickup Address (Origin)
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-white">
              <MapPin size={20} color="#10b981" />
              <TextInput
                className="flex-1 ml-3 text-base"
                value={origin}
                onChangeText={setOrigin}
                placeholder="Enter pickup address..."
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Destination Address */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-2">
              Delivery Address (Destination)
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-white">
              <Navigation size={20} color="#ef4444" />
              <TextInput
                className="flex-1 ml-3 text-base"
                value={destination}
                onChangeText={setDestination}
                onBlur={handleDestinationBlur}
                placeholder="Enter delivery address..."
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Map Preview */}
          {showMap && (
            <View className="mb-6 bg-gray-100 rounded-lg p-4">
              <View className="bg-blue-50 rounded-lg p-6 items-center">
                <MapPin size={32} color="#3b82f6" />
                <Text className="text-lg font-semibold text-gray-800 mt-2">
                  Route Preview
                </Text>
                <Text className="text-sm text-gray-600 text-center mt-1">
                  Distance: {distance}
                </Text>
                <Text className="text-xs text-gray-500 mt-2 text-center">
                  Google Maps integration will show detailed route here
                </Text>
              </View>
            </View>
          )}

          {/* Floor Selection */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Floor Details
            </Text>

            {/* Origin Floor */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Pickup Floor
              </Text>
              <TouchableOpacity
                className="border border-gray-300 rounded-lg p-3 bg-white"
                onPress={() => setShowOriginFloors(true)}
              >
                <Text className="text-base text-gray-800">
                  {floorOptions.find((f) => f.value === originFloor)?.label ||
                    "Select floor"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Destination Floor */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Delivery Floor
              </Text>
              <TouchableOpacity
                className="border border-gray-300 rounded-lg p-3 bg-white"
                onPress={() => setShowDestinationFloors(true)}
              >
                <Text className="text-base text-gray-800">
                  {floorOptions.find((f) => f.value === destinationFloor)
                    ?.label || "Select floor"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Elevator Availability */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Elevator Availability
            </Text>

            {/* Origin Elevator */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Elevator at Pickup Location
              </Text>
              <View className="flex-row">
                <TouchableOpacity
                  className={`flex-1 mr-2 p-3 rounded-lg border ${
                    originElevator
                      ? "bg-green-50 border-green-500"
                      : "bg-gray-50 border-gray-300"
                  }`}
                  onPress={() => setOriginElevator(true)}
                >
                  <Text
                    className={`text-center font-medium ${
                      originElevator ? "text-green-700" : "text-gray-600"
                    }`}
                  >
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 ml-2 p-3 rounded-lg border ${
                    !originElevator
                      ? "bg-red-50 border-red-500"
                      : "bg-gray-50 border-gray-300"
                  }`}
                  onPress={() => setOriginElevator(false)}
                >
                  <Text
                    className={`text-center font-medium ${
                      !originElevator ? "text-red-700" : "text-gray-600"
                    }`}
                  >
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Destination Elevator */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Elevator at Delivery Location
              </Text>
              <View className="flex-row">
                <TouchableOpacity
                  className={`flex-1 mr-2 p-3 rounded-lg border ${
                    destinationElevator
                      ? "bg-green-50 border-green-500"
                      : "bg-gray-50 border-gray-300"
                  }`}
                  onPress={() => setDestinationElevator(true)}
                >
                  <Text
                    className={`text-center font-medium ${
                      destinationElevator ? "text-green-700" : "text-gray-600"
                    }`}
                  >
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 ml-2 p-3 rounded-lg border ${
                    !destinationElevator
                      ? "bg-red-50 border-red-500"
                      : "bg-gray-50 border-gray-300"
                  }`}
                  onPress={() => setDestinationElevator(false)}
                >
                  <Text
                    className={`text-center font-medium ${
                      !destinationElevator ? "text-red-700" : "text-gray-600"
                    }`}
                  >
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Extra Cost Warning */}
          {calculateExtraCost() > 0 && (
            <View className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
              <View className="flex-row items-center mb-2">
                <AlertCircle size={20} color="#f59e0b" />
                <Text className="text-orange-800 font-semibold ml-2">
                  Additional Charges Apply
                </Text>
              </View>
              <Text className="text-orange-700 text-sm">
                +{calculateExtraCost()}% extra cost due to no elevator access
                above 2nd floor
              </Text>
            </View>
          )}

          {/* Continue Button */}
          <TouchableOpacity
            className={`py-4 px-6 rounded-xl flex-row justify-center items-center ${
              origin.trim() && destination.trim()
                ? "bg-blue-600"
                : "bg-gray-300"
            }`}
            onPress={handleContinue}
            disabled={!origin.trim() || !destination.trim()}
          >
            <Text className="text-white text-center font-semibold text-lg mr-2">
              Continue to Date & Time
            </Text>
            <ChevronRight size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View className="h-8" />

      {/* Origin Floor Modal */}
      <Modal
        visible={showOriginFloors}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowOriginFloors(false)}
      >
        <View className="flex-1 justify-end bg-black/70">
          <View className="bg-white rounded-t-xl p-6 max-h-4/5">
            <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
              Select Pickup Floor
            </Text>
            <ScrollView className="max-h-80">
              {floorOptions.map((floor) => (
                <TouchableOpacity
                  key={floor.value}
                  className={`p-4 border-b border-gray-100 ${
                    originFloor === floor.value ? "bg-blue-50" : ""
                  }`}
                  onPress={() => {
                    setOriginFloor(floor.value);
                    setShowOriginFloors(false);
                  }}
                >
                  <Text
                    className={`text-base ${
                      originFloor === floor.value
                        ? "text-blue-600 font-semibold"
                        : "text-gray-800"
                    }`}
                  >
                    {floor.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              className="mt-4 bg-gray-200 py-3 rounded-lg"
              onPress={() => setShowOriginFloors(false)}
            >
              <Text className="text-center text-gray-700 font-medium">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Destination Floor Modal */}
      <Modal
        visible={showDestinationFloors}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDestinationFloors(false)}
      >
        <View className="flex-1 justify-end bg-black/70">
          <View className="bg-white rounded-t-xl p-6 max-h-4/5">
            <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
              Select Delivery Floor
            </Text>
            <ScrollView className="max-h-80">
              {floorOptions.map((floor) => (
                <TouchableOpacity
                  key={floor.value}
                  className={`p-4 border-b border-gray-100 ${
                    destinationFloor === floor.value ? "bg-blue-50" : ""
                  }`}
                  onPress={() => {
                    setDestinationFloor(floor.value);
                    setShowDestinationFloors(false);
                  }}
                >
                  <Text
                    className={`text-base ${
                      destinationFloor === floor.value
                        ? "text-blue-600 font-semibold"
                        : "text-gray-800"
                    }`}
                  >
                    {floor.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              className="mt-4 bg-gray-200 py-3 rounded-lg"
              onPress={() => setShowDestinationFloors(false)}
            >
              <Text className="text-center text-gray-700 font-medium">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
