import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { createWeightRecord } from "@/services/weight";

interface WeightEntryModalProps {
  visible: boolean;
  onClose: () => void;
  currentWeight: number;
  onSaved: () => void;
}

export default function WeightEntryModal({ visible, onClose, currentWeight, onSaved }: WeightEntryModalProps) {
  const { colors } = useTheme();
  const [weight, setWeight] = useState(currentWeight || 70);
  const [memo, setMemo] = useState("");
  const [saving, setSaving] = useState(false);

  const increment = () => setWeight((w) => +(w + 0.1).toFixed(1));
  const decrement = () => setWeight((w) => +Math.max(0, w - 0.1).toFixed(1));

  const now = new Date();
  const period = now.getHours() < 12 ? "오전" : "오후";
  const hour12 = now.getHours() % 12 || 12;
  const minute = String(now.getMinutes()).padStart(2, "0");
  const dateLabel = `오늘, ${period} ${hour12}:${minute}`;

  const handleSave = async () => {
    setSaving(true);
    try {
      await createWeightRecord({
        weight,
        memo: memo.trim() || undefined,
        recordedAt: new Date().toISOString(),
      });
      setMemo("");
      onClose();
      onSaved();
    } catch {
      Alert.alert("오류", "체중 기록에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setMemo("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View
          style={{
            backgroundColor: colors.card,
            borderTopLeftRadius: BorderRadius.xl,
            borderTopRightRadius: BorderRadius.xl,
            paddingHorizontal: Spacing.lg,
            paddingTop: Spacing.lg,
            paddingBottom: Spacing.xxl,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: Spacing.lg,
            }}
          >
            <TouchableOpacity onPress={handleClose}>
              <MaterialCommunityIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={{ fontSize: FontSize.lg, fontWeight: "700", color: colors.text }}>체중 기록하기</Text>
            <View style={{ width: 24 }} />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: Spacing.lg,
              marginBottom: Spacing.xl,
            }}
          >
            <TouchableOpacity
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: colors.primaryLight,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={decrement}
            >
              <MaterialCommunityIcons name="minus" size={24} color={colors.primary} />
            </TouchableOpacity>

            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
              <Text style={{ fontSize: 48, fontWeight: "800", color: colors.text }}>{weight.toFixed(1)}</Text>
              <Text style={{ fontSize: FontSize.lg, fontWeight: "600", color: colors.textSecondary, marginLeft: 4 }}>
                kg
              </Text>
            </View>

            <TouchableOpacity
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: colors.primary,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={increment}
            >
              <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.background,
              borderRadius: BorderRadius.md,
              padding: Spacing.md,
              marginBottom: Spacing.md,
              gap: Spacing.sm,
            }}
          >
            <MaterialCommunityIcons name="calendar-outline" size={20} color={colors.textSecondary} />
            <Text style={{ flex: 1, fontSize: FontSize.md, color: colors.text }}>{dateLabel}</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textLight} />
          </View>

          <TextInput
            style={{
              backgroundColor: colors.background,
              borderRadius: BorderRadius.md,
              padding: Spacing.md,
              fontSize: FontSize.md,
              color: colors.text,
              minHeight: 80,
              textAlignVertical: "top",
              marginBottom: Spacing.lg,
            }}
            placeholder="메모 (선택사항)"
            placeholderTextColor={colors.textLight}
            value={memo}
            onChangeText={setMemo}
            multiline
          />

          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              borderRadius: BorderRadius.lg,
              paddingVertical: Spacing.md,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: Spacing.sm,
            }}
            onPress={handleSave}
            disabled={saving}
          >
            <MaterialCommunityIcons name="check-circle" size={20} color="#FFFFFF" />
            <Text style={{ fontSize: FontSize.md, fontWeight: "700", color: "#FFFFFF" }}>
              {saving ? "저장 중..." : "저장하기"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
