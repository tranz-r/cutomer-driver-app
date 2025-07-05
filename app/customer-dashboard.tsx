import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  Platform,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Calendar,
  Clock,
  Truck,
  MapPin,
  Download,
  Plus,
  X,
  AlertTriangle,
  CheckCircle,
  User,
  Bell,
  Settings,
  CreditCard,
  FileText,
  Phone,
  Star,
  ChevronRight,
  Package,
  LogOut,
  Navigation,
  Map,
  Route,
  Timer,
  Shield,
} from "lucide-react-native";

// Conditionally import MapView only for native platforms
let MapView: any = null;
let Marker: any = null;
let PROVIDER_DEFAULT: any = null;

// Only import react-native-maps on native platforms
if (Platform.OS === "ios" || Platform.OS === "android") {
  try {
    const MapModule = require("react-native-maps");
    MapView = MapModule.default || MapModule.MapView;
    Marker = MapModule.Marker;
    PROVIDER_DEFAULT = MapModule.PROVIDER_DEFAULT;
  } catch (error) {
    console.log("react-native-maps not available:", error);
  }
}
import { router, useRouter } from "expo-router";

type BookingStatus = "active" | "pending" | "completed" | "cancelled";

type Booking = {
  id: string;
  status: BookingStatus;
  date: string;
  time: string;
  origin: string;
  destination: string;
  vanType: string;
  crew: string;
  duration: number;
  totalCost: number;
  moveDate: Date;
  canCancel: boolean;
  cancellationFee: number;
  invoiceUrl?: string;
  driverName?: string;
  driverPhone?: string;
  rating?: number;
};

