import { View, Text } from "react-native";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { WeeklyStats } from "@/types/record";

interface WeeklyStatsCardProps {
  stats: WeeklyStats;
}

export default function WeeklyStatsCard({ stats }: WeeklyStatsCardProps) {
  const { colors } = useTheme();

  const items = [
    { label: "평균 섭취", value: stats.avgCalories, unit: "kcal", color: colors.primary },
    { label: "달성률", value: stats.achievementRate, unit: "%", color: "#3B82F6" },
    { label: "기록 일수", value: stats.recordedDays, unit: "일", color: "#F59E0B" },
  ];

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginHorizontal: Spacing.lg,
        marginBottom: Spacing.xxl,
        borderWidth: 1,
        borderColor: colors.divider,
      }}
    >
      <Text
        style={{
          fontSize: FontSize.md,
          fontWeight: "700",
          color: colors.text,
          marginBottom: Spacing.md,
          textAlign: "center",
        }}
      >
        이번 주 평균
      </Text>
      <View style={{ flexDirection: "row" }}>
        {items.map((item) => (
          <View key={item.label} style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontSize: FontSize.xs, color: colors.textSecondary, marginBottom: 4 }}>{item.label}</Text>
            <Text style={{ fontSize: FontSize.xl, fontWeight: "800", color: item.color }}>
              {item.value}
              <Text style={{ fontSize: FontSize.xs, fontWeight: "500", color: colors.textLight }}> {item.unit}</Text>
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
