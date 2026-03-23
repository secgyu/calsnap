import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NutrientData } from "@/types/food";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

interface NutrientGridProps {
  nutrients: NutrientData[];
}

export default function NutrientGrid({ nutrients }: NutrientGridProps) {
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm, marginBottom: Spacing.xl }}>
      {nutrients.map((n) => {
        const percent = Math.min((n.value / n.goal) * 100, 100);
        return (
          <View
            key={n.label}
            style={{
              width: "48%",
              backgroundColor: colors.card,
              borderRadius: BorderRadius.md,
              padding: Spacing.md,
              borderWidth: 1,
              borderColor: colors.divider,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing.xs, marginBottom: Spacing.sm }}>
              <MaterialCommunityIcons name={n.icon} size={18} color={n.color} />
              <Text style={{ fontSize: FontSize.sm, fontWeight: "600", color: colors.text }}>{n.label}</Text>
            </View>
            <Text style={{ fontSize: FontSize.lg, fontWeight: "800", color: colors.text, marginBottom: Spacing.sm }}>
              {n.value}
              <Text style={{ fontSize: FontSize.xs, fontWeight: "500", color: colors.textLight }}>
                {" "}
                / {n.goal}
                {n.unit}
              </Text>
            </Text>
            <View
              style={{
                height: 6,
                backgroundColor: colors.divider,
                borderRadius: 3,
                overflow: "hidden",
                marginBottom: 4,
              }}
            >
              <View style={{ height: "100%", borderRadius: 3, width: `${percent}%`, backgroundColor: n.color }} />
            </View>
            <Text style={{ fontSize: FontSize.xs, fontWeight: "700", color: n.color, textAlign: "right" }}>
              {Math.round(percent)}%
            </Text>
          </View>
        );
      })}
    </View>
  );
}
