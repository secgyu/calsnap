import { useState } from "react";
import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { MealTime } from "@/types/food";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import MealTimeSelector from "./MealTimeSelector";
import Button from "@/components/ui/Button";

interface ManualEntryFormProps {
  onSubmit: () => void;
}

export default function ManualEntryForm({ onSubmit }: ManualEntryFormProps) {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [carbs, setCarbs] = useState("");
  const [protein, setProtein] = useState("");
  const [fat, setFat] = useState("");
  const [mealTime, setMealTime] = useState<MealTime>("lunch");

  const inputStyle = {
    backgroundColor: colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: Spacing.md,
    height: 48,
    fontSize: FontSize.md,
    color: colors.text,
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ marginBottom: Spacing.md }}>
          <Text style={{ fontSize: FontSize.sm, fontWeight: "600", color: colors.text, marginBottom: Spacing.xs }}>
            음식 이름
          </Text>
          <TextInput
            style={inputStyle}
            placeholder="예: 된장찌개"
            placeholderTextColor={colors.textLight}
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={{ marginBottom: Spacing.md }}>
          <Text style={{ fontSize: FontSize.sm, fontWeight: "600", color: colors.text, marginBottom: Spacing.xs }}>
            칼로리 (kcal)
          </Text>
          <TextInput
            style={inputStyle}
            placeholder="0"
            placeholderTextColor={colors.textLight}
            keyboardType="number-pad"
            value={calories}
            onChangeText={setCalories}
          />
        </View>
        <View style={{ flexDirection: "row", gap: Spacing.sm, marginBottom: Spacing.lg }}>
          {[
            { label: "탄수화물 (g)", val: carbs, set: setCarbs },
            { label: "단백질 (g)", val: protein, set: setProtein },
            { label: "지방 (g)", val: fat, set: setFat },
          ].map((item) => (
            <View key={item.label} style={{ flex: 1 }}>
              <Text style={{ fontSize: FontSize.sm, fontWeight: "600", color: colors.text, marginBottom: Spacing.xs }}>
                {item.label}
              </Text>
              <TextInput
                style={inputStyle}
                placeholder="0"
                placeholderTextColor={colors.textLight}
                keyboardType="number-pad"
                value={item.val}
                onChangeText={item.set}
              />
            </View>
          ))}
        </View>
        <Text style={{ fontSize: FontSize.sm, fontWeight: "600", color: colors.text, marginBottom: Spacing.xs }}>
          식사 시간
        </Text>
        <MealTimeSelector value={mealTime} onChange={setMealTime} />
        <Button title="저장하기" onPress={onSubmit} disabled={!name || !calories} style={{ marginTop: Spacing.lg }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
