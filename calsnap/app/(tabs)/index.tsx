import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import CalorieRing from "@/components/home/CalorieRing";
import MacroCard from "@/components/home/MacroCard";
import MealItem from "@/components/home/MealItem";
import { getTodaySummary } from "@/services/record";

const MOCK_TODAY = getTodaySummary();

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const goalPercent = Math.round((MOCK_TODAY.consumed / MOCK_TODAY.goal) * 100);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: Spacing.md,
            marginBottom: Spacing.lg,
          }}
        >
          <View>
            <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary }}>{MOCK_TODAY.date}</Text>
            <Text style={{ fontSize: FontSize.xxl, fontWeight: "800", color: colors.text, marginTop: 2 }}>
              오늘도 건강하게!
            </Text>
          </View>
          <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 22, overflow: "hidden" }}>
            <MaterialCommunityIcons name="account-circle" size={40} color={colors.primaryLight} />
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "center", marginBottom: Spacing.lg }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "flex-end",
              backgroundColor: colors.primaryLight,
              paddingHorizontal: Spacing.sm,
              paddingVertical: Spacing.xs,
              borderRadius: BorderRadius.full,
              gap: 4,
              marginBottom: Spacing.sm,
            }}
          >
            <MaterialCommunityIcons name="flag-variant" size={14} color={colors.primary} />
            <Text style={{ fontSize: FontSize.xs, fontWeight: "700", color: colors.primary }}>Goal {goalPercent}%</Text>
          </View>
          <CalorieRing consumed={MOCK_TODAY.consumed} goal={MOCK_TODAY.goal} />
        </View>

        <View style={{ flexDirection: "row", gap: Spacing.sm, marginBottom: Spacing.xl }}>
          <MacroCard label="탄수화물" value={MOCK_TODAY.carbs} unit="g" color={colors.carbs} />
          <MacroCard label="단백질" value={MOCK_TODAY.protein} unit="g" color={colors.protein} />
          <MacroCard label="지방" value={MOCK_TODAY.fat} unit="g" color={colors.fat} />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: Spacing.md,
          }}
        >
          <Text style={{ fontSize: FontSize.lg, fontWeight: "800", color: colors.text }}>오늘 먹은 음식</Text>
          <TouchableOpacity onPress={() => router.push("/food/search")}>
            <Text style={{ fontSize: FontSize.sm, fontWeight: "600", color: colors.primary }}>전체보기</Text>
          </TouchableOpacity>
        </View>

        {MOCK_TODAY.meals.map((meal) => (
          <MealItem
            key={meal.id}
            name={meal.name}
            calories={meal.calories}
            time={meal.time}
            icon={meal.icon}
            iconColor={meal.color}
            onPress={() => router.push({ pathname: "/food/[id]", params: { id: meal.id } })}
          />
        ))}

        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.primaryLight,
            paddingVertical: Spacing.md,
            borderRadius: BorderRadius.lg,
            marginTop: Spacing.md,
            gap: Spacing.xs,
            borderWidth: 1.5,
            borderColor: colors.primary,
            borderStyle: "dashed",
          }}
          onPress={() => router.push("/food/search")}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="plus" size={20} color={colors.primary} />
          <Text style={{ fontSize: FontSize.sm, fontWeight: "700", color: colors.primary }}>
            수동으로 식단 기록하기
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
