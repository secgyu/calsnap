import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import Button from "@/components/ui/Button";
import MacroGrid from "@/components/food/MacroGrid";
import { useState, useEffect } from "react";
import { getFoodById } from "@/services/food";

export default function FoodDetailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [food, setFood] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getFoodById(id)
        .then(setFood)
        .catch(() => setFood(null))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!food) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}
      >
        <Text style={{ color: colors.textSecondary }}>음식 정보를 찾을 수 없습니다</Text>
      </SafeAreaView>
    );
  }

  const macros = [
    { label: "탄수화물", value: (food.carbs || 0) * quantity, unit: "g", icon: "barley" as const, color: colors.carbs },
    {
      label: "단백질",
      value: (food.protein || 0) * quantity,
      unit: "g",
      icon: "arm-flex" as const,
      color: colors.protein,
    },
    { label: "지방", value: (food.fat || 0) * quantity, unit: "g", icon: "water" as const, color: colors.fat },
    {
      label: "나트륨",
      value: (food.sodium || 0) * quantity,
      unit: "mg",
      icon: "shaker" as const,
      color: colors.sodium,
    },
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
        <Text style={{ fontSize: FontSize.md, fontWeight: "600", color: colors.primary }}>음식 상세</Text>
        <View style={{ width: 24 }} />
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
            <Text style={{ fontSize: 64 }}>{food.icon || "🍽️"}</Text>
          </View>
        </View>

        <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary, marginBottom: Spacing.xs }}>
          {food.serving || "1인분"}
        </Text>
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
          <Text style={{ fontSize: 48, fontWeight: "800", color: colors.primary }}>
            {(food.calories || 0) * quantity}
          </Text>
          <Text style={{ fontSize: FontSize.md, color: colors.textSecondary, fontWeight: "500" }}>kcal</Text>
        </View>

        <View style={{ marginBottom: Spacing.xl }}>
          <MacroGrid items={macros} />
        </View>

        <Button title="닫기" onPress={() => router.back()} style={{ marginBottom: Spacing.md }} />
      </ScrollView>
    </SafeAreaView>
  );
}
