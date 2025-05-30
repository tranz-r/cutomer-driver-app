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
  Calendar,
  Clock,
  Percent,
  CheckCircle,
  Circle,
} from "lucide-react-native";
import { router } from "expo-router";

type TimeSlot = {
  id: string;
  time: string;
  period: string;
};

export default function DateTimeScreen() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedHours, setSelectedHours] = useState(3);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("morning");
  const [isFlexibleTime, setIsFlexibleTime] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showHoursPicker, setShowHoursPicker] = useState(false);

  const timeSlots: TimeSlot[] = [
    { id: "morning", time: "8:00 - 12:00", period: "Morning" },
    { id: "afternoon", time: "12:00 - 16:00", period: "Afternoon" },
    { id: "evening", time: "16:00 - 20:00", period: "Evening" },
  ];

  const hourOptions = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // Mock data - in real app this would come from previous screens
  const vanPrice = 85; // £85/hour for Luton Van
  const crewCost = 25; // £25/hour for 1 helper
  const flexibleDiscount = 15; // 15% discount for flexible time

  const calculateQuote = () => {
    const baseRate = vanPrice + crewCost;
    const subtotal = baseRate * selectedHours;
    const discount = isFlexibleTime ? (subtotal * flexibleDiscount) / 100 : 0;
    const discountedTotal = subtotal - discount;
    const vat = discountedTotal * 0.2;
    const total = discountedTotal + vat;

    return {
      baseRate,
      subtotal,
      discount,
      discountedTotal,
      vat,
      total,
    };
  };

  const quote = calculateQuote();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const handleContinue = () => {
    console.log("Selected Date:", selectedDate);
    console.log("Selected Hours:", selectedHours);
    console.log("Selected Time Slot:", selectedTimeSlot);
    console.log("Flexible Time:", isFlexibleTime);
    console.log("Quote:", quote);
    router.push("/summary");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#1f2937" />
      <View className="bg-gray-800 h-12" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-4 pt-8">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Date & Time
          </Text>
          <Text className="text-sm text-gray-600 mb-6">
            Select your preferred moving date, duration, and time slot.
          </Text>

          {/* Date Selection */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Moving Date
            </Text>
            <TouchableOpacity
              className="flex-row items-center border border-gray-300 rounded-lg p-4 bg-white"
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={20} color="#3b82f6" />
              <Text className="flex-1 ml-3 text-base text-gray-800">
                {formatDate(selectedDate)}
              </Text>
              <ChevronRight size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Hours Selection */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Duration (Minimum 3 hours)
            </Text>
            <TouchableOpacity
              className="flex-row items-center border border-gray-300 rounded-lg p-4 bg-white"
              onPress={() => setShowHoursPicker(true)}
            >
              <Clock size={20} color="#10b981" />
              <Text className="flex-1 ml-3 text-base text-gray-800">
                {selectedHours} hour{selectedHours > 1 ? "s" : ""}
              </Text>
              <ChevronRight size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Flexible Time Option */}
          <View className="mb-6">
            <TouchableOpacity
              className="flex-row items-center p-4 bg-orange-50 border border-orange-200 rounded-lg"
              onPress={() => setIsFlexibleTime(!isFlexibleTime)}
            >
              {isFlexibleTime ? (
                <CheckCircle size={24} color="#f59e0b" />
              ) : (
                <Circle size={24} color="#f59e0b" />
              )}
              <View className="flex-1 ml-3">
                <Text className="text-base font-semibold text-orange-800">
                  Flexible Time
                </Text>
                <Text className="text-sm text-orange-700 mt-1">
                  Save {flexibleDiscount}% (£{quote.discount.toFixed(2)}) by
                  being flexible with your time slot
                </Text>
              </View>
              <Percent size={20} color="#f59e0b" />
            </TouchableOpacity>
          </View>

          {/* Time Slots */}
          {!isFlexibleTime && (
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Preferred Time Slot
              </Text>
              <View className="space-y-3">
                {timeSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot.id}
                    className={`p-4 rounded-lg border-2 ${
                      selectedTimeSlot === slot.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white"
                    }`}
                    onPress={() => setSelectedTimeSlot(slot.id)}
                    style={{ marginBottom: 12 }}
                  >
                    <View className="flex-row items-center justify-between">
                      <View>
                        <Text className="text-base font-semibold text-gray-800">
                          {slot.period}
                        </Text>
                        <Text className="text-sm text-gray-600">
                          {slot.time}
                        </Text>
                      </View>
                      <Clock
                        size={20}
                        color={
                          selectedTimeSlot === slot.id ? "#3b82f6" : "#9ca3af"
                        }
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Your Selection Summary */}
          <View className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Your Selection
            </Text>
            <View className="space-y-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-base text-gray-600">Van:</Text>
                <Text className="text-base font-semibold text-gray-900">
                  Luton Van
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-base text-gray-600">Crew:</Text>
                <Text className="text-base font-semibold text-gray-900">
                  2 persons
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-base text-gray-600">Date:</Text>
                <Text className="text-base font-semibold text-gray-900">
                  {selectedDate.toLocaleDateString("en-GB")}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-base text-gray-600">Duration:</Text>
                <Text className="text-base font-semibold text-gray-900">
                  {selectedHours} hour{selectedHours > 1 ? "s" : ""}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-base text-gray-600">Time:</Text>
                <Text className="text-base font-semibold text-gray-900">
                  {isFlexibleTime
                    ? "Flexible"
                    : timeSlots.find((t) => t.id === selectedTimeSlot)?.period}
                </Text>
              </View>
              <View className="border-t border-blue-200 mt-4 pt-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-base text-gray-600">
                    Base Rate (£{quote.baseRate}/hour):
                  </Text>
                  <Text className="text-base font-semibold text-gray-900">
                    £{quote.subtotal.toFixed(2)}
                  </Text>
                </View>
                {isFlexibleTime && (
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-base text-green-600">
                      Flexible Time Discount ({flexibleDiscount}%):
                    </Text>
                    <Text className="text-base font-semibold text-green-600">
                      -£{quote.discount.toFixed(2)}
                    </Text>
                  </View>
                )}
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-base text-gray-600">VAT (20%):</Text>
                  <Text className="text-base font-semibold text-gray-900">
                    £{quote.vat.toFixed(2)}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-lg font-bold text-gray-900">
                    Total Estimated:
                  </Text>
                  <Text className="text-lg font-bold text-blue-600">
                    £{quote.total.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            className="py-5 px-8 rounded-2xl flex-row justify-center items-center shadow-lg bg-blue-600"
            onPress={handleContinue}
          >
            <Text className="text-white text-center font-bold text-lg mr-3">
              Continue to Summary
            </Text>
            <ChevronRight size={22} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-xl p-6">
            <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
              Select Moving Date
            </Text>
            <ScrollView className="max-h-80">
              {generateDateOptions().map((date, index) => (
                <TouchableOpacity
                  key={index}
                  className={`p-4 border-b border-gray-100 ${
                    selectedDate.toDateString() === date.toDateString()
                      ? "bg-blue-50"
                      : ""
                  }`}
                  onPress={() => {
                    setSelectedDate(date);
                    setShowDatePicker(false);
                  }}
                >
                  <Text
                    className={`text-base ${
                      selectedDate.toDateString() === date.toDateString()
                        ? "text-blue-600 font-semibold"
                        : "text-gray-800"
                    }`}
                  >
                    {formatDate(date)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              className="mt-4 bg-gray-200 py-3 rounded-lg"
              onPress={() => setShowDatePicker(false)}
            >
              <Text className="text-center text-gray-700 font-medium">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Hours Picker Modal */}
      <Modal
        visible={showHoursPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHoursPicker(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-xl p-6">
            <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
              Select Duration
            </Text>
            <ScrollView className="max-h-80">
              {hourOptions.map((hours) => (
                <TouchableOpacity
                  key={hours}
                  className={`p-4 border-b border-gray-100 ${
                    selectedHours === hours ? "bg-blue-50" : ""
                  }`}
                  onPress={() => {
                    setSelectedHours(hours);
                    setShowHoursPicker(false);
                  }}
                >
                  <Text
                    className={`text-base ${
                      selectedHours === hours
                        ? "text-blue-600 font-semibold"
                        : "text-gray-800"
                    }`}
                  >
                    {hours} hour{hours > 1 ? "s" : ""}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              className="mt-4 bg-gray-200 py-3 rounded-lg"
              onPress={() => setShowHoursPicker(false)}
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
