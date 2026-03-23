import { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import Button from "@/components/ui/Button";
import NutritionBreakdown from "@/components/analysis/NutritionBreakdown";
import { AnalysisResult } from "@/types/food";
import { createRecord } from "@/services/record";

const MEAL_TYPE_TO_ENUM: Record<string, string> = {
  아침: "breakfast",
  점심: "lunch",
  저녁: "dinner",
  간식: "snack",
};

export default function AnalysisResultScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { imageUri, result: resultStr } = useLocalSearchParams<{ imageUri: string; result: string }>();
  const [saving, setSaving] = useState(false);

  const analysisResult: AnalysisResult = resultStr
    ? JSON.parse(resultStr)
    : {
        name: "알 수 없음",
        mealType: "",
        calories: 0,
        carbs: 0,
        protein: 0,
        fat: 0,
        sodium: 0,
        remainingCalories: 0,
        goalPercent: 0,
        tip: "",
      };

  const nutrients = [
    { label: "탄수화물", value: analysisResult.carbs, unit: "g", color: colors.carbs },
    { label: "단백질", value: analysisResult.protein, unit: "g", color: colors.protein },
    { label: "지방", value: analysisResult.fat, unit: "g", color: colors.fat },
    { label: "나트륨", value: analysisResult.sodium, unit: "mg", color: colors.sodium },
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
              {analysisResult.calories} kcal
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 32, fontWeight: "800", color: colors.text, marginBottom: Spacing.xs }}>
          {analysisResult.name}
        </Text>
        {analysisResult.mealType ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: Spacing.lg }}>
            <MaterialCommunityIcons name="silverware-fork-knife" size={14} color={colors.textSecondary} />
            <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary }}>{analysisResult.mealType}</Text>
          </View>
        ) : (
          <View style={{ marginBottom: Spacing.lg }} />
        )}

        <NutritionBreakdown nutrients={nutrients} />

        {analysisResult.remainingCalories > 0 && (
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
              {analysisResult.remainingCalories} kcal
            </Text>
          </View>
        )}

        {analysisResult.tip ? (
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
                {analysisResult.tip}
              </Text>
              {analysisResult.goalPercent > 0 && (
                <Text style={{ fontSize: FontSize.xs, color: colors.textSecondary }}>
                  오늘 목표량의 {analysisResult.goalPercent}%를 달성하셨습니다.
                </Text>
              )}
            </View>
          </View>
        ) : (
          <View style={{ marginBottom: Spacing.xl }} />
        )}

        <View style={{ flexDirection: "row", gap: Spacing.sm }}>
          <Button
            title="다시 찍기"
            onPress={() => router.replace("/(tabs)/camera")}
            variant="outlined"
            style={{ flex: 1 }}
          />
          <Button
            title="기록하기"
            loading={saving}
            onPress={async () => {
              setSaving(true);
              try {
                const rawMealType = analysisResult.mealType.replace(" 식사로 감지됨", "");
                const mealType = MEAL_TYPE_TO_ENUM[rawMealType] || "lunch";
                await createRecord({
                  name: analysisResult.name,
                  calories: analysisResult.calories,
                  carbs: analysisResult.carbs,
                  protein: analysisResult.protein,
                  fat: analysisResult.fat,
                  sodium: analysisResult.sodium,
                  mealType,
                  imageUrl: imageUri || undefined,
                  capturedByAi: true,
                  recordedAt: new Date().toISOString(),
                });
                router.replace("/(tabs)");
              } catch {
                Alert.alert("오류", "기록 저장에 실패했습니다.");
              } finally {
                setSaving(false);
              }
            }}
            style={{ flex: 2 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
