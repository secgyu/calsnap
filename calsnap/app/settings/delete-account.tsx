import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { deleteAccount } from "@/services/user";
import { logout } from "@/services/auth";

const CONFIRM_TEXT = "탈퇴합니다";

export default function DeleteAccountScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const isConfirmed = input === CONFIRM_TEXT;

  const handleDelete = async () => {
    if (!isConfirmed) return;
    setLoading(true);
    try {
      await deleteAccount();
      await logout();
      router.replace("/(auth)/login");
    } catch {
      Alert.alert("오류", "회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.md,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: FontSize.lg, fontWeight: "700", color: colors.text }}>회원 탈퇴</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: "center", marginBottom: Spacing.lg }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "#FEE2E2",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons name="alert-circle" size={48} color={colors.error} />
          </View>
        </View>

        <Text
          style={{
            fontSize: FontSize.xxl,
            fontWeight: "800",
            color: colors.text,
            textAlign: "center",
            marginBottom: Spacing.lg,
          }}
        >
          정말 탈퇴하시겠습니까?
        </Text>

        <View
          style={{
            backgroundColor: "#FEE2E2",
            borderRadius: BorderRadius.md,
            padding: Spacing.lg,
            marginBottom: Spacing.xl,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: Spacing.sm }}>
            <MaterialCommunityIcons name="alert" size={18} color={colors.error} />
            <Text style={{ fontSize: FontSize.sm, fontWeight: "700", color: colors.error, marginLeft: Spacing.xs }}>
              탈퇴 전 확인해 주세요
            </Text>
          </View>
          {[
            "모든 식사 기록이 영구 삭제됩니다",
            "체중 기록 및 목표 설정이 삭제됩니다",
            "삭제된 데이터는 복구할 수 없습니다",
          ].map((text) => (
            <View
              key={text}
              style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 6, paddingLeft: 4 }}
            >
              <Text style={{ fontSize: FontSize.sm, color: colors.error, marginRight: 8 }}>•</Text>
              <Text style={{ fontSize: FontSize.sm, color: colors.error, flex: 1 }}>{text}</Text>
            </View>
          ))}
        </View>

        <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary, marginBottom: Spacing.sm }}>
          탈퇴를 확인하려면 &apos;{CONFIRM_TEXT}&apos;를 입력하세요
        </Text>
        <TextInput
          style={{
            backgroundColor: colors.card,
            borderRadius: BorderRadius.md,
            borderWidth: 1,
            borderColor: input.length > 0 && !isConfirmed ? colors.error : colors.divider,
            padding: Spacing.md,
            fontSize: FontSize.md,
            color: colors.text,
            marginBottom: Spacing.xl,
          }}
          placeholder={CONFIRM_TEXT}
          placeholderTextColor={colors.textLight}
          value={input}
          onChangeText={setInput}
        />

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          style={{
            backgroundColor: isConfirmed ? colors.error : "#FCA5A5",
            borderRadius: BorderRadius.lg,
            paddingVertical: Spacing.md,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: Spacing.sm,
            marginBottom: Spacing.sm,
            opacity: isConfirmed ? 1 : 0.5,
          }}
          onPress={handleDelete}
          disabled={!isConfirmed || loading}
        >
          <MaterialCommunityIcons name="close-box" size={20} color="#FFFFFF" />
          <Text style={{ fontSize: FontSize.md, fontWeight: "700", color: "#FFFFFF" }}>
            {loading ? "처리 중..." : "탈퇴하기"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: colors.card,
            borderRadius: BorderRadius.lg,
            paddingVertical: Spacing.md,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.divider,
            marginBottom: Spacing.xxl,
          }}
          onPress={() => router.back()}
        >
          <Text style={{ fontSize: FontSize.md, fontWeight: "700", color: colors.text }}>취소</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
