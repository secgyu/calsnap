import { View, Text } from "react-native";
import { MealGroup } from "@/types/food";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

interface MealGroupCardProps {
  group: MealGroup;
}

export default function MealGroupCard({ group }: MealGroupCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: colors.divider,
        marginBottom: Spacing.sm,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: Spacing.sm,
          paddingBottom: Spacing.sm,
          borderBottomWidth: 1,
          borderBottomColor: colors.divider,
        }}
      >
        <Text style={{ fontSize: 20, marginRight: Spacing.sm }}>{group.icon}</Text>
        <Text style={{ fontSize: FontSize.md, fontWeight: "700", color: colors.text }}>{group.type}</Text>
        <View style={{ flex: 1 }} />
        <Text style={{ fontSize: FontSize.md, fontWeight: "700", color: colors.primary }}>
          {group.totalCalories} kcal
        </Text>
      </View>
      {group.items.map((item, idx) => (
        <View key={idx} style={{ flexDirection: "row", alignItems: "center", paddingVertical: Spacing.xs }}>
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: colors.primaryLight,
              marginRight: Spacing.sm,
            }}
          />
          <Text style={{ flex: 1, fontSize: FontSize.sm, fontWeight: "600", color: colors.text }}>{item.name}</Text>
          <Text style={{ fontSize: FontSize.xs, color: colors.textLight, marginRight: Spacing.md }}>
            {item.serving}
          </Text>
          <Text style={{ fontSize: FontSize.sm, fontWeight: "700", color: colors.textSecondary }}>
            {item.calories} kcal
          </Text>
        </View>
      ))}
    </View>
  );
}
