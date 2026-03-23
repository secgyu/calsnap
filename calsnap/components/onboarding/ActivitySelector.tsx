import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityLevel, ACTIVITY_LABELS } from "@/utils/calories";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

const OPTIONS: ActivityLevel[] = ["sedentary", "light", "moderate", "active", "veryActive"];

interface ActivitySelectorProps {
  value: ActivityLevel;
  onChange: (a: ActivityLevel) => void;
  expanded: boolean;
  onToggle: () => void;
}

export default function ActivitySelector({ value, onChange, expanded, onToggle }: ActivitySelectorProps) {
  const { colors } = useTheme();

  return (
    <>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: colors.card,
          borderRadius: BorderRadius.md,
          borderWidth: 1.5,
          borderColor: colors.border,
          paddingHorizontal: Spacing.md,
          height: 52,
          marginBottom: Spacing.sm,
        }}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <Text style={{ fontSize: FontSize.md, color: colors.text }}>{ACTIVITY_LABELS[value]}</Text>
        <MaterialCommunityIcons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={24}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {expanded && (
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: BorderRadius.md,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: Spacing.md,
            overflow: "hidden",
          }}
        >
          {OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: Spacing.md,
                paddingVertical: Spacing.md,
                borderBottomWidth: 1,
                borderBottomColor: colors.divider,
                backgroundColor: value === opt ? colors.primaryLight : "transparent",
              }}
              onPress={() => onChange(opt)}
            >
              <Text
                style={{
                  fontSize: FontSize.sm,
                  color: value === opt ? colors.primary : colors.text,
                  fontWeight: value === opt ? "600" : "400",
                }}
              >
                {ACTIVITY_LABELS[opt]}
              </Text>
              {value === opt && <MaterialCommunityIcons name="check" size={20} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
}
