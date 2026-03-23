import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

type EmptyType = "future" | "no-record";

interface EmptyStateProps {
  type: EmptyType;
  onAddPress?: () => void;
}

export default function EmptyState({ type, onAddPress }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        alignItems: "center",
        backgroundColor: colors.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.xl,
        borderWidth: 1,
        borderColor: colors.divider,
        marginBottom: Spacing.lg,
      }}
    >
      <MaterialCommunityIcons
        name={type === "future" ? "calendar-clock" : "food-off"}
        size={48}
        color={colors.border}
      />
      <Text style={{ fontSize: FontSize.lg, fontWeight: "700", color: colors.text, marginTop: Spacing.md }}>
        {type === "future" ? "아직 기록이 없어요" : "기록이 없어요"}
      </Text>
      <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary, marginTop: Spacing.xs }}>
        {type === "future" ? "미래 날짜는 기록할 수 없습니다" : "음식을 촬영하거나 수동으로 기록해보세요"}
      </Text>
      {type === "no-record" && onAddPress && (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.primary,
            paddingHorizontal: Spacing.lg,
            paddingVertical: Spacing.sm,
            borderRadius: BorderRadius.full,
            marginTop: Spacing.lg,
            gap: Spacing.xs,
          }}
          onPress={onAddPress}
        >
          <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
          <Text style={{ fontSize: FontSize.sm, fontWeight: "700", color: "#FFFFFF" }}>식단 기록하기</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
