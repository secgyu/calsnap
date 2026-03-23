import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { WEEKDAYS } from "@/utils/date";
import { getDailyDetail } from "@/services/record";
import NutrientGrid from "@/components/history/NutrientGrid";
import MealGroupCard from "@/components/history/MealGroupCard";
import AiTipCard from "@/components/history/AiTipCard";

export default function HistoryDetailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { date } = useLocalSearchParams<{ date: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const dateObj = date ? new Date(date + "T00:00:00") : new Date();
  const dateLabel = `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 (${WEEKDAYS[dateObj.getDay()]})`;

  useEffect(() => {
    if (date) {
      getDailyDetail(date)
        .then(setData)
        .catch(() =>
          setData({ consumed: 0, goal: 0, nutrients: [], mealGroups: [], tip: "데이터를 불러올 수 없습니다." }),
        )
        .finally(() => setLoading(false));
    }
  }, [date]);

  if (loading || !data) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  const remaining = data.goal - data.consumed;

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
              <Text style={{ fontSize: 32, fontWeight: "800", color: colors.primary }}>{data.consumed}</Text>
              <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary }}>kcal</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ fontSize: FontSize.xl, fontWeight: "800", color: colors.text }}>{data.goal}</Text>
              <Text style={{ fontSize: FontSize.xs, color: colors.textSecondary, marginTop: 2 }}>목표</Text>
            </View>
            <View style={{ width: 1, height: 32, backgroundColor: colors.divider }} />
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ fontSize: FontSize.xl, fontWeight: "800", color: colors.primary }}>{data.consumed}</Text>
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
        <NutrientGrid nutrients={data.nutrients} />

        <Text style={{ fontSize: FontSize.lg, fontWeight: "800", color: colors.text, marginBottom: Spacing.md }}>
          식사별 기록
        </Text>
        {(data.mealGroups || []).map((group: any) => (
          <MealGroupCard key={group.type} group={group} />
        ))}

        <AiTipCard tip={data.tip} />
      </ScrollView>
    </SafeAreaView>
  );
}
