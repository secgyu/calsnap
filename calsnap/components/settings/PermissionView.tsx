import { Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

interface PermissionViewProps {
  onRequestPermission: () => void;
  onPickImage: () => void;
}

export default function PermissionView({ onRequestPermission, onPickImage }: PermissionViewProps) {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
        paddingHorizontal: Spacing.xl,
      }}
    >
      <MaterialCommunityIcons name="camera-off" size={64} color={colors.textLight} />
      <Text
        style={{
          fontSize: FontSize.xl,
          fontWeight: "800",
          color: colors.text,
          marginTop: Spacing.lg,
          marginBottom: Spacing.sm,
        }}
      >
        카메라 권한이 필요해요
      </Text>
      <Text
        style={{
          fontSize: FontSize.md,
          color: colors.textSecondary,
          textAlign: "center",
          lineHeight: 22,
          marginBottom: Spacing.xl,
        }}
      >
        음식 사진을 촬영하려면{"\n"}카메라 접근 권한을 허용해주세요.
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: colors.primary,
          paddingHorizontal: Spacing.xl,
          paddingVertical: Spacing.md,
          borderRadius: BorderRadius.lg,
          marginBottom: Spacing.md,
        }}
        onPress={onRequestPermission}
      >
        <Text style={{ fontSize: FontSize.md, fontWeight: "700", color: "#FFFFFF" }}>권한 허용하기</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ padding: Spacing.sm }} onPress={onPickImage}>
        <Text style={{ fontSize: FontSize.sm, color: colors.primary, fontWeight: "600" }}>갤러리에서 선택하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
