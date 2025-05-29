import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import {
  Camera,
  Image as ImageIcon,
  Video,
  Upload,
  Plus,
  X,
} from "lucide-react-native";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";

interface MediaItem {
  uri: string;
  type: "photo" | "video";
  id: string;
}

interface MediaUploaderProps {
  onMediaCaptured?: (media: MediaItem[]) => void;
  isProcessing?: boolean;
}

const MediaUploader = ({
  onMediaCaptured = () => {},
  isProcessing = false,
}: MediaUploaderProps) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    // Default items for demonstration
    {
      uri: "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=400&q=80",
      type: "photo",
      id: "1",
    },
    {
      uri: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
      type: "photo",
      id: "2",
    },
  ]);

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You need to allow camera access to take photos");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const newMedia = {
        uri: result.assets[0].uri,
        type: "photo" as const,
        id: Date.now().toString(),
      };
      const updatedMedia = [...mediaItems, newMedia];
      setMediaItems(updatedMedia);
      onMediaCaptured(updatedMedia);
    }
  };

  const recordVideo = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You need to allow camera access to record videos");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      videoMaxDuration: 60,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newMedia = {
        uri: result.assets[0].uri,
        type: "video" as const,
        id: Date.now().toString(),
      };
      const updatedMedia = [...mediaItems, newMedia];
      setMediaItems(updatedMedia);
      onMediaCaptured(updatedMedia);
    }
  };

  const pickMedia = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You need to allow gallery access to upload media");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.8,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const newMedia = result.assets.map((asset) => ({
        uri: asset.uri,
        type: asset.type === "video" ? "video" : ("photo" as "photo" | "video"),
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      }));
      const updatedMedia = [...mediaItems, ...newMedia];
      setMediaItems(updatedMedia);
      onMediaCaptured(updatedMedia);
    }
  };

  const removeMedia = (id: string) => {
    const updatedMedia = mediaItems.filter((item) => item.id !== id);
    setMediaItems(updatedMedia);
    onMediaCaptured(updatedMedia);
  };

  return (
    <View className="bg-white p-4 rounded-lg shadow-sm w-full">
      <Text className="text-lg font-semibold text-center mb-2">
        Upload Media
      </Text>
      <Text className="text-sm text-gray-500 text-center mb-4">
        Take photos or videos of items to be moved. Include an A4 paper for
        scale.
      </Text>

      {/* Media capture buttons */}
      <View className="flex-row justify-around mb-6">
        <TouchableOpacity
          className="items-center"
          onPress={takePhoto}
          disabled={isProcessing}
        >
          <View className="bg-blue-100 p-4 rounded-full mb-2">
            <Camera size={24} color="#3b82f6" />
          </View>
          <Text className="text-sm text-gray-700">Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center"
          onPress={recordVideo}
          disabled={isProcessing}
        >
          <View className="bg-red-100 p-4 rounded-full mb-2">
            <Video size={24} color="#ef4444" />
          </View>
          <Text className="text-sm text-gray-700">Record Video</Text>
        </TouchableOpacity>
      </View>

      {/* A4 paper reminder */}
      <View className="bg-yellow-50 p-3 rounded-md mb-4 flex-row items-center">
        <ImageIcon size={20} color="#d97706" />
        <Text className="text-yellow-700 ml-2 text-sm">
          Remember to include an A4 paper in at least one photo for scale
          reference
        </Text>
      </View>

      {/* Media preview section */}
      <View className="mb-4">
        <Text className="text-md font-medium mb-2">Media Preview</Text>
        {mediaItems.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {mediaItems.map((item) => (
              <View key={item.id} className="mr-3 relative">
                <Image
                  source={{ uri: item.uri }}
                  className="w-20 h-20 rounded-md"
                />
                {item.type === "video" && (
                  <BlurView
                    intensity={30}
                    className="absolute bottom-0 left-0 right-0 py-1 items-center"
                  >
                    <Video size={16} color="#ffffff" />
                  </BlurView>
                )}
                <TouchableOpacity
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                  onPress={() => removeMedia(item.id)}
                  disabled={isProcessing}
                >
                  <X size={12} color="#ffffff" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              className="w-20 h-20 bg-gray-100 rounded-md items-center justify-center"
              onPress={pickMedia}
              disabled={isProcessing}
            >
              <Plus size={24} color="#9ca3af" />
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <View className="h-20 bg-gray-50 rounded-md items-center justify-center">
            <Text className="text-gray-400">No media uploaded yet</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default MediaUploader;
