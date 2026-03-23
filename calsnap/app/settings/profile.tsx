import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import Button from "@/components/ui/Button";

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [name, setName] = useState("홍길동");
  const [email] = useState("test@test.com");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.md,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: FontSize.lg, fontWeight: "700", color: colors.primary }}>프로필 수정</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ alignItems: "center", marginBottom: Spacing.xl }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: colors.primary,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: Spacing.sm,
            }}
          >
            <MaterialCommunityIcons name="account" size={48} color="#FFFFFF" />
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primaryLight,
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.xs,
              borderRadius: 9999,
            }}
          >
            <Text style={{ fontSize: FontSize.sm, fontWeight: "600", color: colors.primary }}>사진 변경</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: Spacing.lg }}>
          <Text style={{ fontSize: FontSize.sm, fontWeight: "600", color: colors.text, marginBottom: Spacing.xs }}>
            이름
          </Text>
          <TextInput
            style={{
              backgroundColor: colors.card,
              borderRadius: BorderRadius.md,
              borderWidth: 1,
              borderColor: colors.border,
              paddingHorizontal: Spacing.md,
              height: 48,
              fontSize: FontSize.md,
              color: colors.text,
            }}
            value={name}
            onChangeText={setName}
            placeholder="이름을 입력하세요"
            placeholderTextColor={colors.textLight}
          />
        </View>

        <View style={{ marginBottom: Spacing.lg }}>
          <Text style={{ fontSize: FontSize.sm, fontWeight: "600", color: colors.text, marginBottom: Spacing.xs }}>
            이메일
          </Text>
          <View
            style={{
              backgroundColor: colors.divider,
              borderRadius: BorderRadius.md,
              borderWidth: 1,
              borderColor: colors.border,
              paddingHorizontal: Spacing.md,
              height: 48,
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: FontSize.md, color: colors.textLight }}>{email}</Text>
          </View>
          <Text style={{ fontSize: FontSize.xs, color: colors.textLight, marginTop: 4 }}>
            이메일은 변경할 수 없습니다
          </Text>
        </View>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.primaryLight,
            padding: Spacing.md,
            borderRadius: BorderRadius.lg,
            gap: Spacing.sm,
          }}
        >
          <MaterialCommunityIcons name="lock-reset" size={20} color={colors.primary} />
          <Text style={{ flex: 1, fontSize: FontSize.md, fontWeight: "600", color: colors.primary }}>
            비밀번호 변경
          </Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.primary} />
        </TouchableOpacity>

        <Button
          title="저장하기"
          onPress={() => {
            Alert.alert("저장 완료", "프로필이 업데이트되었습니다.");
            router.back();
          }}
          disabled={!name.trim()}
          style={{ marginTop: Spacing.xl }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
