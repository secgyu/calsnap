import { View, Text } from "react-native";
import { DailyRecord } from "@/types/record";
import { getCalorieColor } from "@/utils/date";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

interface DailySummaryCardProps {
  record: DailyRecord;
}

export default function DailySummaryCard({ record }: DailySummaryCardProps) {
  const { colors } = useTheme();
  const remaining = record.goal - record.consumed;
  const percent = Math.min((record.consumed / record.goal) * 100, 100);

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: colors.divider,
        marginBottom: Spacing.md,
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
        <View>
          <Text style={{ fontSize: FontSize.xxl, fontWeight: "800", color: colors.primary }}>{record.consumed}</Text>
          <Text style={{ fontSize: FontSize.xs, color: colors.textSecondary, marginTop: 2 }}>kcal 섭취</Text>
        </View>
        <View style={{ width: 1, height: 36, backgroundColor: colors.divider }} />
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: FontSize.xxl, fontWeight: "800", color: colors.text }}>{record.goal}</Text>
          <Text style={{ fontSize: FontSize.xs, color: colors.textSecondary, marginTop: 2 }}>목표</Text>
        </View>
        <View style={{ width: 1, height: 36, backgroundColor: colors.divider }} />
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ fontSize: FontSize.xxl, fontWeight: "800", color: remaining < 0 ? colors.error : "#3B82F6" }}>
            {remaining >= 0 ? remaining : `+${Math.abs(remaining)}`}
          </Text>
          <Text style={{ fontSize: FontSize.xs, color: colors.textSecondary, marginTop: 2 }}>
            {remaining >= 0 ? "남음" : "초과"}
          </Text>
        </View>
      </View>
      <View style={{ height: 8, backgroundColor: colors.divider, borderRadius: 4, overflow: "hidden" }}>
        <View
          style={{
            height: "100%",
            borderRadius: 4,
            width: `${percent}%`,
            backgroundColor: getCalorieColor(record.consumed, record.goal),
          }}
        />
      </View>
    </View>
  );
}
