import { Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

interface MealItemProps {
  name: string;
  calories: number;
  time: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor?: string;
  onPress?: () => void;
}

export default function MealItem({ name, calories, time, icon, iconColor, onPress }: MealItemProps) {
  const { colors } = useTheme();
  const color = iconColor || colors.primary;

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: colors.divider,
      }}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: color + "15",
          justifyContent: "center",
          alignItems: "center",
          marginRight: Spacing.md,
        }}
      >
        <MaterialCommunityIcons name={icon} size={22} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: FontSize.md, fontWeight: "700", color: colors.text }}>{name}</Text>
        <Text style={{ fontSize: FontSize.xs, color: colors.textLight, marginTop: 2 }}>{time}</Text>
      </View>
      <Text style={{ fontSize: FontSize.lg, fontWeight: "700", color: colors.text }}>
        {calories} <Text style={{ fontSize: FontSize.xs, fontWeight: "500", color: colors.textLight }}>kcal</Text>
      </Text>
    </TouchableOpacity>
  );
}
