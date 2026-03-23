import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { getUserProfile } from "@/services/user";
import { logout as logoutApi } from "@/services/auth";
import { isBiometricAvailable, isBiometricEnabled, setBiometricEnabled, getBiometricType } from "@/services/biometric";
import SectionGroup, { SettingItem } from "@/components/settings/SectionGroup";

export default function SettingsScreen() {
  const router = useRouter();
  const { isDark, setDarkMode, colors } = useTheme();
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [mealReminder, setMealReminder] = useState(true);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricOn, setBiometricOn] = useState(false);
  const [biometricLabel, setBiometricLabel] = useState("생체 인증");
  const [user, setUser] = useState({ name: "", email: "", height: 0, weight: 0, goalCalorie: 0 });

  useEffect(() => {
    getUserProfile()
      .then((u) =>
        setUser({
          name: u.name,
          email: u.email,
          height: u.height || 0,
          weight: u.weight || 0,
          goalCalorie: u.goalCalorie || 0,
        }),
      )
      .catch(() => {});

    (async () => {
      const available = await isBiometricAvailable();
      setBiometricAvailable(available);
      if (available) {
        const enabled = await isBiometricEnabled();
        setBiometricOn(enabled);
        const label = await getBiometricType();
        setBiometricLabel(label);
      }
    })();
  }, []);

  const handleBiometricToggle = async (value: boolean) => {
    setBiometricOn(value);
    await setBiometricEnabled(value);
  };

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          await logoutApi();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert("회원 탈퇴", "모든 데이터가 삭제되며 복구할 수 없습니다.\n정말 탈퇴하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "탈퇴하기", style: "destructive", onPress: () => router.replace("/(auth)/login") },
    ]);
  };

  const profileSection: SettingItem[] = [
    {
      icon: "account-edit-outline",
      label: "프로필 수정",
      value: user.name,
      onPress: () => router.push("/settings/profile"),
    },
    {
      icon: "target",
      label: "목표 설정",
      value: `${user.goalCalorie} kcal`,
      onPress: () => router.push("/settings/goal"),
    },
    {
      icon: "human-male-height",
      label: "신체 정보",
      value: `${user.height}cm / ${user.weight}kg`,
      onPress: () => router.push("/settings/body"),
    },
  ];

  const notificationSection: SettingItem[] = [
    {
      icon: "bell-outline",
      label: "푸시 알림",
      type: "toggle",
      toggleValue: notificationEnabled,
      onToggle: setNotificationEnabled,
    },
    {
      icon: "food-apple-outline",
      label: "식사 리마인더",
      type: "toggle",
      toggleValue: mealReminder,
      onToggle: setMealReminder,
    },
  ];

  const appSection: SettingItem[] = [
    { icon: "theme-light-dark", label: "다크 모드", type: "toggle", toggleValue: isDark, onToggle: setDarkMode },
    ...(biometricAvailable
      ? [
          {
            icon: "face-recognition" as const,
            label: biometricLabel,
            type: "toggle" as const,
            toggleValue: biometricOn,
            onToggle: handleBiometricToggle,
          },
        ]
      : []),
    { icon: "information-outline", label: "앱 버전", value: "v1.0.0" },
    { icon: "file-document-outline", label: "이용약관", onPress: () => router.push("/settings/terms") },
    { icon: "shield-lock-outline", label: "개인정보처리방침", onPress: () => router.push("/settings/privacy") },
  ];

  const dangerSection: SettingItem[] = [
    { icon: "logout", label: "로그아웃", type: "danger", onPress: handleLogout },
    { icon: "account-remove-outline", label: "회원 탈퇴", type: "danger", onPress: handleDeleteAccount },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl }}
      >
        <Text
          style={{
            fontSize: FontSize.xxl,
            fontWeight: "800",
            color: colors.text,
            marginTop: Spacing.md,
            marginBottom: Spacing.lg,
          }}
        >
          설정
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.card,
            borderRadius: BorderRadius.lg,
            padding: Spacing.lg,
            borderWidth: 1,
            borderColor: colors.divider,
            marginBottom: Spacing.md,
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: colors.primary,
              justifyContent: "center",
              alignItems: "center",
              marginRight: Spacing.md,
            }}
          >
            <MaterialCommunityIcons name="account" size={32} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: FontSize.lg, fontWeight: "800", color: colors.text }}>
              {user.name || "사용자"}
            </Text>
            <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary, marginTop: 2 }}>{user.email}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/settings/profile")}>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colors.primary,
            borderRadius: BorderRadius.lg,
            padding: Spacing.lg,
            marginBottom: Spacing.lg,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing.md }}>
            <MaterialCommunityIcons name="fire" size={24} color="#FFFFFF" />
            <View>
              <Text style={{ fontSize: FontSize.xs, color: "rgba(255,255,255,0.8)" }}>일일 칼로리 목표</Text>
              <Text style={{ fontSize: FontSize.xl, fontWeight: "800", color: "#FFFFFF" }}>
                {user.goalCalorie || 0} kcal
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "rgba(255,255,255,0.25)",
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.xs,
              borderRadius: 9999,
            }}
            onPress={() => router.push("/settings/goal")}
          >
            <Text style={{ fontSize: FontSize.sm, fontWeight: "700", color: "#FFFFFF" }}>수정</Text>
          </TouchableOpacity>
        </View>

        <SectionGroup title="내 정보" items={profileSection} colors={colors} />
        <SectionGroup title="알림" items={notificationSection} colors={colors} />
        <SectionGroup title="앱 설정" items={appSection} colors={colors} />
        <SectionGroup title="" items={dangerSection} colors={colors} />
      </ScrollView>
    </SafeAreaView>
  );
}
