import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

interface TdeeResultProps {
  tdee: number;
}

export default function TdeeResult({ tdee }: TdeeResultProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: colors.primaryLight,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        marginTop: Spacing.md,
        marginBottom: Spacing.lg,
        gap: Spacing.sm,
      }}
    >
      <MaterialCommunityIcons name="information-outline" size={18} color={colors.primary} />
      <Text style={{ flex: 1, fontSize: FontSize.xs, color: colors.textSecondary, lineHeight: 18 }}>
        입력하신 정보를 기반한 일일 권장 칼로리(TDEE)는{" "}
        <Text style={{ fontWeight: "700", color: colors.primary }}>{tdee} kcal</Text>
        입니다. 언제든 설정에서 변경할 수 있습니다.
      </Text>
    </View>
  );
}
