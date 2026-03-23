import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

interface MacroItem {
  label: string;
  value: number;
  unit: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
}

interface MacroGridProps {
  items: MacroItem[];
}

export default function MacroGrid({ items }: MacroGridProps) {
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm }}>
      {items.map((m) => (
        <View
          key={m.label}
          style={{
            flex: 1,
            minWidth: "45%",
            backgroundColor: colors.card,
            borderRadius: BorderRadius.md,
            padding: Spacing.md,
            borderWidth: 1,
            borderColor: colors.divider,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: Spacing.sm,
            }}
          >
            <Text style={{ fontSize: FontSize.xs, color: colors.textSecondary }}>{m.label}</Text>
            <MaterialCommunityIcons name={m.icon} size={16} color={m.color} />
          </View>
          <Text style={{ fontSize: FontSize.xl, fontWeight: "800", color: colors.text }}>
            {m.value}{" "}
            <Text style={{ fontSize: FontSize.sm, fontWeight: "500", color: colors.textLight }}>{m.unit}</Text>
          </Text>
        </View>
      ))}
    </View>
  );
}
