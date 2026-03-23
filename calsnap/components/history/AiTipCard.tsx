import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

interface AiTipCardProps {
  tip: string;
}

export default function AiTipCard({ tip }: AiTipCardProps) {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={{
        backgroundColor: isDark ? "#332B00" : "#FFF8E1",
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginTop: Spacing.lg,
        borderWidth: 1,
        borderColor: isDark ? "#665500" : "#FFE082",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing.sm, marginBottom: Spacing.sm }}>
        <MaterialCommunityIcons name="lightbulb-on-outline" size={20} color={colors.warning} />
        <Text style={{ fontSize: FontSize.md, fontWeight: "700", color: colors.text }}>AI 영양 코치</Text>
      </View>
      <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary, lineHeight: 22 }}>{tip}</Text>
    </View>
  );
}
