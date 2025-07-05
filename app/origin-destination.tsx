import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Modal,
  ActivityIndicator,
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

  // Autocomplete state
  const [originSuggestions, setOriginSuggestions] = useState<string[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<
    string[]
  >([]);
  const [originLoading, setOriginLoading] = useState(false);
  const [destinationLoading, setDestinationLoading] = useState(false);
  const [originFocused, setOriginFocused] = useState(false);
  const [destinationFocused, setDestinationFocused] = useState(false);
  const originDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const destinationDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // New state for address suggestions and selected address
  const [originAddressSuggestions, setOriginAddressSuggestions] = useState<
    any[]
  >([]);
  const [destinationAddressSuggestions, setDestinationAddressSuggestions] =
    useState<any[]>([]);
  const [originAddressLoading, setOriginAddressLoading] = useState(false);
  const [destinationAddressLoading, setDestinationAddressLoading] =
    useState(false);
  const [originSelectedAddress, setOriginSelectedAddress] = useState<
    any | null
  >(null);
  const [destinationSelectedAddress, setDestinationSelectedAddress] = useState<
    any | null
  >(null);
  const [showOriginAddressDropdown, setShowOriginAddressDropdown] =
    useState(false);
  const [showDestinationAddressDropdown, setShowDestinationAddressDropdown] =
    useState(false);

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

  // Fetch suggestions for origin
  useEffect(() => {
    if (!originFocused || origin.length < 2) {
      setOriginSuggestions([]);
      return;
    }
    if (originDebounceRef.current) clearTimeout(originDebounceRef.current);
    originDebounceRef.current = setTimeout(() => {
      setOriginLoading(true);
      fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(origin)}/autocomplete?limit=100`,
      )
        .then((res) => res.json())
        .then((data) => {
          setOriginSuggestions(Array.isArray(data.result) ? data.result : []);
        })
        .catch(() => setOriginSuggestions([]))
        .finally(() => setOriginLoading(false));
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin, originFocused]);

  // Fetch suggestions for destination
  useEffect(() => {
    if (!destinationFocused || destination.length < 2) {
      setDestinationSuggestions([]);
      return;
    }
    if (destinationDebounceRef.current)
      clearTimeout(destinationDebounceRef.current);
    destinationDebounceRef.current = setTimeout(() => {
      setDestinationLoading(true);
      fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(destination)}/autocomplete?limit=100`,
      )
        .then((res) => res.json())
        .then((data) => {
          setDestinationSuggestions(
            Array.isArray(data.result) ? data.result : [],
          );
        })
        .catch(() => setDestinationSuggestions([]))
        .finally(() => setDestinationLoading(false));
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination, destinationFocused]);

  const GETADDRESS_API_KEY = "58SMvXMeYkOGgDub9btEMg46809";

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#0891b2" />
      <View className="bg-cyan-600 pt-24 pb-6">
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

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-4 py-6">
          {/* Origin Address */}
          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-800 mb-2">
              Pickup Address (Origin)
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-white relative">
              <MapPin size={20} color="#10b981" />
              <TextInput
                className="flex-1 ml-3 text-base"
                value={origin}
                onChangeText={(text) => {
                  setOrigin(text);
                  if (!originFocused) setOriginFocused(true);
                }}
                placeholder="Enter UK pickup postcode..."
                placeholderTextColor="#9CA3AF"
                onFocus={() => setOriginFocused(true)}
                onBlur={() => setTimeout(() => setOriginFocused(false), 200)}
                autoCapitalize="characters"
                keyboardType="default"
                autoCorrect={false}
                maxLength={8}
              />
            </View>
            {/* Suggestions Dropdown */}
            {originFocused &&
              origin.length > 1 &&
              (originSuggestions.length > 0 || originLoading) && (
                <View
                  className="bg-white border border-gray-200 rounded-lg mt-2 shadow-lg"
                  style={{ maxHeight: 200, zIndex: 1000 }}
                >
                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                    style={{ maxHeight: 200 }}
                  >
                    {originSuggestions.map((suggestion) => (
                      <TouchableOpacity
                        key={suggestion}
                        className="p-3 border-b border-gray-100 last:border-b-0"
                        onPress={() => {
                          setOrigin(suggestion);
                          setOriginSuggestions([]);
                          setOriginFocused(false);
                          // Fetch address suggestions for this postcode
                          setOriginAddressLoading(true);
                          setShowOriginAddressDropdown(true);
                          fetch(
                            `https://api.getaddress.io/autocomplete/${encodeURIComponent(suggestion)}?api-key=${GETADDRESS_API_KEY}`,
                          )
                            .then((res) => res.json())
                            .then((data) => {
                              setOriginAddressSuggestions(
                                Array.isArray(data.suggestions)
                                  ? data.suggestions
                                  : [],
                              );
                            })
                            .catch(() => setOriginAddressSuggestions([]))
                            .finally(() => setOriginAddressLoading(false));
                        }}
                      >
                        <Text className="text-base text-gray-800">
                          {suggestion}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    {originLoading && (
                      <View className="p-3">
                        <Text className="text-gray-400 text-center">
                          Loading...
                        </Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              )}
          </View>

          {/* Render address dropdown for origin */}
          {showOriginAddressDropdown && originAddressSuggestions.length > 0 && (
            <View
              className="bg-white border border-gray-200 rounded-lg mt-2 shadow-lg"
              style={{ maxHeight: 250, zIndex: 1000 }}
            >
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
                style={{ maxHeight: 250 }}
              >
                {originAddressSuggestions.map((addr) => (
                  <TouchableOpacity
                    key={addr.id}
                    className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                    onPress={() => {
                      // Fetch full address
                      setOriginAddressLoading(true);
                      fetch(
                        `https://api.getaddress.io/get/${addr.id}?api-key=${GETADDRESS_API_KEY}`,
                      )
                        .then((res) => res.json())
                        .then((data) => {
                          setOriginSelectedAddress(data);
                          setShowOriginAddressDropdown(false);
                        })
                        .catch(() => setOriginSelectedAddress(null))
                        .finally(() => setOriginAddressLoading(false));
                    }}
                  >
                    <Text className="text-base text-gray-800 leading-relaxed">
                      {addr.address}
                    </Text>
                  </TouchableOpacity>
                ))}
                {originAddressLoading && (
                  <View className="p-4 items-center">
                    <ActivityIndicator size="small" color="#0891b2" />
                    <Text className="text-gray-500 text-sm mt-2">
                      Loading address details...
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}

          {/* Render selected address below postcode input for origin */}
          {originSelectedAddress && (
            <View className="mt-3 mb-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl shadow-sm">
              <View className="flex-row items-center mb-3">
                <View className="bg-emerald-100 p-2 rounded-full mr-3">
                  <MapPin size={16} color="#059669" />
                </View>
                <Text className="text-lg font-bold text-emerald-900">
                  Pickup Address
                </Text>
              </View>
              <View className="bg-white rounded-lg p-3 border border-emerald-100">
                {originSelectedAddress.formatted_address &&
                  originSelectedAddress.formatted_address.map(
                    (line: string, idx: number) =>
                      line ? (
                        <Text
                          key={idx}
                          className="text-gray-800 text-base leading-relaxed"
                        >
                          {line}
                        </Text>
                      ) : null,
                  )}
                <View className="flex-row items-center mt-2 pt-2 border-t border-gray-100">
                  <Text className="text-emerald-700 font-semibold text-sm">
                    {originSelectedAddress.postcode}
                  </Text>
                  <View className="bg-emerald-100 px-2 py-1 rounded-full ml-auto">
                    <Text className="text-emerald-700 text-xs font-medium">
                      ✓ Confirmed
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Destination Address */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-2">
              Delivery Address (Destination)
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-white relative">
              <Navigation size={20} color="#ef4444" />
              <TextInput
                className="flex-1 ml-3 text-base"
                value={destination}
                onChangeText={(text) => {
                  setDestination(text);
                  if (!destinationFocused) setDestinationFocused(true);
                }}
                onBlur={() =>
                  setTimeout(() => setDestinationFocused(false), 200)
                }
                onFocus={() => setDestinationFocused(true)}
                placeholder="Enter UK delivery postcode..."
                placeholderTextColor="#9CA3AF"
                autoCapitalize="characters"
                keyboardType="default"
                autoCorrect={false}
                maxLength={8}
              />
            </View>
            {/* Suggestions Dropdown */}
            {destinationFocused &&
              destination.length > 1 &&
              (destinationSuggestions.length > 0 || destinationLoading) && (
                <View
                  className="bg-white border border-gray-200 rounded-lg mt-2 shadow-lg"
                  style={{ maxHeight: 200, zIndex: 1000 }}
                >
                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                    style={{ maxHeight: 200 }}
                  >
                    {destinationSuggestions.map((suggestion) => (
                      <TouchableOpacity
                        key={suggestion}
                        className="p-3 border-b border-gray-100 last:border-b-0"
                        onPress={() => {
                          setDestination(suggestion);
                          setDestinationSuggestions([]);
                          setDestinationFocused(false);
                          // Fetch address suggestions for this postcode
                          setDestinationAddressLoading(true);
                          setShowDestinationAddressDropdown(true);
                          fetch(
                            `https://api.getaddress.io/autocomplete/${encodeURIComponent(suggestion)}?api-key=${GETADDRESS_API_KEY}`,
                          )
                            .then((res) => res.json())
                            .then((data) => {
                              setDestinationAddressSuggestions(
                                Array.isArray(data.suggestions)
                                  ? data.suggestions
                                  : [],
                              );
                            })
                            .catch(() => setDestinationAddressSuggestions([]))
                            .finally(() => setDestinationAddressLoading(false));
                        }}
                      >
                        <Text className="text-base text-gray-800">
                          {suggestion}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    {destinationLoading && (
                      <View className="p-3">
                        <Text className="text-gray-400 text-center">
                          Loading...
                        </Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              )}
          </View>

          {/* Render address dropdown for destination */}
          {showDestinationAddressDropdown &&
            destinationAddressSuggestions.length > 0 && (
              <View
                className="bg-white border border-gray-200 rounded-lg mt-2 shadow-lg"
                style={{ maxHeight: 250, zIndex: 1000 }}
              >
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                  style={{ maxHeight: 250 }}
                >
                  {destinationAddressSuggestions.map((addr) => (
                    <TouchableOpacity
                      key={addr.id}
                      className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                      onPress={() => {
                        setDestinationAddressLoading(true);
                        fetch(
                          `https://api.getaddress.io/get/${addr.id}?api-key=${GETADDRESS_API_KEY}`,
                        )
                          .then((res) => res.json())
                          .then((data) => {
                            setDestinationSelectedAddress(data);
                            setShowDestinationAddressDropdown(false);
                          })
                          .catch(() => setDestinationSelectedAddress(null))
                          .finally(() => setDestinationAddressLoading(false));
                      }}
                    >
                      <Text className="text-base text-gray-800 leading-relaxed">
                        {addr.address}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {destinationAddressLoading && (
                    <View className="p-4 items-center">
                      <ActivityIndicator size="small" color="#0891b2" />
                      <Text className="text-gray-500 text-sm mt-2">
                        Loading address details...
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            )}

          {/* Render selected address below postcode input for destination */}
          {destinationSelectedAddress && (
            <View className="mt-3 mb-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl shadow-sm">
              <View className="flex-row items-center mb-3">
                <View className="bg-red-100 p-2 rounded-full mr-3">
                  <Navigation size={16} color="#dc2626" />
                </View>
                <Text className="text-lg font-bold text-red-900">
                  Delivery Address
                </Text>
              </View>
              <View className="bg-white rounded-lg p-3 border border-red-100">
                {destinationSelectedAddress.formatted_address &&
                  destinationSelectedAddress.formatted_address.map(
                    (line: string, idx: number) =>
                      line ? (
                        <Text
                          key={idx}
                          className="text-gray-800 text-base leading-relaxed"
                        >
                          {line}
                        </Text>
                      ) : null,
                  )}
                <View className="flex-row items-center mt-2 pt-2 border-t border-gray-100">
                  <Text className="text-red-700 font-semibold text-sm">
                    {destinationSelectedAddress.postcode}
                  </Text>
                  <View className="bg-red-100 px-2 py-1 rounded-full ml-auto">
                    <Text className="text-red-700 text-xs font-medium">
                      ✓ Confirmed
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

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
              Continue
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
