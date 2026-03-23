import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { WEEKDAYS } from "@/utils/date";
import NutrientGrid from "@/components/history/NutrientGrid";
import MealGroupCard from "@/components/history/MealGroupCard";
import AiTipCard from "@/components/history/AiTipCard";

const MOCK = {
  consumed: 853,
  goal: 2100,
  nutrients: [
    { label: "탄수화물", value: 142, goal: 260, unit: "g", color: "#F59E0B", icon: "barley" as const },
    { label: "단백질", value: 68, goal: 105, unit: "g", color: "#3B82F6", icon: "arm-flex" as const },
    { label: "지방", value: 34, goal: 58, unit: "g", color: "#EF4444", icon: "water" as const },
    { label: "나트륨", value: 890, goal: 2000, unit: "mg", color: "#8B5CF6", icon: "shaker" as const },
  ],
  mealGroups: [
    { type: "아침", icon: "🌅", totalCalories: 95, items: [{ name: "사과", calories: 95, serving: "1개 (200g)" }] },
    {
      type: "점심",
      icon: "☀️",
      totalCalories: 320,
      items: [{ name: "닭가슴살 샐러드", calories: 320, serving: "1인분" }],
    },
    { type: "간식", icon: "🍪", totalCalories: 180, items: [{ name: "통밀 식빵", calories: 180, serving: "2조각" }] },
    {
      type: "저녁",
      icon: "🌙",
      totalCalories: 258,
      items: [
        { name: "현미밥", calories: 150, serving: "1공기" },
        { name: "된장찌개", calories: 108, serving: "1그릇" },
      ],
    },
  ],
  tip: "단백질 섭취가 목표 대비 부족해요. 저녁에 닭가슴살이나 두부를 추가해보세요!",
};

export default function HistoryDetailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { date } = useLocalSearchParams<{ date: string }>();
  const dateObj = date ? new Date(date + "T00:00:00") : new Date();
  const dateLabel = `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 (${WEEKDAYS[dateObj.getDay()]})`;
  const remaining = MOCK.goal - MOCK.consumed;
  const percent = Math.min((MOCK.consumed / MOCK.goal) * 100, 100);

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
        <Text style={{ fontSize: FontSize.lg, fontWeight: "700", color: colors.primary }}>{dateLabel}</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="share-variant-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: BorderRadius.lg,
            padding: Spacing.lg,
            borderWidth: 1,
            borderColor: colors.divider,
            alignItems: "center",
            marginBottom: Spacing.lg,
          }}
        >
          <View style={{ marginBottom: Spacing.lg }}>
            <View
              style={{
                width: 140,
                height: 140,
                borderRadius: 70,
                borderWidth: 10,
                borderColor: colors.divider,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 32, fontWeight: "800", color: colors.primary }}>{MOCK.consumed}</Text>
              <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary }}>kcal</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ fontSize: FontSize.xl, fontWeight: "800", color: colors.text }}>{MOCK.goal}</Text>
              <Text style={{ fontSize: FontSize.xs, color: colors.textSecondary, marginTop: 2 }}>목표</Text>
            </View>
            <View style={{ width: 1, height: 32, backgroundColor: colors.divider }} />
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ fontSize: FontSize.xl, fontWeight: "800", color: colors.primary }}>{MOCK.consumed}</Text>
              <Text style={{ fontSize: FontSize.xs, color: colors.textSecondary, marginTop: 2 }}>섭취</Text>
            </View>
            <View style={{ width: 1, height: 32, backgroundColor: colors.divider }} />
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text
                style={{ fontSize: FontSize.xl, fontWeight: "800", color: remaining < 0 ? colors.error : "#3B82F6" }}
              >
                {remaining >= 0 ? remaining : `+${Math.abs(remaining)}`}
              </Text>
              <Text style={{ fontSize: FontSize.xs, color: colors.textSecondary, marginTop: 2 }}>
                {remaining >= 0 ? "남음" : "초과"}
              </Text>
            </View>
          </View>
        </View>

        <Text style={{ fontSize: FontSize.lg, fontWeight: "800", color: colors.text, marginBottom: Spacing.md }}>
          영양소 분석
        </Text>
        <NutrientGrid nutrients={MOCK.nutrients} />

        <Text style={{ fontSize: FontSize.lg, fontWeight: "800", color: colors.text, marginBottom: Spacing.md }}>
          식사별 기록
        </Text>
        {MOCK.mealGroups.map((group) => (
          <MealGroupCard key={group.type} group={group} />
        ))}

        <AiTipCard tip={MOCK.tip} />
      </ScrollView>
    </SafeAreaView>
  );
}
