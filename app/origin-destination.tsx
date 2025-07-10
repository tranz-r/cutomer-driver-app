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
  Building,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  X,
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

  // Helper to get floor number from value
  const getFloorNumber = (floorValue: string) => {
    if (floorValue === "ground") return 0;
    if (floorValue === "6+") return 6;
    const n = parseInt(floorValue, 10);
    return isNaN(n) ? 0 : n;
  };

  // Updated extra cost calculation
  const calculateExtraCost = () => {
    let extraCost = 0;
    const originFloorNum = getFloorNumber(originFloor);
    const destinationFloorNum = getFloorNumber(destinationFloor);

    // Pickup
    if (!originElevator && originFloorNum > 0) {
      extraCost += originFloorNum * 10;
    }
    // Delivery
    if (!destinationElevator && destinationFloorNum > 0) {
      extraCost += destinationFloorNum * 10;
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
      <StatusBar style="light" backgroundColor="#7080cc" />
      <View style={{ backgroundColor: "#7080cc" }} className="pt-24 pb-6">
        <View className="px-4">
          <Text className="text-2xl font-bold text-white mb-1">
            Origin & Destination
          </Text>
          <Text className="text-sm text-white">
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
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-3">
              📍 Pickup Address
            </Text>
            <View className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              {!originSelectedAddress ? (
                <>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Enter postcode to find address
                  </Text>
                  <View className="flex-row items-center border border-emerald-300 rounded-lg px-3 py-2 bg-emerald-50">
                    <MapPin size={18} color="#10b981" />
                    <TextInput
                      className="flex-1 ml-2 text-sm font-medium"
                      value={origin}
                      onChangeText={(text) => {
                        setOrigin(text);
                        if (!originFocused) setOriginFocused(true);
                      }}
                      placeholder="e.g. SW1A 1AA"
                      placeholderTextColor="#9CA3AF"
                      onFocus={() => setOriginFocused(true)}
                      onBlur={() =>
                        setTimeout(() => setOriginFocused(false), 200)
                      }
                      autoCapitalize="characters"
                      keyboardType="default"
                      autoCorrect={false}
                      maxLength={8}
                    />
                  </View>

                  {/* Postcode Suggestions */}
                  {originFocused &&
                    origin.length > 1 &&
                    (originSuggestions.length > 0 || originLoading) && (
                      <View className="mt-3">
                        <Text className="text-xs text-gray-500 mb-2">
                          Select postcode:
                        </Text>
                        <View
                          className="bg-white border border-gray-200 rounded-lg shadow-sm"
                          style={{ maxHeight: 150 }}
                        >
                          <ScrollView
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={true}
                            nestedScrollEnabled={true}
                            style={{ maxHeight: 150 }}
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
                                  setTimeout(() => {
                                    setOriginAddressSuggestions([
                                      {
                                        id: "mock-1",
                                        address:
                                          "12 Acacia Avenue, London, NW1 4RT",
                                        url: "/get/mock-1",
                                      },
                                      {
                                        id: "mock-2",
                                        address:
                                          "34 Maple Road, Manchester, M14 5GH",
                                        url: "/get/mock-2",
                                      },
                                      {
                                        id: "mock-3",
                                        address:
                                          "56 Oak Street, Birmingham, B15 2TT",
                                        url: "/get/mock-3",
                                      },
                                      {
                                        id: "mock-4",
                                        address:
                                          "78 Elm Drive, Liverpool, L18 9SD",
                                        url: "/get/mock-4",
                                      },
                                      {
                                        id: "mock-5",
                                        address:
                                          "90 Willow Close, Leeds, LS6 2AB",
                                        url: "/get/mock-5",
                                      },
                                      {
                                        id: "mock-6",
                                        address:
                                          "101 Sycamore Lane, Bristol, BS7 8PL",
                                        url: "/get/mock-6",
                                      },
                                      {
                                        id: "mock-7",
                                        address:
                                          "23 Chestnut Grove, Sheffield, S10 3QW",
                                        url: "/get/mock-7",
                                      },
                                      {
                                        id: "mock-8",
                                        address:
                                          "45 Poplar Avenue, Newcastle, NE3 4JP",
                                        url: "/get/mock-8",
                                      },
                                      {
                                        id: "mock-9",
                                        address:
                                          "67 Beech Road, Nottingham, NG7 2LT",
                                        url: "/get/mock-9",
                                      },
                                      {
                                        id: "mock-10",
                                        address:
                                          "89 Cedar Crescent, Southampton, SO15 5QF",
                                        url: "/get/mock-10",
                                      },
                                      {
                                        id: "mock-11",
                                        address:
                                          "11 Ashfield Way, Leicester, LE2 1TR",
                                        url: "/get/mock-11",
                                      },
                                      {
                                        id: "mock-12",
                                        address:
                                          "22 Rowan Street, Coventry, CV3 6GH",
                                        url: "/get/mock-12",
                                      },
                                      {
                                        id: "mock-13",
                                        address:
                                          "33 Hawthorn Court, Reading, RG1 8PL",
                                        url: "/get/mock-13",
                                      },
                                      {
                                        id: "mock-14",
                                        address:
                                          "44 Pine Gardens, Derby, DE1 2AB",
                                        url: "/get/mock-14",
                                      },
                                      {
                                        id: "mock-15",
                                        address:
                                          "55 Birch Avenue, Brighton, BN1 6GH",
                                        url: "/get/mock-15",
                                      },
                                      {
                                        id: "mock-16",
                                        address:
                                          "66 Larch Lane, Plymouth, PL4 7TR",
                                        url: "/get/mock-16",
                                      },
                                      {
                                        id: "mock-17",
                                        address:
                                          "77 Spruce Road, Oxford, OX4 2JP",
                                        url: "/get/mock-17",
                                      },
                                      {
                                        id: "mock-18",
                                        address:
                                          "88 Magnolia Close, Cambridge, CB1 3LT",
                                        url: "/get/mock-18",
                                      },
                                      {
                                        id: "mock-19",
                                        address:
                                          "99 Hazel Drive, York, YO10 5QF",
                                        url: "/get/mock-19",
                                      },
                                      {
                                        id: "mock-20",
                                        address:
                                          "100 Holly Avenue, Glasgow, G12 8PL",
                                        url: "/get/mock-20",
                                      },
                                    ]);
                                    setOriginAddressLoading(false);
                                  }, 600);
                                }}
                              >
                                <Text className="text-sm text-gray-800">
                                  {suggestion}
                                </Text>
                              </TouchableOpacity>
                            ))}
                            {originLoading && (
                              <View className="p-3">
                                <Text className="text-gray-400 text-center text-sm">
                                  Loading...
                                </Text>
                              </View>
                            )}
                          </ScrollView>
                        </View>
                      </View>
                    )}

                  {/* Address Suggestions */}
                  {showOriginAddressDropdown &&
                    originAddressSuggestions.length > 0 && (
                      <View className="mt-3">
                        <Text className="text-xs text-gray-500 mb-2">
                          Select your address:
                        </Text>
                        <View
                          className="bg-white border border-gray-200 rounded-lg shadow-sm"
                          style={{ maxHeight: 200 }}
                        >
                          <ScrollView
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={true}
                            nestedScrollEnabled={true}
                            style={{ maxHeight: 200 }}
                          >
                            {originAddressSuggestions.map((addr) => (
                              <TouchableOpacity
                                key={addr.id}
                                className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                                onPress={() => {
                                  setOriginAddressLoading(true);
                                  setTimeout(() => {
                                    const selected =
                                      originAddressSuggestions.find(
                                        (a) => a.id === addr.id,
                                      );
                                    setOriginSelectedAddress({
                                      formatted_address: [
                                        selected
                                          ? selected.address
                                          : addr.address,
                                      ],
                                      postcode: origin,
                                    });
                                    setShowOriginAddressDropdown(false);
                                    setOriginAddressLoading(false);
                                  }, 600);
                                }}
                              >
                                <Text className="text-sm text-gray-800 leading-relaxed">
                                  {addr.address}
                                </Text>
                              </TouchableOpacity>
                            ))}
                            {originAddressLoading && (
                              <View className="p-3 items-center">
                                <ActivityIndicator
                                  size="small"
                                  color="#0891b2"
                                />
                                <Text className="text-gray-500 text-xs mt-1">
                                  Loading address details...
                                </Text>
                              </View>
                            )}
                          </ScrollView>
                        </View>
                      </View>
                    )}
                </>
              ) : (
                <>
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <View className="bg-emerald-100 p-2 rounded-full mr-3">
                        <MapPin size={16} color="#059669" />
                      </View>
                      <Text className="text-base font-bold text-emerald-900">
                        Selected Pickup Address
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setOriginSelectedAddress(null);
                        setOrigin("");
                        setShowOriginAddressDropdown(false);
                      }}
                      className="bg-gray-100 p-2 rounded-full"
                    >
                      <X size={16} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                  <View className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                    {originSelectedAddress.formatted_address &&
                      originSelectedAddress.formatted_address.map(
                        (line: string, idx: number) =>
                          line ? (
                            <Text
                              key={idx}
                              className="text-gray-800 text-sm leading-relaxed"
                            >
                              {line}
                            </Text>
                          ) : null,
                      )}
                    <View className="flex-row items-center mt-2 pt-2 border-t border-emerald-200">
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
                </>
              )}
            </View>
          </View>

          {/* Destination Address */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-3">
              🎯 Delivery Address
            </Text>
            <View className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              {!destinationSelectedAddress ? (
                <>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Enter postcode to find address
                  </Text>
                  <View className="flex-row items-center border border-red-300 rounded-lg px-3 py-2 bg-red-50">
                    <Navigation size={18} color="#ef4444" />
                    <TextInput
                      className="flex-1 ml-2 text-sm font-medium"
                      value={destination}
                      onChangeText={(text) => {
                        setDestination(text);
                        if (!destinationFocused) setDestinationFocused(true);
                      }}
                      onBlur={() =>
                        setTimeout(() => setDestinationFocused(false), 200)
                      }
                      onFocus={() => setDestinationFocused(true)}
                      placeholder="e.g. W1K 1QA"
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="characters"
                      keyboardType="default"
                      autoCorrect={false}
                      maxLength={8}
                    />
                  </View>

                  {/* Postcode Suggestions */}
                  {destinationFocused &&
                    destination.length > 1 &&
                    (destinationSuggestions.length > 0 ||
                      destinationLoading) && (
                      <View className="mt-3">
                        <Text className="text-xs text-gray-500 mb-2">
                          Select postcode:
                        </Text>
                        <View
                          className="bg-white border border-gray-200 rounded-lg shadow-sm"
                          style={{ maxHeight: 150 }}
                        >
                          <ScrollView
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={true}
                            nestedScrollEnabled={true}
                            style={{ maxHeight: 150 }}
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
                                  setTimeout(() => {
                                    setDestinationAddressSuggestions([
                                      {
                                        id: "mock-21",
                                        address:
                                          "21 Rosewood Avenue, London, NW2 3RT",
                                        url: "/get/mock-21",
                                      },
                                      {
                                        id: "mock-22",
                                        address:
                                          "32 Lavender Road, Manchester, M15 6GH",
                                        url: "/get/mock-22",
                                      },
                                      {
                                        id: "mock-23",
                                        address:
                                          "43 Jasmine Street, Birmingham, B16 3TT",
                                        url: "/get/mock-23",
                                      },
                                      {
                                        id: "mock-24",
                                        address:
                                          "54 Bluebell Drive, Liverpool, L19 8SD",
                                        url: "/get/mock-24",
                                      },
                                      {
                                        id: "mock-25",
                                        address:
                                          "65 Primrose Close, Leeds, LS7 3AB",
                                        url: "/get/mock-25",
                                      },
                                      {
                                        id: "mock-26",
                                        address:
                                          "76 Foxglove Lane, Bristol, BS8 9PL",
                                        url: "/get/mock-26",
                                      },
                                      {
                                        id: "mock-27",
                                        address:
                                          "87 Buttercup Grove, Sheffield, S11 4QW",
                                        url: "/get/mock-27",
                                      },
                                      {
                                        id: "mock-28",
                                        address:
                                          "98 Clover Avenue, Newcastle, NE4 5JP",
                                        url: "/get/mock-28",
                                      },
                                      {
                                        id: "mock-29",
                                        address:
                                          "109 Daffodil Road, Nottingham, NG8 3LT",
                                        url: "/get/mock-29",
                                      },
                                      {
                                        id: "mock-30",
                                        address:
                                          "120 Sunflower Crescent, Southampton, SO16 6QF",
                                        url: "/get/mock-30",
                                      },
                                      {
                                        id: "mock-31",
                                        address:
                                          "131 Tulip Way, Leicester, LE3 2TR",
                                        url: "/get/mock-31",
                                      },
                                      {
                                        id: "mock-32",
                                        address:
                                          "142 Orchid Street, Coventry, CV4 7GH",
                                        url: "/get/mock-32",
                                      },
                                      {
                                        id: "mock-33",
                                        address:
                                          "153 Peony Court, Reading, RG2 9PL",
                                        url: "/get/mock-33",
                                      },
                                      {
                                        id: "mock-34",
                                        address:
                                          "164 Camellia Gardens, Derby, DE2 3AB",
                                        url: "/get/mock-34",
                                      },
                                      {
                                        id: "mock-35",
                                        address:
                                          "175 Lotus Avenue, Brighton, BN2 7GH",
                                        url: "/get/mock-35",
                                      },
                                      {
                                        id: "mock-36",
                                        address:
                                          "186 Dahlia Lane, Plymouth, PL5 8TR",
                                        url: "/get/mock-36",
                                      },
                                      {
                                        id: "mock-37",
                                        address:
                                          "197 Marigold Road, Oxford, OX5 3JP",
                                        url: "/get/mock-37",
                                      },
                                      {
                                        id: "mock-38",
                                        address:
                                          "208 Azalea Close, Cambridge, CB2 4LT",
                                        url: "/get/mock-38",
                                      },
                                      {
                                        id: "mock-39",
                                        address:
                                          "219 Gardenia Drive, York, YO11 6QF",
                                        url: "/get/mock-39",
                                      },
                                      {
                                        id: "mock-40",
                                        address:
                                          "230 Heather Avenue, Glasgow, G13 9PL",
                                        url: "/get/mock-40",
                                      },
                                    ]);
                                    setDestinationAddressLoading(false);
                                  }, 600);
                                }}
                              >
                                <Text className="text-sm text-gray-800">
                                  {suggestion}
                                </Text>
                              </TouchableOpacity>
                            ))}
                            {destinationLoading && (
                              <View className="p-3">
                                <Text className="text-gray-400 text-center text-sm">
                                  Loading...
                                </Text>
                              </View>
                            )}
                          </ScrollView>
                        </View>
                      </View>
                    )}

                  {/* Address Suggestions */}
                  {showDestinationAddressDropdown &&
                    destinationAddressSuggestions.length > 0 && (
                      <View className="mt-3">
                        <Text className="text-xs text-gray-500 mb-2">
                          Select your address:
                        </Text>
                        <View
                          className="bg-white border border-gray-200 rounded-lg shadow-sm"
                          style={{ maxHeight: 200 }}
                        >
                          <ScrollView
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={true}
                            nestedScrollEnabled={true}
                            style={{ maxHeight: 200 }}
                          >
                            {destinationAddressSuggestions.map((addr) => (
                              <TouchableOpacity
                                key={addr.id}
                                className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                                onPress={() => {
                                  setDestinationAddressLoading(true);
                                  setTimeout(() => {
                                    const selected =
                                      destinationAddressSuggestions.find(
                                        (a) => a.id === addr.id,
                                      );
                                    setDestinationSelectedAddress({
                                      formatted_address: [
                                        selected
                                          ? selected.address
                                          : addr.address,
                                      ],
                                      postcode: destination,
                                    });
                                    setShowDestinationAddressDropdown(false);
                                    setDestinationAddressLoading(false);
                                  }, 600);
                                }}
                              >
                                <Text className="text-sm text-gray-800 leading-relaxed">
                                  {addr.address}
                                </Text>
                              </TouchableOpacity>
                            ))}
                            {destinationAddressLoading && (
                              <View className="p-3 items-center">
                                <ActivityIndicator
                                  size="small"
                                  color="#0891b2"
                                />
                                <Text className="text-gray-500 text-xs mt-1">
                                  Loading address details...
                                </Text>
                              </View>
                            )}
                          </ScrollView>
                        </View>
                      </View>
                    )}
                </>
              ) : (
                <>
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <View className="bg-red-100 p-2 rounded-full mr-3">
                        <Navigation size={16} color="#dc2626" />
                      </View>
                      <Text className="text-base font-bold text-red-900">
                        Selected Delivery Address
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setDestinationSelectedAddress(null);
                        setDestination("");
                        setShowDestinationAddressDropdown(false);
                      }}
                      className="bg-gray-100 p-2 rounded-full"
                    >
                      <X size={16} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                  <View className="bg-red-50 rounded-lg p-3 border border-red-100">
                    {destinationSelectedAddress.formatted_address &&
                      destinationSelectedAddress.formatted_address.map(
                        (line: string, idx: number) =>
                          line ? (
                            <Text
                              key={idx}
                              className="text-gray-800 text-sm leading-relaxed"
                            >
                              {line}
                            </Text>
                          ) : null,
                      )}
                    <View className="flex-row items-center mt-2 pt-2 border-t border-red-200">
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
                </>
              )}
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

          {/* Floor & Access Details */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              🏢 Floor & Access Details
            </Text>

            <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <Text className="text-blue-800 text-sm mb-3 font-medium">
                💡 This helps us prepare the right equipment and estimate
                accurate timing
              </Text>
            </View>

            {/* Pickup Location Details */}
            <View className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
              <View className="flex-row items-center mb-3">
                <View className="bg-emerald-100 p-2 rounded-full mr-3">
                  <ArrowUp size={16} color="#059669" />
                </View>
                <Text className="text-base font-semibold text-gray-900">
                  Pickup Location
                </Text>
              </View>

              <View className="mb-3">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Which floor?
                </Text>
                <TouchableOpacity
                  className="flex-row items-center justify-between border border-gray-300 rounded-lg p-3 bg-gray-50"
                  onPress={() => setShowOriginFloors(true)}
                >
                  <View className="flex-row items-center">
                    <Building size={16} color="#6b7280" />
                    <Text className="text-base text-gray-800 ml-2">
                      {floorOptions.find((f) => f.value === originFloor)
                        ?.label || "Select floor"}
                    </Text>
                  </View>
                  <ChevronRight size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              {getFloorNumber(originFloor) > 0 && (
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Is there an elevator?
                  </Text>
                  <View className="flex-row">
                    <TouchableOpacity
                      className={`flex-1 mr-2 p-3 rounded-lg border flex-row items-center justify-center ${
                        originElevator
                          ? "bg-green-50 border-green-500"
                          : "bg-gray-50 border-gray-300"
                      }`}
                      onPress={() => setOriginElevator(true)}
                    >
                      {originElevator && (
                        <CheckCircle size={16} color="#10b981" />
                      )}
                      <Text
                        className={`font-medium ml-1 ${originElevator ? "text-green-700" : "text-gray-600"}`}
                      >
                        Yes
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`flex-1 ml-2 p-3 rounded-lg border flex-row items-center justify-center ${
                        !originElevator
                          ? "bg-red-50 border-red-500"
                          : "bg-gray-50 border-gray-300"
                      }`}
                      onPress={() => setOriginElevator(false)}
                    >
                      {!originElevator && <X size={16} color="#ef4444" />}
                      <Text
                        className={`font-medium ml-1 ${!originElevator ? "text-red-700" : "text-gray-600"}`}
                      >
                        No
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* Delivery Location Details */}
            <View className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <View className="flex-row items-center mb-3">
                <View className="bg-red-100 p-2 rounded-full mr-3">
                  <ArrowDown size={16} color="#dc2626" />
                </View>
                <Text className="text-base font-semibold text-gray-900">
                  Delivery Location
                </Text>
              </View>

              <View className="mb-3">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Which floor?
                </Text>
                <TouchableOpacity
                  className="flex-row items-center justify-between border border-gray-300 rounded-lg p-3 bg-gray-50"
                  onPress={() => setShowDestinationFloors(true)}
                >
                  <View className="flex-row items-center">
                    <Building size={16} color="#6b7280" />
                    <Text className="text-base text-gray-800 ml-2">
                      {floorOptions.find((f) => f.value === destinationFloor)
                        ?.label || "Select floor"}
                    </Text>
                  </View>
                  <ChevronRight size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              {getFloorNumber(destinationFloor) > 0 && (
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Is there an elevator?
                  </Text>
                  <View className="flex-row">
                    <TouchableOpacity
                      className={`flex-1 mr-2 p-3 rounded-lg border flex-row items-center justify-center ${
                        destinationElevator
                          ? "bg-green-50 border-green-500"
                          : "bg-gray-50 border-gray-300"
                      }`}
                      onPress={() => setDestinationElevator(true)}
                    >
                      {destinationElevator && (
                        <CheckCircle size={16} color="#10b981" />
                      )}
                      <Text
                        className={`font-medium ml-1 ${destinationElevator ? "text-green-700" : "text-gray-600"}`}
                      >
                        Yes
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`flex-1 ml-2 p-3 rounded-lg border flex-row items-center justify-center ${
                        !destinationElevator
                          ? "bg-red-50 border-red-500"
                          : "bg-gray-50 border-gray-300"
                      }`}
                      onPress={() => setDestinationElevator(false)}
                    >
                      {!destinationElevator && <X size={16} color="#ef4444" />}
                      <Text
                        className={`font-medium ml-1 ${!destinationElevator ? "text-red-700" : "text-gray-600"}`}
                      >
                        No
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
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
                above ground floor
              </Text>
            </View>
          )}

          {/* Continue Button */}
          <TouchableOpacity
            className="py-5 px-8 rounded-2xl flex-row justify-center items-center shadow-lg"
            style={{ backgroundColor: "#70AECC" }}
            onPress={handleContinue}
            disabled={!originSelectedAddress || !destinationSelectedAddress}
          >
            <Text className="text-white text-center font-bold text-lg mr-3">
              Continue
            </Text>
            <ChevronRight size={22} color="white" />
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
