import { View, Text } from "react-native";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

interface NutrientRowData {
  label: string;
  value: number;
  unit: string;
  color: string;
}

interface NutritionBreakdownProps {
  nutrients: NutrientRowData[];
}

export default function NutritionBreakdown({ nutrients }: NutritionBreakdownProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: colors.divider,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: Spacing.md,
        }}
      >
        <Text style={{ fontSize: FontSize.md, fontWeight: "700", color: colors.text }}>영양소 분석</Text>
        <Text style={{ fontSize: FontSize.xs, color: colors.textLight, letterSpacing: 1 }}>MACRO-NUTRIENTS</Text>
      </View>
      {nutrients.map((n, i) => (
        <View
          key={n.label}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: Spacing.md,
            borderBottomWidth: i < nutrients.length - 1 ? 1 : 0,
            borderBottomColor: colors.divider,
          }}
        >
          <Text style={{ fontSize: FontSize.md, fontWeight: "600", color: colors.text, width: 70 }}>{n.label}</Text>
          <View
            style={{
              flex: 1,
              height: 6,
              backgroundColor: colors.divider,
              borderRadius: 3,
              marginHorizontal: Spacing.md,
              overflow: "hidden",
            }}
          >
            <View
              style={{ height: "100%", borderRadius: 3, backgroundColor: n.color, width: `${Math.min(n.value, 100)}%` }}
            />
          </View>
          <Text style={{ fontSize: FontSize.md, fontWeight: "700", color: colors.text, width: 60, textAlign: "right" }}>
            {n.value}{" "}
            <Text style={{ fontSize: FontSize.xs, fontWeight: "500", color: colors.textLight }}>{n.unit}</Text>
          </Text>
        </View>
      ))}
    </View>
  );
}
