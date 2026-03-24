import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

const STORAGE_KEY = "@calsnap_notifications";

interface NotificationSettings {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  weight: boolean;
  weeklyReport: boolean;
  goalAchieved: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  breakfast: true,
  lunch: true,
  dinner: true,
  weight: true,
  weeklyReport: true,
  goalAchieved: true,
};

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) setSettings(JSON.parse(val));
    });
  }, []);

  const toggle = (key: keyof NotificationSettings) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const mealAlarms = [
    { key: "breakfast" as const, icon: "weather-sunny", label: "아침 식사 알림", time: "오전 8:00" },
    { key: "lunch" as const, icon: "weather-partly-cloudy", label: "점심 식사 알림", time: "오후 12:00" },
    { key: "dinner" as const, icon: "weather-night", label: "저녁 식사 알림", time: "오후 7:00" },
  ];

  const otherAlarms = [
    { key: "weight" as const, icon: "scale-bathroom", label: "체중 기록 알림", time: "오전 7:00" },
    { key: "weeklyReport" as const, icon: "chart-bar", label: "주간 리포트 알림", time: "" },
    { key: "goalAchieved" as const, icon: "trophy-outline", label: "목표 달성 축하 알림", time: "" },
  ];

  const renderToggleItem = (item: { key: keyof NotificationSettings; icon: string; label: string; time: string }) => (
    <View
      key={item.key}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.card,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: colors.divider,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.primaryLight,
          justifyContent: "center",
          alignItems: "center",
          marginRight: Spacing.md,
        }}
      >
        <MaterialCommunityIcons name={item.icon as any} size={18} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: FontSize.md, fontWeight: "600", color: colors.text }}>{item.label}</Text>
        {item.time ? (
          <Text
            style={{
              fontSize: FontSize.xs,
              color: colors.textSecondary,
              backgroundColor: colors.divider,
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 4,
              alignSelf: "flex-start",
              marginTop: 4,
              overflow: "hidden",
            }}
          >
            {item.time}
          </Text>
        ) : null}
      </View>
      <Switch
        value={settings[item.key]}
        onValueChange={() => toggle(item.key)}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#FFFFFF"
      />
    </View>
  );

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
        <Text style={{ fontSize: FontSize.lg, fontWeight: "700", color: colors.text }}>알림 설정</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: FontSize.md,
            fontWeight: "700",
            color: colors.text,
            marginBottom: Spacing.sm,
            marginTop: Spacing.sm,
          }}
        >
          식사 알림
        </Text>
        {mealAlarms.map(renderToggleItem)}

        <Text
          style={{
            fontSize: FontSize.md,
            fontWeight: "700",
            color: colors.text,
            marginBottom: Spacing.sm,
            marginTop: Spacing.lg,
          }}
        >
          기타 알림
        </Text>
        {otherAlarms.map(renderToggleItem)}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.primaryLight,
            borderRadius: BorderRadius.md,
            padding: Spacing.md,
            marginTop: Spacing.lg,
            gap: Spacing.sm,
          }}
        >
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: colors.primary,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons name="bell-ring-outline" size={14} color="#FFFFFF" />
          </View>
          <Text style={{ flex: 1, fontSize: FontSize.xs, color: colors.textSecondary, lineHeight: 18 }}>
            알림을 허용하려면 기기 설정에서 CalSnap 알림을 켜주세요.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
