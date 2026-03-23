import { View, Text } from "react-native";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

interface MacroCardProps {
  label: string;
  value: number;
  unit: string;
  color: string;
}

export default function MacroCard({ label, value, unit, color }: MacroCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.card,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: colors.divider,
      }}
    >
      <Text style={{ fontSize: FontSize.xs, color: colors.textSecondary, marginBottom: Spacing.xs }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: 2 }}>
        <Text style={{ fontSize: FontSize.xl, fontWeight: "800", color: colors.text }}>{value}</Text>
        <Text style={{ fontSize: FontSize.xs, color: colors.textLight, fontWeight: "500" }}>{unit}</Text>
      </View>
      <View
        style={{
          height: 4,
          backgroundColor: colors.divider,
          borderRadius: 2,
          marginTop: Spacing.sm,
          overflow: "hidden",
        }}
      >
        <View style={{ height: "100%", borderRadius: 2, backgroundColor: color, width: "60%" }} />
      </View>
    </View>
  );
}
