import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Gender } from "@/utils/calories";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

interface GenderSelectorProps {
  value: Gender;
  onChange: (g: Gender) => void;
}

export default function GenderSelector({ value, onChange }: GenderSelectorProps) {
  const { colors } = useTheme();

  const options: { key: Gender; label: string; icon: "gender-male" | "gender-female" }[] = [
    { key: "male", label: "남성", icon: "gender-male" },
    { key: "female", label: "여성", icon: "gender-female" },
  ];

  return (
    <View style={{ flexDirection: "row", gap: Spacing.sm, marginBottom: Spacing.lg }}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.key}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            height: 48,
            borderRadius: BorderRadius.xl,
            borderWidth: 1.5,
            gap: Spacing.xs,
            borderColor: value === opt.key ? colors.primary : colors.border,
            backgroundColor: value === opt.key ? colors.primary : colors.card,
          }}
          onPress={() => onChange(opt.key)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name={opt.icon}
            size={20}
            color={value === opt.key ? "#FFFFFF" : colors.textSecondary}
          />
          <Text
            style={{
              fontSize: FontSize.md,
              fontWeight: "600",
              color: value === opt.key ? "#FFFFFF" : colors.textSecondary,
            }}
          >
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
