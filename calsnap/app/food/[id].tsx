import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import Button from "@/components/ui/Button";
import MacroGrid from "@/components/food/MacroGrid";
import { useState, useEffect } from "react";
import { getRecordById, deleteRecord } from "@/services/record";

export default function FoodDetailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [food, setFood] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      getRecordById(id)
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
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: Spacing.md }}>
          <Text style={{ color: colors.primary, fontWeight: "600" }}>돌아가기</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const macros = [
    { label: "탄수화물", value: Math.round(food.carbs || 0), unit: "g", icon: "barley" as const, color: colors.carbs },
    {
      label: "단백질",
      value: Math.round(food.protein || 0),
      unit: "g",
      icon: "arm-flex" as const,
      color: colors.protein,
    },
    { label: "지방", value: Math.round(food.fat || 0), unit: "g", icon: "water" as const, color: colors.fat },
    { label: "나트륨", value: Math.round(food.sodium || 0), unit: "mg", icon: "shaker" as const, color: colors.sodium },
  ];

  const handleDelete = () => {
    Alert.alert("기록 삭제", "이 식사 기록을 삭제할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          setDeleting(true);
          try {
            await deleteRecord(id!);
            router.back();
          } catch {
            Alert.alert("오류", "삭제에 실패했습니다.");
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

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
        <Text style={{ fontSize: FontSize.md, fontWeight: "600", color: colors.primary }}>식사 기록 상세</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{ borderRadius: BorderRadius.lg, overflow: "hidden", marginBottom: Spacing.md, position: "relative" }}
        >
          {food.imageUrl ? (
            <Image
              source={{ uri: food.imageUrl }}
              style={{ width: "100%", height: 200, borderRadius: BorderRadius.lg }}
              contentFit="cover"
            />
          ) : (
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
          )}
          {food.capturedByAi && (
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
                AI 분석
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
          <Text style={{ fontSize: 48, fontWeight: "800", color: colors.primary }}>{food.calories}</Text>
          <Text style={{ fontSize: FontSize.md, color: colors.textSecondary, fontWeight: "500" }}>kcal</Text>
        </View>

        <View style={{ marginBottom: Spacing.xl }}>
          <MacroGrid items={macros} />
        </View>

        <Button title="닫기" onPress={() => router.back()} style={{ marginBottom: Spacing.md }} />
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: Spacing.md,
            gap: Spacing.xs,
          }}
          onPress={handleDelete}
          disabled={deleting}
        >
          <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.error} />
          <Text style={{ fontSize: FontSize.sm, fontWeight: "600", color: colors.error }}>
            {deleting ? "삭제 중..." : "삭제하기"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
