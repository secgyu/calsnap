import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import Button from "@/components/ui/Button";
import NutritionBreakdown from "@/components/analysis/NutritionBreakdown";

const MOCK_RESULT = {
  name: "김치찌개",
  mealType: "점심 식사로 감지됨",
  calories: 320,
  carbs: 45,
  protein: 18,
  fat: 12,
  sodium: 890,
  remainingCalories: 853,
  goalPercent: 35,
  tip: "점심으로 적절한 칼로리예요!",
};

export default function AnalysisResultScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();

  const nutrients = [
    { label: "탄수화물", value: MOCK_RESULT.carbs, unit: "g", color: colors.carbs },
    { label: "단백질", value: MOCK_RESULT.protein, unit: "g", color: colors.protein },
    { label: "지방", value: MOCK_RESULT.fat, unit: "g", color: colors.fat },
    { label: "나트륨", value: MOCK_RESULT.sodium, unit: "mg", color: colors.sodium },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ alignItems: "center", paddingVertical: Spacing.md }}>
        <Text style={{ fontSize: FontSize.lg, fontWeight: "700", color: colors.text }}>분석 결과</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{ borderRadius: BorderRadius.lg, overflow: "hidden", marginBottom: Spacing.lg, position: "relative" }}
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={{ width: "100%", height: 200, borderRadius: BorderRadius.lg }}
              contentFit="cover"
            />
          ) : (
            <View
              style={{
                width: "100%",
                height: 200,
                borderRadius: BorderRadius.lg,
                backgroundColor: colors.divider,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons name="food" size={48} color={colors.textLight} />
            </View>
          )}
          <View
            style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              backgroundColor: colors.primary,
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.sm,
              borderRadius: 9999,
            }}
          >
            <Text style={{ fontSize: FontSize.sm, fontWeight: "700", color: "#FFFFFF" }}>
              {MOCK_RESULT.calories} kcal
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 32, fontWeight: "800", color: colors.text, marginBottom: Spacing.xs }}>
          {MOCK_RESULT.name}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: Spacing.lg }}>
          <MaterialCommunityIcons name="silverware-fork-knife" size={14} color={colors.textSecondary} />
          <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary }}>{MOCK_RESULT.mealType}</Text>
        </View>

        <NutritionBreakdown nutrients={nutrients} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colors.card,
            borderRadius: BorderRadius.lg,
            padding: Spacing.lg,
            marginBottom: Spacing.md,
            borderWidth: 1,
            borderColor: colors.primary,
          }}
        >
          <Text style={{ fontSize: FontSize.md, fontWeight: "600", color: colors.text }}>오늘 남은 칼로리</Text>
          <Text style={{ fontSize: FontSize.xl, fontWeight: "800", color: colors.primary }}>
            {MOCK_RESULT.remainingCalories} kcal
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            backgroundColor: colors.primaryLight,
            borderRadius: BorderRadius.lg,
            padding: Spacing.lg,
            marginBottom: Spacing.xl,
            gap: Spacing.sm,
          }}
        >
          <MaterialCommunityIcons name="lightbulb-outline" size={20} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: FontSize.md, fontWeight: "700", color: colors.primary, marginBottom: 2 }}>
              {MOCK_RESULT.tip}
            </Text>
            <Text style={{ fontSize: FontSize.xs, color: colors.textSecondary }}>
              오늘 목표량의 {MOCK_RESULT.goalPercent}%를 달성하셨습니다.
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: Spacing.sm }}>
          <Button
            title="다시 찍기"
            onPress={() => router.replace("/(tabs)/camera")}
            variant="outlined"
            style={{ flex: 1 }}
          />
          <Button title="기록하기" onPress={() => router.replace("/(tabs)")} style={{ flex: 2 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
