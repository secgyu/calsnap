import { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import PermissionView from "@/components/settings/PermissionView";

export default function CameraScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"back" | "front">("back");
  const cameraRef = useRef<CameraView>(null);

  const takePicture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8, base64: false });
      if (photo?.uri) router.push({ pathname: "/analysis/loading", params: { imageUri: photo.uri } });
    } catch {
      Alert.alert("오류", "사진 촬영에 실패했습니다.");
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8 });
    if (!result.canceled && result.assets[0]) {
      router.push({ pathname: "/analysis/loading", params: { imageUri: result.assets[0].uri } });
    }
  };

  if (!permission) return <View style={styles.container} />;
  if (!permission.granted) return <PermissionView onRequestPermission={requestPermission} onPickImage={pickImage} />;

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <SafeAreaView style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>음식 촬영</Text>
          <TouchableOpacity onPress={() => setFacing(facing === "back" ? "front" : "back")}>
            <MaterialCommunityIcons name="camera-flip-outline" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </SafeAreaView>

        <View style={styles.guideContainer}>
          <View style={styles.guideFrame}>
            <View
              style={[
                styles.corner,
                { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 12 },
              ]}
            />
            <View
              style={[
                styles.corner,
                { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 12 },
              ]}
            />
            <View
              style={[
                styles.corner,
                { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 12 },
              ]}
            />
            <View
              style={[
                styles.corner,
                { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 12 },
              ]}
            />
          </View>
          <View style={styles.guideBadge}>
            <Text style={styles.guideText}>음식을 프레임 안에 맞춰주세요</Text>
          </View>
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.sideButton} onPress={pickImage}>
            <MaterialCommunityIcons name="image-outline" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shutterButton} onPress={takePicture}>
            <View style={styles.shutterInner} />
          </TouchableOpacity>
          <View style={styles.sideButton} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  camera: { flex: 1 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  topTitle: { fontSize: FontSize.lg, fontWeight: "700", color: "#FFFFFF" },
  guideContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  guideFrame: { width: 260, height: 260, position: "relative" },
  corner: { position: "absolute", width: 24, height: 24, borderColor: "#FFFFFF" },
  guideBadge: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.lg,
  },
  guideText: { fontSize: FontSize.sm, color: "#FFFFFF", fontWeight: "500" },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 48,
    paddingHorizontal: Spacing.xl,
  },
  sideButton: { width: 48, height: 48, borderRadius: 24, justifyContent: "center", alignItems: "center" },
  shutterButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  shutterInner: { width: 58, height: 58, borderRadius: 29, backgroundColor: "#FFFFFF" },
});
