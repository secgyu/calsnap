import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FoodItem } from "@/types/food";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

interface FoodCardProps {
  food: FoodItem;
  onPress: () => void;
}

export default function FoodCard({ food, onPress }: FoodCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.card,
        marginHorizontal: Spacing.lg,
        marginBottom: Spacing.sm,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: colors.divider,
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: colors.primaryLight,
          justifyContent: "center",
          alignItems: "center",
          marginRight: Spacing.md,
        }}
      >
        <Text style={{ fontSize: 24 }}>{food.icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: FontSize.md, fontWeight: "700", color: colors.text }}>{food.name}</Text>
        <Text style={{ fontSize: FontSize.xs, color: colors.textLight, marginTop: 2 }}>{food.serving}</Text>
        <Text style={{ fontSize: FontSize.sm, fontWeight: "700", color: colors.primary, marginTop: 2 }}>
          {food.calories} kcal
        </Text>
      </View>
      <TouchableOpacity style={{ padding: Spacing.xs }} onPress={onPress}>
        <MaterialCommunityIcons name="plus-circle" size={32} color={colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
