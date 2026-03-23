import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { getUserProfile, updateProfile } from "@/services/user";
import Button from "@/components/ui/Button";
import { calculateBMR, calculateTDEE, ActivityLevel, ACTIVITY_LEVELS } from "@/utils/calories";

type Gender = "male" | "female";

export default function BodyScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getUserProfile()
      .then((u) => {
        if (u.gender) setGender(u.gender as Gender);
        if (u.age) setAge(String(u.age));
        if (u.height) setHeight(String(u.height));
        if (u.weight) setWeight(String(u.weight));
        if (u.activityLevel) setActivity(u.activityLevel as ActivityLevel);
      })
      .catch(() => {})
      .finally(() => setPageLoading(false));
  }, []);

  const n = { age: parseInt(age) || 0, height: parseInt(height) || 0, weight: parseInt(weight) || 0 };
  const bmr = calculateBMR(gender, n.age, n.height, n.weight);
  const tdee = calculateTDEE(gender, n.age, n.height, n.weight, activity);
  const isValid = n.age > 0 && n.height > 0 && n.weight > 0;

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        gender,
        age: n.age,
        height: n.height,
        weight: n.weight,
        activityLevel: activity,
      });
      Alert.alert("저장 완료", "신체 정보가 업데이트되었습니다.");
      router.back();
    } catch {
      Alert.alert("오류", "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (pageLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.md,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: FontSize.lg, fontWeight: "700", color: colors.primary }}>신체 정보</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: FontSize.sm, fontWeight: "600", color: colors.text, marginBottom: Spacing.sm }}>
          성별
        </Text>
        <View style={{ flexDirection: "row", gap: Spacing.sm, marginBottom: Spacing.lg }}>
          {(["male", "female"] as Gender[]).map((g) => (
            <TouchableOpacity
              key={g}
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: Spacing.lg,
                backgroundColor: gender === g ? colors.primaryLight : colors.card,
                borderRadius: BorderRadius.lg,
                borderWidth: 1.5,
                borderColor: gender === g ? colors.primary : colors.border,
                gap: Spacing.xs,
              }}
              onPress={() => setGender(g)}
            >
              <MaterialCommunityIcons
                name={g === "male" ? "gender-male" : "gender-female"}
                size={28}
                color={gender === g ? colors.primary : colors.textLight}
              />
              <Text
                style={{
                  fontSize: FontSize.md,
                  fontWeight: "600",
                  color: gender === g ? colors.primary : colors.textSecondary,
                }}
              >
                {g === "male" ? "남성" : "여성"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ flexDirection: "row", gap: Spacing.sm, marginBottom: Spacing.lg }}>
          {[
            { label: "나이", val: age, set: setAge, unit: "세" },
            { label: "키", val: height, set: setHeight, unit: "cm" },
            { label: "몸무게", val: weight, set: setWeight, unit: "kg" },
          ].map((f) => (
            <View key={f.label} style={{ flex: 1 }}>
              <Text style={{ fontSize: FontSize.sm, fontWeight: "600", color: colors.text, marginBottom: Spacing.sm }}>
                {f.label}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: colors.card,
                  borderRadius: BorderRadius.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                  paddingHorizontal: Spacing.md,
                  height: 48,
                }}
              >
                <TextInput
                  style={{ flex: 1, fontSize: FontSize.lg, fontWeight: "700", color: colors.text }}
                  value={f.val}
                  onChangeText={f.set}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={colors.textLight}
                />
                <Text style={{ fontSize: FontSize.sm, color: colors.textLight, marginLeft: 4 }}>{f.unit}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={{ fontSize: FontSize.sm, fontWeight: "600", color: colors.text, marginBottom: Spacing.sm }}>
          활동량
        </Text>
        {ACTIVITY_LEVELS.map((level) => (
          <TouchableOpacity
            key={level.value}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: activity === level.value ? colors.primaryLight : colors.card,
              borderRadius: BorderRadius.md,
              padding: Spacing.md,
              marginBottom: Spacing.sm,
              borderWidth: 1.5,
              borderColor: activity === level.value ? colors.primary : colors.divider,
            }}
            onPress={() => setActivity(level.value)}
            activeOpacity={0.7}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: FontSize.md,
                  fontWeight: "600",
                  color: activity === level.value ? colors.primary : colors.text,
                }}
              >
                {level.label}
              </Text>
              <Text style={{ fontSize: FontSize.xs, color: colors.textSecondary, marginTop: 2 }}>
                {level.description}
              </Text>
            </View>
            {activity === level.value && (
              <MaterialCommunityIcons name="check-circle" size={22} color={colors.primary} />
            )}
          </TouchableOpacity>
        ))}

        {isValid && (
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: BorderRadius.lg,
              padding: Spacing.lg,
              borderWidth: 1,
              borderColor: colors.divider,
              marginTop: Spacing.lg,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary, marginBottom: 4 }}>
              기초대사량 (BMR)
            </Text>
            <Text style={{ fontSize: FontSize.xxl, fontWeight: "800", color: colors.text }}>
              {Math.round(bmr)} kcal
            </Text>
            <View style={{ width: "80%", height: 1, backgroundColor: colors.divider, marginVertical: Spacing.md }} />
            <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary, marginBottom: 4 }}>
              일일 소비 칼로리 (TDEE)
            </Text>
            <Text style={{ fontSize: FontSize.xxl, fontWeight: "800", color: colors.primary }}>
              {Math.round(tdee)} kcal
            </Text>
          </View>
        )}

        <Button
          title="저장하기"
          onPress={handleSave}
          loading={saving}
          disabled={!isValid}
          style={{ marginTop: Spacing.lg }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
