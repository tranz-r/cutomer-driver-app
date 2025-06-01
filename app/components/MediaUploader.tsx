import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import {
  Camera,
  Image as ImageIcon,
  Video,
  Upload,
  Plus,
  X,
  Play,
  Eye,
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
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);

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

  const viewMedia = (media: MediaItem) => {
    setSelectedMedia(media);
    setShowMediaModal(true);
  };

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 w-full">
      {/* Header Section */}
      <View className="flex-row items-center mb-4">
        <View className="bg-blue-100 p-2 rounded-full mr-3">
          <Camera size={20} color="#3b82f6" />
        </View>
        <View>
          <Text className="text-xl font-bold text-gray-900">
            Capture Your Items
          </Text>
          <Text className="text-xs text-gray-500">
            AI-powered media capture
          </Text>
        </View>
      </View>

      <Text className="text-sm text-gray-600 text-center leading-relaxed mb-6">
        Take clear photos or videos of items to be moved.
        {"\n"}Include an A4 paper for accurate scale reference.
      </Text>

      {/* Media capture buttons */}
      <View className="flex-row justify-between mb-6">
        <TouchableOpacity
          className="items-center flex-1 mx-2"
          onPress={takePhoto}
          disabled={isProcessing}
        >
          <View className="bg-blue-500 p-4 rounded-2xl mb-2 w-16 h-16 items-center justify-center shadow-sm">
            <Camera size={24} color="#ffffff" />
          </View>
          <Text className="text-sm font-semibold text-gray-900 text-center">
            Take Photo
          </Text>
          <Text className="text-xs text-gray-500 text-center mt-1">
            From camera
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center flex-1 mx-2"
          onPress={recordVideo}
          disabled={isProcessing}
        >
          <View className="bg-red-500 p-4 rounded-2xl mb-2 w-16 h-16 items-center justify-center shadow-sm">
            <Video size={24} color="#ffffff" />
          </View>
          <Text className="text-sm font-semibold text-gray-900 text-center">
            Record Video
          </Text>
          <Text className="text-xs text-gray-500 text-center mt-1">
            From camera
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center flex-1 mx-2"
          onPress={pickMedia}
          disabled={isProcessing}
        >
          <View className="bg-purple-500 p-4 rounded-2xl mb-2 w-16 h-16 items-center justify-center shadow-sm">
            <Upload size={24} color="#ffffff" />
          </View>
          <Text className="text-sm font-semibold text-gray-900 text-center">
            Upload
          </Text>
          <Text className="text-xs text-gray-500 text-center mt-1">
            From gallery
          </Text>
        </TouchableOpacity>
      </View>

      {/* A4 paper reminder */}
      <View className="bg-amber-50 p-3 rounded-lg mb-4 border border-amber-200">
        <View className="flex-row items-center">
          <View className="bg-amber-100 p-1.5 rounded-full mr-2">
            <ImageIcon size={16} color="#d97706" />
          </View>
          <View className="flex-1">
            <Text className="text-amber-800 font-semibold text-sm mb-1">
              📄 Scale Reference Tip
            </Text>
            <Text className="text-amber-700 text-xs leading-relaxed">
              Place an A4 paper next to items in at least one photo for accurate
              size detection
            </Text>
          </View>
        </View>
      </View>

      {/* Media preview section */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold text-gray-900">Media Preview</Text>
          <View className="bg-blue-100 px-3 py-1 rounded-full">
            <Text className="text-blue-700 font-semibold text-sm">
              {mediaItems.length} media file{mediaItems.length !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>

        {mediaItems.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
            contentContainerStyle={{ paddingHorizontal: 4 }}
          >
            {mediaItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="mr-4 relative"
                onPress={() => viewMedia(item)}
                disabled={isProcessing}
              >
                <View className="relative">
                  <Image
                    source={{ uri: item.uri }}
                    className="w-28 h-28 rounded-xl shadow-md"
                    resizeMode="cover"
                  />

                  {/* Media type indicator */}
                  <View className="absolute top-2 left-2">
                    {item.type === "video" ? (
                      <View className="bg-red-500 p-1.5 rounded-full">
                        <Video size={12} color="#ffffff" />
                      </View>
                    ) : (
                      <View className="bg-blue-500 p-1.5 rounded-full">
                        <ImageIcon size={12} color="#ffffff" />
                      </View>
                    )}
                  </View>

                  {/* View overlay */}
                  <View className="absolute inset-0 bg-black/20 rounded-xl items-center justify-center">
                    <View className="bg-white/90 p-2 rounded-full">
                      {item.type === "video" ? (
                        <Play size={16} color="#374151" />
                      ) : (
                        <Eye size={16} color="#374151" />
                      )}
                    </View>
                  </View>
                </View>

                <View className="items-center mt-2">
                  <Text className="text-center text-xs text-gray-600 font-medium mb-2">
                    Tap to view
                  </Text>
                  <TouchableOpacity
                    className="bg-red-500 rounded-full p-1.5"
                    onPress={() => removeMedia(item.id)}
                    disabled={isProcessing}
                  >
                    <X size={12} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}

            {/* Add more button */}
            <TouchableOpacity
              className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl items-center justify-center border-2 border-dashed border-gray-300"
              onPress={pickMedia}
              disabled={isProcessing}
            >
              <Plus size={24} color="#6b7280" />
              <Text className="text-gray-600 text-xs font-medium mt-1">
                Add More
              </Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <View className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl items-center justify-center border-2 border-dashed border-gray-300">
            <ImageIcon size={32} color="#9ca3af" />
            <Text className="text-gray-500 text-base font-medium mt-2">
              No media uploaded yet
            </Text>
            <Text className="text-gray-400 text-sm">
              Start by taking a photo or video
            </Text>
          </View>
        )}
      </View>

      {/* Media Viewer Modal */}
      <Modal
        visible={showMediaModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMediaModal(false)}
      >
        <View className="flex-1 bg-black/90 justify-center items-center">
          <View className="w-full h-full relative">
            {selectedMedia && (
              <>
                {selectedMedia.type === "video" ? (
                  <View className="w-full h-full items-center justify-center">
                    <TouchableOpacity
                      className="bg-white/20 p-4 rounded-full"
                      onPress={() => {}}
                    >
                      <Play size={48} color="#ffffff" />
                    </TouchableOpacity>
                    <Text className="text-white mt-4 text-center">
                      Video playback not implemented yet
                    </Text>
                  </View>
                ) : (
                  <Image
                    source={{ uri: selectedMedia.uri }}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                )}

                {/* Close button */}
                <TouchableOpacity
                  className="absolute top-16 right-6 bg-black/50 p-3 rounded-full"
                  onPress={() => setShowMediaModal(false)}
                >
                  <X size={24} color="#ffffff" />
                </TouchableOpacity>

                {/* Media info */}
                <View className="absolute bottom-16 left-6 right-6">
                  <View className="bg-black/70 p-4 rounded-xl">
                    <View className="flex-row items-center">
                      {selectedMedia.type === "video" ? (
                        <Video size={20} color="#ffffff" />
                      ) : (
                        <ImageIcon size={20} color="#ffffff" />
                      )}
                      <Text className="text-white font-semibold text-lg ml-2">
                        {selectedMedia.type === "video" ? "Video" : "Photo"}
                      </Text>
                    </View>
                    <Text className="text-white/80 text-sm mt-1">
                      Tap outside to close
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MediaUploader;
