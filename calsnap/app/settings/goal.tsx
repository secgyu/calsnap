import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { getUserProfile, updateGoal } from "@/services/user";
import Button from "@/components/ui/Button";

type GoalType = "lose" | "maintain" | "gain";

const GOAL_OPTIONS: {
  key: GoalType;
  label: string;
  desc: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}[] = [
  { key: "lose", label: "체중 감량", desc: "목표보다 300~500 kcal 적게", icon: "arrow-down-bold" },
  { key: "maintain", label: "체중 유지", desc: "TDEE 기반 유지 칼로리", icon: "equal" },
  { key: "gain", label: "체중 증가", desc: "목표보다 300~500 kcal 많게", icon: "arrow-up-bold" },
];

const CALORIE_PRESETS = [1500, 1800, 2000, 2100, 2300, 2500];

const GOAL_TYPE_MAP: Record<string, GoalType> = {
  "체중 감량": "lose",
  "체중 유지": "maintain",
  "체중 증가": "gain",
};

const GOAL_LABEL_MAP: Record<GoalType, string> = {
  lose: "체중 감량",
  maintain: "체중 유지",
  gain: "체중 증가",
};

export default function GoalScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [goalType, setGoalType] = useState<GoalType>("maintain");
  const [goalCalorie, setGoalCalorie] = useState(0);
  const [tdee, setTdee] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getUserProfile()
      .then((u) => {
        if (u.goalCalorie) setGoalCalorie(u.goalCalorie);
        if (u.goalType && GOAL_TYPE_MAP[u.goalType]) {
          setGoalType(GOAL_TYPE_MAP[u.goalType]);
        }
        if (u.goalCalorie) setTdee(u.goalCalorie);
      })
      .catch(() => {})
      .finally(() => setPageLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateGoal({
        goalCalorie,
        goalType: GOAL_LABEL_MAP[goalType],
      });
      Alert.alert("저장 완료", `목표 칼로리가 ${goalCalorie} kcal로 설정되었습니다.`);
      router.back();
    } catch {
      Alert.alert("오류", "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (pageLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

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
        <Text style={{ fontSize: FontSize.lg, fontWeight: "700", color: colors.primary }}>목표 설정</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: FontSize.lg, fontWeight: "800", color: colors.text, marginBottom: Spacing.md }}>
          목표 유형
        </Text>
        {GOAL_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: goalType === opt.key ? colors.primaryLight : colors.card,
              borderRadius: BorderRadius.lg,
              padding: Spacing.md,
              marginBottom: Spacing.sm,
              borderWidth: 1.5,
              borderColor: goalType === opt.key ? colors.primary : colors.divider,
            }}
            onPress={() => setGoalType(opt.key)}
            activeOpacity={0.7}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: goalType === opt.key ? colors.primary : colors.divider,
                justifyContent: "center",
                alignItems: "center",
                marginRight: Spacing.md,
              }}
            >
              <MaterialCommunityIcons
                name={opt.icon}
                size={24}
                color={goalType === opt.key ? "#FFFFFF" : colors.textSecondary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: FontSize.md,
                  fontWeight: "700",
                  color: goalType === opt.key ? colors.primary : colors.text,
                }}
              >
                {opt.label}
              </Text>
              <Text style={{ fontSize: FontSize.xs, color: colors.textSecondary, marginTop: 2 }}>{opt.desc}</Text>
            </View>
            {goalType === opt.key && <MaterialCommunityIcons name="check-circle" size={24} color={colors.primary} />}
          </TouchableOpacity>
        ))}

        <Text
          style={{
            fontSize: FontSize.lg,
            fontWeight: "800",
            color: colors.text,
            marginTop: Spacing.xl,
            marginBottom: Spacing.md,
          }}
        >
          일일 칼로리 목표
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.card,
            borderRadius: BorderRadius.lg,
            padding: Spacing.lg,
            borderWidth: 1,
            borderColor: colors.divider,
            gap: Spacing.xl,
            marginBottom: Spacing.md,
          }}
        >
          <TouchableOpacity
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: colors.divider,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setGoalCalorie(Math.max(1000, goalCalorie - 100))}
          >
            <MaterialCommunityIcons name="minus" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 36, fontWeight: "800", color: colors.primary }}>{goalCalorie}</Text>
            <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary }}>kcal / 일</Text>
          </View>
          <TouchableOpacity
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: colors.primary,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setGoalCalorie(goalCalorie + 100)}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm, marginBottom: Spacing.lg }}>
          {CALORIE_PRESETS.map((val) => (
            <TouchableOpacity
              key={val}
              style={{
                paddingHorizontal: Spacing.md,
                paddingVertical: Spacing.sm,
                borderRadius: 9999,
                borderWidth: 1,
                borderColor: goalCalorie === val ? colors.primary : colors.border,
                backgroundColor: goalCalorie === val ? colors.primary : colors.card,
              }}
              onPress={() => setGoalCalorie(val)}
            >
              <Text
                style={{
                  fontSize: FontSize.sm,
                  fontWeight: "600",
                  color: goalCalorie === val ? "#FFFFFF" : colors.textSecondary,
                }}
              >
                {val}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {tdee > 0 && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: isDark ? "#332B00" : "#FFF8E1",
              borderRadius: BorderRadius.md,
              padding: Spacing.md,
              gap: Spacing.sm,
              borderWidth: 1,
              borderColor: isDark ? "#665500" : "#FFE082",
            }}
          >
            <MaterialCommunityIcons name="lightbulb-on-outline" size={18} color={colors.warning} />
            <Text style={{ flex: 1, fontSize: FontSize.sm, color: colors.textSecondary, lineHeight: 20 }}>
              현재 설정된 목표 칼로리는 {tdee.toLocaleString()} kcal입니다.
            </Text>
          </View>
        )}

        <Button title="저장하기" onPress={handleSave} loading={saving} style={{ marginTop: Spacing.lg }} />
      </ScrollView>
    </SafeAreaView>
  );
}