export default function CustomerDashboard() {
  const navigation = useRouter();
  const [activeTab, setActiveTab] = useState<"active" | "pending" | "history">(
    "active",
  );
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [additionalHours, setAdditionalHours] = useState("1");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDriverLocation, setShowDriverLocation] = useState(false);
  const [selectedActiveBooking, setSelectedActiveBooking] =
    useState<Booking | null>(null);

  // Mock user data
  const user = {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+44 7700 900123",
    totalBookings: 12,
    memberSince: "2023",
  };

  // Mock bookings data
  const bookings: Booking[] = [
    {
      id: "BK001",
      status: "active",
      date: "Today, 15 Mar 2024",
      time: "10:00 - 14:00",
      origin: "123 High Street, London SW1A 1AA",
      destination: "456 Park Lane, London W1K 1QA",
      vanType: "Luton Van",
      crew: "2 persons",
      duration: 4,
      totalCost: 528,
      moveDate: new Date(),
      canCancel: false,
      cancellationFee: 0,
      driverName: "Mike Johnson",
      driverPhone: "+44 7700 900456",
      invoiceUrl: "invoice-001.pdf",
      driverLocation: {
        lat: 51.5074,
        lng: -0.1278,
        address: "Currently at: Oxford Street, London",
        eta: "15 minutes",
        status: "On the way to pickup location",
        pickupLat: 51.5014,
        pickupLng: -0.1419,
        deliveryLat: 51.5033,
        deliveryLng: -0.1195,
        speed: "25 mph",
        lastUpdated: "2 minutes ago",
      },
    },
    {
      id: "BK002",
      status: "pending",
      date: "Mon, 18 Mar 2024",
      time: "09:00 - 13:00",
      origin: "789 Oak Avenue, London N1 2AB",
      destination: "321 Elm Street, London E1 6CD",
      vanType: "Transit Van",
      crew: "1 person",
      duration: 4,
      totalCost: 380,
      moveDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      canCancel: true,
      cancellationFee: 0,
    },
    {
      id: "BK003",
      status: "pending",
      date: "Fri, 22 Mar 2024",
      time: "14:00 - 18:00",
      origin: "555 Pine Road, London SW2 3EF",
      destination: "777 Maple Close, London NW1 4GH",
      vanType: "Luton Van",
      crew: "2 persons",
      duration: 4,
      totalCost: 528,
      moveDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      canCancel: true,
      cancellationFee: 75,
    },
    {
      id: "BK004",
      status: "completed",
      date: "Wed, 10 Mar 2024",
      time: "11:00 - 15:00",
      origin: "999 Cedar Lane, London SE1 5IJ",
      destination: "111 Birch Way, London W2 6KL",
      vanType: "Transit Van",
      crew: "1 person",
      duration: 4,
      totalCost: 380,
      moveDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      canCancel: false,
      cancellationFee: 0,
      invoiceUrl: "invoice-004.pdf",
      rating: 5,
    },
  ];

  const notifications = [
    {
      id: "1",
      title: "Booking Confirmed",
      message: "Your move on 18 Mar has been confirmed",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: "2",
      title: "Driver Assigned",
      message: "Mike Johnson will handle your move today",
      time: "1 day ago",
      unread: false,
    },
  ];

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case "active":
        return <Truck size={16} color="#059669" />;
      case "pending":
        return <Clock size={16} color="#2563eb" />;
      case "completed":
        return <CheckCircle size={16} color="#6b7280" />;
      case "cancelled":
        return <X size={16} color="#dc2626" />;
      default:
        return <Clock size={16} color="#6b7280" />;
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "active") return booking.status === "active";
    if (activeTab === "pending") return booking.status === "pending";
    if (activeTab === "history")
      return booking.status === "completed" || booking.status === "cancelled";
    return false;
  });

  const handleExtendBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowExtendModal(true);
  };

  const handleCancelBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const confirmExtendBooking = () => {
    const hours = parseInt(additionalHours);
    const costPerHour = 110; // £110/hour
    const additionalCost = hours * costPerHour * 1.2; // Including VAT

    Alert.alert(
      "Extend Booking",
      `Add ${hours} hour${hours > 1 ? "s" : ""} for £${additionalCost.toFixed(2)}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            setShowExtendModal(false);
            Alert.alert("Success", "Your booking has been extended!");
          },
        },
      ],
    );
  };

  const confirmCancelBooking = () => {
    const fee = selectedBooking?.cancellationFee || 0;
    const message =
      fee > 0
        ? `Cancel booking? A cancellation fee of £${fee} will apply.`
        : "Cancel booking? No cancellation fee will apply.";

    Alert.alert("Cancel Booking", message, [
      { text: "Keep Booking", style: "cancel" },
      {
        text: "Cancel Booking",
        style: "destructive",
        onPress: () => {
          setShowCancelModal(false);
          Alert.alert("Cancelled", "Your booking has been cancelled.");
        },
      },
    ]);
  };

  const downloadInvoice = (booking: Booking) => {
    Alert.alert("Download", `Downloading invoice for booking ${booking.id}`);
  };

  const callDriver = (phone: string) => {
    Alert.alert("Call Driver", `Calling ${phone}`);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          try {
            // Clear any stored auth data here
            navigation.replace("/landing");
          } catch (error) {
            console.log("Navigation not available in this context");
          }
        },
      },
    ]);
  };

  // Check if user needs to authenticate when component loads
  useEffect(() => {
    // Simulate checking if user is authenticated
    // In a real app, this would check stored auth tokens
    const isAuthenticated = true; // Set to true for now since user just authenticated

    if (!isAuthenticated) {
      // Redirect to auth if not authenticated
      navigation.replace("/auth");
    }
  }, []);

  const handleShowDriverLocation = (booking: Booking) => {
    setSelectedActiveBooking(booking);
    setShowDriverLocation(true);
  };

  const renderBookingCard = (booking: Booking) => (
    <View
      key={booking.id}
      className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <View
            className={`px-3 py-2 rounded-full flex-row items-center ${getStatusColor(booking.status)}`}
          >
            {getStatusIcon(booking.status)}
            <Text
              className={`text-xs font-semibold ml-1 ${getStatusColor(booking.status).split(" ")[1]}`}
            >
              {booking.status.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text className="text-sm font-semibold text-gray-900">
          #{booking.id}
        </Text>
      </View>

      {/* Date & Time */}
      <View className="flex-row items-center mb-3">
        <View className="flex-row items-center mr-4 mb-1">
          <Calendar size={16} color="#6b7280" />
          <Text className="text-sm text-gray-600 ml-2">{booking.date}</Text>
        </View>
        <View className="flex-row items-center mb-1">
          <Clock size={16} color="#6b7280" />
          <Text className="text-sm text-gray-600 ml-2">{booking.time}</Text>
        </View>
      </View>

      {/* Locations */}
      <View className="mb-3">
        <View className="flex-row items-start mb-1">
          <MapPin size={14} color="#10b981" />
          <Text className="text-xs text-gray-600 ml-2 flex-1" numberOfLines={1}>
            From: {booking.origin}
          </Text>
        </View>
        <View className="flex-row items-start">
          <MapPin size={14} color="#ef4444" />
          <Text className="text-xs text-gray-600 ml-2 flex-1" numberOfLines={1}>
            To: {booking.destination}
          </Text>
        </View>
      </View>

      {/* Service Details */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <Truck size={16} color="#3b82f6" />
          <Text className="text-sm text-gray-600 ml-2">{booking.vanType}</Text>
        </View>
        <View className="flex-row items-center">
          <User size={16} color="#8b5cf6" />
          <Text className="text-sm text-gray-600 ml-2">{booking.crew}</Text>
        </View>
        <Text className="text-lg font-bold text-blue-600">
          £{booking.totalCost}
        </Text>
      </View>

      {/* Driver Info (for active bookings) */}
      {booking.status === "active" && booking.driverName && (
        <View className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-200">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <View className="bg-blue-100 p-2 rounded-full mr-3">
                  <User size={16} color="#3b82f6" />
                </View>
                <View>
                  <Text className="text-base font-bold text-blue-900">
                    {booking.driverName}
                  </Text>
                  <Text className="text-sm text-blue-700">
                    {booking.driverPhone}
                  </Text>
                </View>
              </View>
              {booking.driverLocation && (
                <Text className="text-sm text-green-600 font-medium">
                  {booking.driverLocation.status}
                </Text>
              )}
            </View>
            <View className="flex-row">
              <TouchableOpacity
                className="bg-green-500 px-3 py-2 rounded-lg mr-2"
                onPress={() => handleShowDriverLocation(booking)}
              >
                <Map size={16} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-500 px-3 py-2 rounded-lg"
                onPress={() => callDriver(booking.driverPhone!)}
              >
                <Phone size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          {booking.driverLocation && (
            <View className="bg-white rounded-lg p-3">
              <Text className="text-sm text-gray-700 mb-1">
                {booking.driverLocation.address}
              </Text>
              <Text className="text-sm font-bold text-green-600">
                ETA: {booking.driverLocation.eta}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Rating (for completed bookings) */}
      {booking.status === "completed" && booking.rating && (
        <View className="flex-row items-center mb-3">
          <Text className="text-sm text-gray-600 mr-2">Your Rating:</Text>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              color={i < booking.rating! ? "#fbbf24" : "#d1d5db"}
              fill={i < booking.rating! ? "#fbbf24" : "none"}
            />
          ))}
        </View>
      )}

      {/* Action Buttons */}
      <View className="flex-row justify-between">
        {booking.status === "active" && (
          <>
            <TouchableOpacity
              className="bg-green-600 px-4 py-2 rounded-lg flex-1 mr-2"
              onPress={() => handleExtendBooking(booking)}
            >
              <View className="flex-row items-center justify-center">
                <Plus size={16} color="white" />
                <Text className="text-white font-semibold text-sm ml-1">
                  Extend
                </Text>
              </View>
            </TouchableOpacity>
            {booking.invoiceUrl && (
              <TouchableOpacity
                className="bg-blue-600 px-4 py-2 rounded-lg flex-1 ml-2"
                onPress={() => downloadInvoice(booking)}
              >
                <View className="flex-row items-center justify-center">
                  <Download size={16} color="white" />
                  <Text className="text-white font-semibold text-sm ml-1">
                    Invoice
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </>
        )}

        {booking.status === "pending" && (
          <>
            {booking.canCancel && (
              <TouchableOpacity
                className="bg-red-600 px-4 py-2 rounded-lg flex-1 mr-2"
                onPress={() => handleCancelBooking(booking)}
              >
                <View className="flex-row items-center justify-center">
                  <X size={16} color="white" />
                  <Text className="text-white font-semibold text-sm ml-1">
                    Cancel
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="bg-blue-600 px-4 py-2 rounded-lg flex-1 ml-2"
              onPress={() => Alert.alert("Edit", "Edit booking functionality")}
            >
              <View className="flex-row items-center justify-center">
                <Settings size={16} color="white" />
                <Text className="text-white font-semibold text-sm ml-1">
                  Edit
                </Text>
              </View>
            </TouchableOpacity>
          </>
        )}

        {booking.status === "completed" && booking.invoiceUrl && (
          <TouchableOpacity
            className="bg-blue-600 px-4 py-2 rounded-lg flex-1"
            onPress={() => downloadInvoice(booking)}
          >
            <View className="flex-row items-center justify-center">
              <Download size={16} color="white" />
              <Text className="text-white font-semibold text-sm ml-1">
                Download Invoice
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const { width: screenWidth } = Dimensions.get("window");
  const isTablet = screenWidth > 768;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="light" backgroundColor="#1e40af" translucent={false} />

      {/* Header */}
      <View className="bg-blue-600 pt-24 pb-8">
        <View className="px-4">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-white mb-2">
                Hello, {user.name.split(" ")[0]}! 👋
              </Text>
              <Text className="text-sm text-blue-100">
                Manage your bookings and account
              </Text>
            </View>
            <View className="flex-row items-center">
              <TouchableOpacity
                className="relative p-3 rounded-full bg-white/20 mr-3"
                onPress={() => setShowNotifications(true)}
              >
                <Bell size={20} color="white" />
                {notifications.some((n) => n.unread) && (
                  <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3 border border-white" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                className="p-3 rounded-full bg-white/20"
                onPress={handleLogout}
              >
                <LogOut size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* User Stats Row */}
          <View className="flex-row items-center mt-2">
            <View className="bg-white/15 rounded-full px-3 py-1 mr-3">
              <Text className="text-white text-xs font-medium">
                Member since {user.memberSince}
              </Text>
            </View>
            <View className="bg-white/15 rounded-full px-3 py-1">
              <Text className="text-white text-xs font-medium">
                Premium Customer
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Stats */}
      <View className="px-4 -mt-4 mb-6">
        <View className="flex-row justify-between">
          <View className="bg-white rounded-xl p-4 flex-1 mr-2 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-bold text-gray-900 mb-1">
                  {bookings.filter((b) => b.status === "active").length}
                </Text>
                <Text className="text-sm text-gray-600">Active Moves</Text>
              </View>
              <View className="bg-green-500 p-3 rounded-xl">
                <Truck size={20} color="white" />
              </View>
            </View>
          </View>
          <View className="bg-white rounded-xl p-4 flex-1 ml-2 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-bold text-gray-900 mb-1">
                  {user.totalBookings}
                </Text>
                <Text className="text-sm text-gray-600">Total Moves</Text>
              </View>
              <View className="bg-blue-500 p-3 rounded-xl">
                <Package size={20} color="white" />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View className="px-4 mb-6">
        <View className="bg-white rounded-xl p-1 flex-row shadow-sm">
          {["active", "pending", "history"].map((tab) => (
            <TouchableOpacity
              key={tab}
              className={`flex-1 py-3 rounded-lg ${
                activeTab === tab ? "bg-blue-500" : "bg-transparent"
              }`}
              onPress={() => setActiveTab(tab as any)}
            >
              <Text
                className={`text-center font-semibold text-sm ${
                  activeTab === tab ? "text-white" : "text-gray-600"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bookings List */}
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {filteredBookings.length > 0 ? (
          filteredBookings.map(renderBookingCard)
        ) : (
          <View className="bg-white rounded-xl p-8 items-center shadow-sm">
            <View className="bg-gray-100 p-4 rounded-full mb-4">
              <Package size={32} color="#9ca3af" />
            </View>
            <Text className="text-lg font-bold text-gray-900 mb-2">
              No {activeTab} bookings
            </Text>
            <Text className="text-sm text-gray-600 text-center mb-6">
              {activeTab === "active" &&
                "You don't have any active moves right now."}
              {activeTab === "pending" && "No upcoming moves scheduled."}
              {activeTab === "history" && "Your move history will appear here."}
            </Text>
            <TouchableOpacity
              className="bg-blue-500 px-6 py-3 rounded-xl"
              onPress={() => {
                try {
                  navigation.push("/item-detection");
                } catch (error) {
                  console.log("Navigation not available in this context");
                }
              }}
            >
              <Text className="text-white font-semibold">Book a Move</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-4 bg-blue-500 rounded-xl shadow-lg flex-row items-center px-4 py-3"
        onPress={() => {
          try {
            navigation.push("/item-detection");
          } catch (error) {
            console.log("Navigation not available in this context");
          }
        }}
      >
        <Plus size={16} color="white" />
        <Text className="text-white font-semibold text-sm ml-2">New Move</Text>
      </TouchableOpacity>

      {/* Extend Booking Modal */}
      <Modal
        visible={showExtendModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowExtendModal(false)}
      >
        <View className="flex-1 justify-end bg-black/70">
          <View className="bg-white rounded-t-2xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-900">
                Extend Booking
              </Text>
              <TouchableOpacity onPress={() => setShowExtendModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Text className="text-base text-gray-600 mb-4">
              Add more hours to booking #{selectedBooking?.id}
            </Text>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-800 mb-2">
                Additional Hours
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-base"
                value={additionalHours}
                onChangeText={setAdditionalHours}
                keyboardType="numeric"
                placeholder="Enter hours"
              />
            </View>

            <View className="bg-blue-50 rounded-lg p-4 mb-6">
              <Text className="text-sm text-blue-800">
                <Text className="font-semibold">Cost:</Text> £
                {(parseInt(additionalHours || "0") * 110 * 1.2).toFixed(2)}{" "}
                (inc. VAT)
              </Text>
              <Text className="text-xs text-blue-600 mt-1">
                Rate: £110/hour + VAT
              </Text>
            </View>

            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-gray-200 px-6 py-3 rounded-lg flex-1 mr-3"
                onPress={() => setShowExtendModal(false)}
              >
                <Text className="text-gray-700 font-semibold text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-green-600 px-6 py-3 rounded-lg flex-1 ml-3"
                onPress={confirmExtendBooking}
              >
                <Text className="text-white font-semibold text-center">
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Cancel Booking Modal */}
      <Modal
        visible={showCancelModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View className="flex-1 justify-center bg-black/70 px-6">
          <View className="bg-white rounded-2xl p-6">
            <View className="items-center mb-6">
              <View className="bg-red-100 p-3 rounded-full mb-3">
                <AlertTriangle size={32} color="#dc2626" />
              </View>
              <Text className="text-xl font-bold text-gray-900 mb-2">
                Cancel Booking?
              </Text>
              <Text className="text-base text-gray-600 text-center">
                Are you sure you want to cancel booking #{selectedBooking?.id}?
              </Text>
            </View>

            {selectedBooking?.cancellationFee &&
              selectedBooking.cancellationFee > 0 && (
                <View className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <Text className="text-amber-800 text-sm font-semibold mb-1">
                    Cancellation Fee: £{selectedBooking.cancellationFee}
                  </Text>
                  <Text className="text-amber-700 text-xs">
                    This fee applies as cancellation is within 72 hours of move
                    date.
                  </Text>
                </View>
              )}

            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-gray-200 px-6 py-3 rounded-lg flex-1 mr-3"
                onPress={() => setShowCancelModal(false)}
              >
                <Text className="text-gray-700 font-semibold text-center">
                  Keep Booking
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-600 px-6 py-3 rounded-lg flex-1 ml-3"
                onPress={confirmCancelBooking}
              >
                <Text className="text-white font-semibold text-center">
                  Cancel Booking
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Driver Location Modal */}
      <Modal
        visible={showDriverLocation}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDriverLocation(false)}
      >
        <View className="flex-1 justify-end bg-black/70">
          <View className="bg-white rounded-t-2xl p-6 max-h-4/5">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-900">
                🚛 Driver Location
              </Text>
              <TouchableOpacity onPress={() => setShowDriverLocation(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {selectedActiveBooking?.driverLocation && (
              <View>
                {/* Live Map with Driver Location */}
                <View className="bg-white rounded-xl overflow-hidden mb-6 shadow-sm border border-gray-200">
                  <View className="bg-green-50 px-4 py-3 border-b border-green-200">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <View className="bg-green-500 rounded-full w-3 h-3 mr-2" />
                        <Text className="text-green-800 font-semibold text-sm">
                          Live Tracking Active
                        </Text>
                      </View>
                      <Text className="text-green-600 text-xs">
                        Updated{" "}
                        {selectedActiveBooking.driverLocation.lastUpdated}
                      </Text>
                    </View>
                  </View>

                  {(Platform.OS === "ios" || Platform.OS === "android") &&
                  MapView ? (
                    <MapView
                      provider={PROVIDER_DEFAULT}
                      style={{ height: 280 }}
                      region={{
                        latitude: selectedActiveBooking.driverLocation.lat,
                        longitude: selectedActiveBooking.driverLocation.lng,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02,
                      }}
                      showsUserLocation={false}
                      showsMyLocationButton={false}
                      showsCompass={true}
                      showsScale={true}
                      mapType="standard"
                    >
                      {/* Driver Location Marker */}
                      <Marker
                        coordinate={{
                          latitude: selectedActiveBooking.driverLocation.lat,
                          longitude: selectedActiveBooking.driverLocation.lng,
                        }}
                        title={`${selectedActiveBooking.driverName} (Driver)`}
                        description={`Moving at ${selectedActiveBooking.driverLocation.speed} • ETA: ${selectedActiveBooking.driverLocation.eta}`}
                        pinColor="#059669"
                      />

                      {/* Pickup Location Marker */}
                      <Marker
                        coordinate={{
                          latitude:
                            selectedActiveBooking.driverLocation.pickupLat,
                          longitude:
                            selectedActiveBooking.driverLocation.pickupLng,
                        }}
                        title="Pickup Location"
                        description={selectedActiveBooking.origin}
                        pinColor="#3b82f6"
                      />

                      {/* Delivery Location Marker */}
                      <Marker
                        coordinate={{
                          latitude:
                            selectedActiveBooking.driverLocation.deliveryLat,
                          longitude:
                            selectedActiveBooking.driverLocation.deliveryLng,
                        }}
                        title="Delivery Location"
                        description={selectedActiveBooking.destination}
                        pinColor="#ef4444"
                      />
                    </MapView>
                  ) : (
                    <View
                      className="bg-blue-100 rounded-lg p-8 items-center justify-center"
                      style={{ height: 280 }}
                    >
                      <Map size={48} color="#3b82f6" />
                      <Text className="text-blue-800 font-semibold mt-4 text-center">
                        Map View
                      </Text>
                      <Text className="text-blue-600 text-sm text-center mt-2">
                        Driver location tracking available on mobile
                      </Text>
                    </View>
                  )}
                </View>

                {/* Enhanced Driver Status Cards */}
                <View className="space-y-4 mb-6">
                  {/* Current Status */}
                  <View className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <View className="flex-row items-center mb-3">
                      <View className="bg-blue-500 p-2 rounded-full mr-3">
                        <Route size={16} color="white" />
                      </View>
                      <Text className="text-blue-900 font-bold text-base">
                        Current Status
                      </Text>
                    </View>
                    <Text className="text-blue-800 font-medium">
                      {selectedActiveBooking.driverLocation.status}
                    </Text>
                  </View>

                  {/* ETA & Speed Info */}
                  <View className="flex-row space-x-3">
                    <View className="bg-green-50 rounded-xl p-4 flex-1 border border-green-200">
                      <View className="flex-row items-center mb-2">
                        <Timer size={16} color="#059669" />
                        <Text className="text-green-800 font-semibold text-sm ml-2">
                          ETA
                        </Text>
                      </View>
                      <Text className="text-green-900 font-bold text-lg">
                        {selectedActiveBooking.driverLocation.eta}
                      </Text>
                    </View>

                    <View className="bg-orange-50 rounded-xl p-4 flex-1 border border-orange-200">
                      <View className="flex-row items-center mb-2">
                        <Navigation size={16} color="#f59e0b" />
                        <Text className="text-orange-800 font-semibold text-sm ml-2">
                          Speed
                        </Text>
                      </View>
                      <Text className="text-orange-900 font-bold text-lg">
                        {selectedActiveBooking.driverLocation.speed}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Driver Contact & Trust Indicators */}
                <View className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                      <View className="bg-blue-100 p-3 rounded-full mr-3">
                        <User size={20} color="#3b82f6" />
                      </View>
                      <View>
                        <Text className="text-gray-900 font-bold text-base">
                          {selectedActiveBooking.driverName}
                        </Text>
                        <Text className="text-gray-600 text-sm">
                          Professional Driver
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center">
                      <Shield size={16} color="#059669" />
                      <Text className="text-green-600 font-semibold text-sm ml-1">
                        Verified
                      </Text>
                    </View>
                  </View>

                  <View className="bg-gray-50 rounded-lg p-3 mb-4">
                    <View className="flex-row items-center mb-2">
                      <MapPin size={16} color="#6b7280" />
                      <Text className="text-gray-700 font-medium text-sm ml-2">
                        Current Location
                      </Text>
                    </View>
                    <Text className="text-gray-800 text-sm">
                      {selectedActiveBooking.driverLocation.address}
                    </Text>
                  </View>

                  <TouchableOpacity
                    className="bg-blue-600 py-3 px-4 rounded-lg"
                    onPress={() =>
                      callDriver(selectedActiveBooking.driverPhone!)
                    }
                  >
                    <View className="flex-row items-center justify-center">
                      <Phone size={18} color="white" />
                      <Text className="text-white font-semibold ml-2">
                        Call {selectedActiveBooking.driverName}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Confidence Building Features */}
                <View className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <View className="flex-row items-center mb-3">
                    <Shield size={20} color="#059669" />
                    <Text className="text-green-900 font-bold ml-2">
                      Your Move is Protected
                    </Text>
                  </View>
                  <View className="space-y-2">
                    <View className="flex-row items-center">
                      <CheckCircle size={14} color="#059669" />
                      <Text className="text-green-800 text-sm ml-2">
                        Real-time GPS tracking active
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <CheckCircle size={14} color="#059669" />
                      <Text className="text-green-800 text-sm ml-2">
                        Fully insured and bonded driver
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <CheckCircle size={14} color="#059669" />
                      <Text className="text-green-800 text-sm ml-2">
                        24/7 customer support available
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal
        visible={showNotifications}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowNotifications(false)}
      >
        <View className="flex-1 justify-end bg-black/70">
          <View className="bg-white rounded-t-2xl p-6 max-h-4/5">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-900">
                Notifications
              </Text>
              <TouchableOpacity onPress={() => setShowNotifications(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {notifications.map((notification) => (
                <View
                  key={notification.id}
                  className={`p-4 rounded-lg mb-3 ${
                    notification.unread
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-gray-50"
                  }`}
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="font-semibold text-gray-900 mb-1">
                        {notification.title}
                      </Text>
                      <Text className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {notification.time}
                      </Text>
                    </View>
                    {notification.unread && (
                      <View className="bg-blue-500 rounded-full w-2 h-2 mt-1" />
                    )}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <View className="h-8" />
    </SafeAreaView>
  );
}
