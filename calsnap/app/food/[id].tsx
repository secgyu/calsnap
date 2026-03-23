import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import Button from "@/components/ui/Button";
import MacroGrid from "@/components/food/MacroGrid";
import { useState } from "react";

const MOCK_FOOD = {
  id: "1",
  name: "김치찌개",
  mealType: "점심",
  time: "오후 12:45",
  calories: 320,
  carbs: 45,
  protein: 18,
  fat: 12,
  sodium: 890,
  capturedByAI: true,
};

export default function FoodDetailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const food = MOCK_FOOD;

  const macros = [
    { label: "탄수화물", value: food.carbs * quantity, unit: "g", icon: "barley" as const, color: colors.carbs },
    { label: "단백질", value: food.protein * quantity, unit: "g", icon: "arm-flex" as const, color: colors.protein },
    { label: "지방", value: food.fat * quantity, unit: "g", icon: "water" as const, color: colors.fat },
    { label: "나트륨", value: food.sodium * quantity, unit: "mg", icon: "shaker" as const, color: colors.sodium },
  ];

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
          <MaterialCommunityIcons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: FontSize.md, fontWeight: "600", color: colors.primary }}>음식 수정</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="check" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{ borderRadius: BorderRadius.lg, overflow: "hidden", marginBottom: Spacing.md, position: "relative" }}
        >
          <View
            style={{
              width: "100%",
              height: 180,
              backgroundColor: colors.primaryLight,
              borderRadius: BorderRadius.lg,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons name="food" size={48} color={colors.textLight} />
          </View>
          {food.capturedByAI && (
            <View
              style={{
                position: "absolute",
                bottom: 12,
                right: 12,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.card,
                paddingHorizontal: Spacing.sm,
                paddingVertical: Spacing.xs,
                borderRadius: 9999,
                gap: 4,
              }}
            >
              <MaterialCommunityIcons name="creation" size={14} color={colors.primary} />
              <Text
                style={{ fontSize: FontSize.xs, fontWeight: "600", color: colors.textSecondary, letterSpacing: 0.5 }}
              >
                CAPTURED BY AI
              </Text>
            </View>
          )}
        </View>

        <View style={{ flexDirection: "row", gap: Spacing.sm, marginBottom: Spacing.xs }}>
          <Text style={{ fontSize: FontSize.sm, fontWeight: "700", color: colors.primary }}>{food.mealType}</Text>
          <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary }}>{food.time}</Text>
        </View>
        <Text style={{ fontSize: 32, fontWeight: "800", color: colors.text, marginBottom: Spacing.lg }}>
          {food.name}
        </Text>

        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: BorderRadius.lg,
            padding: Spacing.lg,
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.divider,
            marginBottom: Spacing.md,
          }}
        >
          <Text style={{ fontSize: FontSize.xs, color: colors.textLight, letterSpacing: 2, marginBottom: Spacing.md }}>
            SERVING SIZE
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing.lg, marginBottom: Spacing.lg }}>
            <TouchableOpacity
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: colors.divider,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <MaterialCommunityIcons name="minus" size={20} color={colors.text} />
            </TouchableOpacity>
            <Text style={{ fontSize: FontSize.xl, fontWeight: "800", color: colors.text }}>{quantity}인분</Text>
            <TouchableOpacity
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: colors.primary,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setQuantity(quantity + 1)}
            >
              <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 48, fontWeight: "800", color: colors.primary }}>{food.calories * quantity}</Text>
          <Text style={{ fontSize: FontSize.md, color: colors.textSecondary, fontWeight: "500" }}>kcal</Text>
          <Text style={{ fontSize: FontSize.xs, color: colors.textLight, marginTop: Spacing.xs }}>
            Calculated Energy
          </Text>
        </View>

        <View style={{ marginBottom: Spacing.xl }}>
          <MacroGrid items={macros} />
        </View>

        <Button title="수정 완료" onPress={() => router.back()} style={{ marginBottom: Spacing.md }} />
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: Spacing.md,
            gap: Spacing.xs,
          }}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.error} />
          <Text style={{ fontSize: FontSize.sm, fontWeight: "600", color: colors.error }}>삭제하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
