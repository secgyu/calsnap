import { View, Text, TouchableOpacity } from "react-native";
import { MealEntry } from "@/types/record";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

interface DailyMealListProps {
  meals: MealEntry[];
  onMealPress: (id: string) => void;
}

export default function DailyMealList({ meals, onMealPress }: DailyMealListProps) {
  const { colors } = useTheme();

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: Spacing.sm,
        }}
      >
        <Text style={{ fontSize: FontSize.md, fontWeight: "700", color: colors.text }}>식사 기록</Text>
        <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary }}>{meals.length}끼</Text>
      </View>
      {meals.map((meal) => (
        <TouchableOpacity
          key={meal.id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.card,
            borderRadius: BorderRadius.lg,
            padding: Spacing.md,
            marginBottom: Spacing.sm,
            borderWidth: 1,
            borderColor: colors.divider,
          }}
          onPress={() => onMealPress(meal.id)}
          activeOpacity={0.7}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.primaryLight,
              justifyContent: "center",
              alignItems: "center",
              marginRight: Spacing.md,
            }}
          >
            <Text style={{ fontSize: 22 }}>{meal.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: FontSize.md, fontWeight: "700", color: colors.text }}>{meal.name}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
              <Text style={{ fontSize: FontSize.xs, fontWeight: "600", color: colors.primary }}>{meal.mealType}</Text>
              <Text style={{ fontSize: FontSize.xs, color: colors.textLight }}>·</Text>
              <Text style={{ fontSize: FontSize.xs, color: colors.textLight }}>{meal.time}</Text>
            </View>
          </View>
          <Text style={{ fontSize: FontSize.lg, fontWeight: "700", color: colors.text }}>{meal.calories}</Text>
          <Text style={{ fontSize: FontSize.xs, color: colors.textLight, marginLeft: 2 }}>kcal</Text>
        </TouchableOpacity>
      ))}
    </>
  );
}
