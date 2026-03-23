import { View, Text, TouchableOpacity } from "react-native";
import { MealTime, MEAL_LABELS } from "@/types/food";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

interface MealTimeSelectorProps {
  value: MealTime;
  onChange: (v: MealTime) => void;
}

export default function MealTimeSelector({ value, onChange }: MealTimeSelectorProps) {
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: "row", gap: Spacing.sm, marginBottom: Spacing.md }}>
      {(Object.keys(MEAL_LABELS) as MealTime[]).map((key) => (
        <TouchableOpacity
          key={key}
          style={{
            flex: 1,
            paddingVertical: Spacing.sm,
            alignItems: "center",
            borderRadius: BorderRadius.xl,
            borderWidth: 1.5,
            borderColor: value === key ? colors.primary : colors.border,
            backgroundColor: value === key ? colors.primary : colors.card,
          }}
          onPress={() => onChange(key)}
        >
          <Text
            style={{
              fontSize: FontSize.sm,
              fontWeight: "600",
              color: value === key ? "#FFFFFF" : colors.textSecondary,
            }}
          >
            {MEAL_LABELS[key]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
