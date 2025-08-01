import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing, Dimensions, SafeAreaView } from "react-native";
import { router } from "expo-router";
import { Truck } from "lucide-react-native";
import Svg, { Path } from "react-native-svg";

const { width: screenWidth } = Dimensions.get("window");

export default function SplashScreen() {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(-50)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleSlide = useRef(new Animated.Value(50)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const truckPosition = useRef(new Animated.Value(-screenWidth)).current;
  const truckBounce = useRef(new Animated.Value(0)).current;
  const roadOpacity = useRef(new Animated.Value(0)).current;
  const backgroundGradient = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sophisticated sequence of animations
    const animationSequence = Animated.sequence([
      // Phase 1: Background gradient fade in
      Animated.timing(backgroundGradient, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),

      // Phase 2: Logo entrance with scale, rotation and fade
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(logoRotation, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),

      // Phase 3: Title slide in from left
      Animated.parallel([
        Animated.timing(titleSlide, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),

      // Phase 4: Subtitle slide in from right
      Animated.parallel([
        Animated.timing(subtitleSlide, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),

      // Phase 5: Road appears
      Animated.timing(roadOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),

      // Phase 6: Truck drives across with bounce effect
      Animated.parallel([
        Animated.timing(truckPosition, {
          toValue: screenWidth + 50,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(truckBounce, {
              toValue: -3,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(truckBounce, {
              toValue: 3,
              duration: 150,
              useNativeDriver: true,
            }),
          ]),
          { iterations: 7 },
        ),
      ]),
    ]);

    animationSequence.start();

    const timer = setTimeout(() => {
      router.replace("/landing");
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const logoRotationInterpolate = logoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView className="flex-1" style={{
      backgroundColor: "#7080cc",
    }}>
      <Animated.View
        className="flex-1 justify-center items-center px-4"
        style={{
          backgroundColor: backgroundGradient.interpolate({
            inputRange: [0, 1],
            outputRange: ["#7080cc", "#7080cc"],
          }),
        }}
      >

      <View className="items-center w-full max-w-sm">
        {/* Animated Logo */}
        <Animated.View
          className="mb-6"
          style={{
            opacity: logoOpacity,
            transform: [
              { scale: logoScale },
              { rotate: logoRotationInterpolate },
            ],
          }}
        >
          <Svg width={100} height={85} viewBox="0 0 263 231">
            <Path
              d="M 182,187 181,188 180,188 179,189 179,190 178,191 178,195 181,198 182,198 183,199 185,199 186,200 188,200 189,201 190,201 191,202 191,204 190,205 185,205 182,202 178,202 178,205 182,209 184,209 185,210 189,210 190,209 192,209 193,208 194,208 195,207 195,206 196,205 196,201 195,200 195,199 194,198 193,198 192,197 191,197 190,196 188,196 187,195 185,195 183,193 183,192 184,191 189,191 190,192 190,193 195,193 195,191 193,189 193,188 192,188 191,187 Z"
              fill="#ffffff"
            />
            <Path
              d="M 155,187 155,210 171,210 171,205 161,205 160,204 160,201 161,200 170,200 170,196 161,196 160,195 160,193 161,192 170,192 171,191 171,187 Z"
              fill="#ffffff"
            />
            <Path
              d="M 126,187 125,188 126,189 126,191 127,192 127,193 128,194 128,197 129,198 129,200 130,201 130,202 131,203 131,205 132,206 132,208 134,210 139,210 139,209 140,208 140,206 141,205 141,203 142,202 142,200 143,199 143,198 144,197 144,194 145,193 145,192 146,191 146,189 147,188 146,187 142,187 141,188 141,189 140,190 140,192 139,193 139,197 138,198 138,199 137,200 137,202 136,203 135,202 135,200 134,199 134,198 133,197 133,194 132,193 132,191 131,190 131,188 130,187 Z"
              fill="#ffffff"
            />
            <Path
              d="M 104,187 103,188 102,188 98,192 98,193 97,194 97,203 98,204 98,205 101,208 102,208 103,209 104,209 105,210 111,210 112,209 114,209 118,205 118,204 119,203 119,194 118,193 118,192 114,188 113,188 112,187 Z"
              fill="#ffffff"
            />
            <Path
              d="M 64,187 64,209 65,210 67,210 69,208 69,197 70,196 71,197 71,199 72,200 72,201 74,203 74,204 75,205 75,206 76,207 76,208 77,208 77,207 79,205 79,204 80,203 80,202 81,201 81,200 82,199 82,198 83,197 84,198 84,210 88,210 89,209 89,187 83,187 82,188 82,190 80,192 80,193 79,194 79,195 78,196 78,197 77,198 76,198 75,197 75,196 74,195 74,194 72,192 72,190 70,188 70,187 Z"
              fill="#ffffff"
            />
            <Path
              d="M 202,142 202,175 210,175 210,165 211,164 214,164 216,166 216,167 217,168 217,169 218,170 218,171 219,172 219,173 221,175 229,175 229,174 228,173 228,172 227,171 227,170 226,169 226,168 224,166 224,165 222,163 224,161 225,161 226,160 226,159 227,158 227,157 228,156 228,149 227,148 227,147 223,143 222,143 221,142 Z"
              fill="#ffffff"
            />
            <Path
              d="M 172,142 171,143 171,148 172,149 185,149 186,150 181,155 181,156 177,160 177,161 174,164 174,165 171,168 171,175 197,175 197,167 183,167 182,166 186,162 186,161 189,158 189,157 193,153 193,152 197,148 197,142 Z"
              fill="#ffffff"
            />
            <Path
              d="M 135,142 135,175 142,175 143,174 142,173 142,157 143,156 146,159 146,160 147,161 147,162 150,165 150,166 152,168 152,169 154,171 154,172 157,175 164,175 165,174 165,142 157,142 157,159 156,160 154,158 154,157 151,154 151,153 149,151 149,150 147,148 147,147 145,145 145,144 143,142 Z"
              fill="#ffffff"
            />
            <Path
              d="M 108,142 108,143 107,144 107,147 106,148 106,149 105,150 105,151 104,152 104,154 103,155 103,158 102,159 102,160 101,161 101,162 100,163 100,166 99,167 99,168 98,169 98,171 97,172 97,173 96,174 97,175 98,174 99,175 100,175 101,174 102,175 104,175 105,174 105,173 106,172 106,170 107,169 119,169 120,170 120,171 121,172 121,174 122,175 129,175 129,171 128,170 128,169 127,168 127,166 126,165 126,163 125,162 125,160 124,159 124,157 123,156 123,155 122,154 122,151 121,150 121,149 120,148 120,146 119,145 119,143 118,142 Z"
              fill="#ffffff"
            />
            <Path
              d="M 65,142 65,175 72,175 73,174 73,165 74,164 77,164 79,166 79,167 80,168 80,169 82,171 82,173 84,175 92,175 92,173 90,171 90,170 89,169 89,168 88,167 88,166 86,164 86,162 87,161 88,161 90,159 90,157 91,156 91,148 90,147 90,146 88,144 87,144 86,143 85,143 84,142 Z"
              fill="#ffffff"
            />
            <Path
              d="M 31,142 31,148 32,149 40,149 41,150 41,174 42,175 49,175 49,150 50,149 59,149 59,142 Z"
              fill="#ffffff"
            />
            <Path
              d="M 183,86 182,87 180,87 175,92 175,94 174,95 174,103 175,104 175,106 179,110 180,110 181,111 182,111 183,112 190,112 191,111 192,111 193,110 194,110 197,107 197,106 198,105 198,104 199,103 199,95 198,94 198,92 194,88 193,88 192,87 191,87 190,86 Z"
              fill="#ffffff"
            />
            <Path
              d="M 91,86 90,87 88,87 87,88 86,88 85,89 85,90 82,93 82,96 81,97 81,101 82,102 82,105 87,110 88,110 89,111 90,111 91,112 97,112 98,111 100,111 101,110 102,110 105,107 105,106 106,105 106,104 107,103 107,95 106,94 106,93 105,92 105,91 102,88 101,88 100,87 98,87 97,86 Z"
              fill="#ffffff"
            />
            <Path
              d="M 57,17 56,18 55,18 53,20 53,28 92,28 96,32 94,34 38,34 36,36 36,43 37,44 77,44 78,45 79,45 81,47 81,48 79,50 48,50 46,52 46,57 48,59 124,59 124,48 125,47 125,46 126,45 128,45 129,46 130,46 133,49 134,49 138,53 139,53 143,57 144,57 147,60 148,60 152,64 152,65 148,69 147,69 144,72 143,72 139,76 138,76 134,80 133,80 130,83 129,83 127,85 126,85 125,84 125,71 124,70 55,70 54,71 54,96 56,98 57,98 58,99 75,99 75,97 76,96 76,92 77,91 77,90 79,88 79,87 82,84 83,84 85,82 86,82 87,81 89,81 90,80 98,80 99,81 102,81 104,83 105,83 110,88 110,89 111,90 111,91 112,92 112,94 113,95 113,98 114,99 167,99 167,98 168,97 168,93 169,92 169,90 172,87 172,86 173,85 174,85 177,82 178,82 179,81 181,81 182,80 191,80 192,81 194,81 195,82 196,82 203,89 203,90 204,91 204,92 205,93 205,97 206,98 206,99 218,99 221,96 221,87 219,87 217,85 217,62 215,60 215,59 214,58 214,57 212,55 212,54 211,53 211,52 210,51 210,50 208,48 208,47 207,46 207,45 205,43 205,42 204,41 204,40 203,39 203,38 201,36 201,35 200,34 199,34 196,31 195,31 194,30 169,30 168,29 168,21 167,20 167,19 166,19 164,17 Z"
              fill="#ffffff"
            />
          </Svg>
        </Animated.View>

        {/* Animated Subtitle */}
        <Animated.View
          style={{
            opacity: subtitleOpacity,
            transform: [{ translateX: subtitleSlide }],
          }}
        >
          <Text className="text-lg text-blue-100 text-center mb-12">
            Moving Made Simple
          </Text>
        </Animated.View>

        {/* Animated Road and Truck */}
        <View className="w-full h-20 relative overflow-hidden">
          {/* Road with dashed lines */}
          <Animated.View
            className="absolute bottom-6 left-0 right-0 h-1 bg-blue-200"
            style={{ opacity: roadOpacity }}
          />
          <Animated.View
            className="absolute bottom-5 left-0 right-0 h-0.5 bg-white opacity-60"
            style={{ opacity: roadOpacity }}
          />

          {/* Animated Truck */}
          <Animated.View
            className="absolute top-2"
            style={{
              transform: [
                { translateX: truckPosition },
                { translateY: truckBounce },
              ],
            }}
          >
            <View className="bg-white rounded-lg p-2 shadow-lg">
              <Truck size={28} color="#3b82f6" />
            </View>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
    </SafeAreaView>
  );
}
