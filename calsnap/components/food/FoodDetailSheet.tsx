import { View, Text, TouchableOpacity, Modal } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FoodItem, MealTime } from "@/types/food";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import MealTimeSelector from "./MealTimeSelector";
import Button from "@/components/ui/Button";

interface FoodDetailSheetProps {
  food: FoodItem | null;
  quantity: number;
  mealTime: MealTime;
  onQuantityChange: (q: number) => void;
  onMealTimeChange: (m: MealTime) => void;
  onClose: () => void;
  onAdd: () => void;
}

export default function FoodDetailSheet({
  food,
  quantity,
  mealTime,
  onQuantityChange,
  onMealTimeChange,
  onClose,
  onAdd,
}: FoodDetailSheetProps) {
  const { colors } = useTheme();
  if (!food) return null;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }} activeOpacity={1} onPress={onClose} />
      <View
        style={{
          backgroundColor: colors.card,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingHorizontal: Spacing.lg,
          paddingBottom: 40,
          paddingTop: Spacing.md,
        }}
      >
        <View
          style={{
            width: 40,
            height: 4,
            backgroundColor: colors.border,
            borderRadius: 2,
            alignSelf: "center",
            marginBottom: Spacing.lg,
          }}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: Spacing.md,
          }}
        >
          <Text style={{ fontSize: FontSize.xxl, fontWeight: "800", color: colors.text }}>{food.name}</Text>
          <Text style={{ fontSize: FontSize.xxl, fontWeight: "800", color: colors.primary }}>
            {food.calories * quantity}{" "}
            <Text style={{ fontSize: FontSize.sm, fontWeight: "500", color: colors.textSecondary }}>kcal</Text>
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: Spacing.sm, marginBottom: Spacing.lg }}>
          {[
            { label: "탄수화물", val: food.carbs },
            { label: "단백질", val: food.protein },
            { label: "지방", val: food.fat },
          ].map((m) => (
            <View
              key={m.label}
              style={{
                flex: 1,
                backgroundColor: colors.background,
                borderRadius: BorderRadius.md,
                padding: Spacing.md,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: FontSize.xs, color: colors.textSecondary, marginBottom: 4 }}>{m.label}</Text>
              <Text style={{ fontSize: FontSize.md, fontWeight: "700", color: colors.text }}>{m.val * quantity}g</Text>
            </View>
          ))}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: Spacing.sm,
          }}
        >
          <Text style={{ fontSize: FontSize.md, fontWeight: "600", color: colors.text }}>인분 조절</Text>
          <Text style={{ fontSize: FontSize.sm, color: colors.primary, fontWeight: "600" }}>직접 g 입력</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: Spacing.lg,
            marginBottom: Spacing.lg,
          }}
        >
          <TouchableOpacity
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.divider,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => onQuantityChange(Math.max(1, quantity - 1))}
          >
            <MaterialCommunityIcons name="minus" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: FontSize.xxxl, fontWeight: "800", color: colors.text }}>{quantity}</Text>
          <TouchableOpacity
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.primary,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => onQuantityChange(quantity + 1)}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: FontSize.md, fontWeight: "600", color: colors.text, marginBottom: Spacing.sm }}>
          식사 시간
        </Text>
        <MealTimeSelector value={mealTime} onChange={onMealTimeChange} />
        <Button title="추가하기" onPress={onAdd} style={{ marginTop: Spacing.lg }} />
      </View>
    </Modal>
  );
}
