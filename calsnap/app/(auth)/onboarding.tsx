import { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { Gender, ActivityLevel, calculateTDEE } from "@/utils/calories";
import { updateProfile, updateGoal } from "@/services/user";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import GenderSelector from "@/components/onboarding/GenderSelector";
import ActivitySelector from "@/components/onboarding/ActivitySelector";
import TdeeResult from "@/components/onboarding/TdeeResult";

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [showPicker, setShowPicker] = useState(false);

  const [loading, setLoading] = useState(false);

  const canCalculate = age && height && weight && Number(age) > 0 && Number(height) > 0 && Number(weight) > 0;
  const tdee = canCalculate ? calculateTDEE(gender, Number(age), Number(height), Number(weight), activity) : 0;

  const handleStart = async () => {
    if (!canCalculate) return;
    setLoading(true);
    try {
      await updateProfile({
        gender: gender as any,
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
        activityLevel: activity as any,
      });
      await updateGoal({
        goalCalorie: tdee,
        goalType: "체중 유지",
      });
      router.replace("/(tabs)");
    } catch {
      Alert.alert("오류", "정보 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: Spacing.lg,
            paddingTop: Spacing.xl,
            paddingBottom: Spacing.xl,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ alignItems: "center", marginBottom: Spacing.xl }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: colors.primaryLight,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: Spacing.md,
              }}
            >
              <MaterialCommunityIcons name="silverware-fork-knife" size={28} color={colors.primary} />
            </View>
            <Text
              style={{
                fontSize: FontSize.xl,
                fontWeight: "800",
                color: colors.text,
                textAlign: "center",
                marginBottom: Spacing.xs,
              }}
            >
              당신의 건강한 식단을 도와드릴게요
            </Text>
            <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary, textAlign: "center", lineHeight: 20 }}>
              나만의 맞춤 영양 관리를 시작하기 위해{"\n"}몇 가지 정보가 필요해요.
            </Text>
          </View>

          <Text style={{ fontSize: FontSize.sm, fontWeight: "600", color: colors.text, marginBottom: Spacing.sm }}>
            성별
          </Text>
          <GenderSelector value={gender} onChange={setGender} />

          {[
            { label: "나이", placeholder: "25", value: age, setter: setAge, unit: "세" },
            { label: "키", placeholder: "175", value: height, setter: setHeight, unit: "cm" },
            { label: "몸무게", placeholder: "70", value: weight, setter: setWeight, unit: "kg" },
          ].map((field) => (
            <View key={field.label} style={{ flexDirection: "row", alignItems: "flex-end", gap: Spacing.sm }}>
              <View style={{ flex: 1 }}>
                <Input
                  label={field.label}
                  placeholder={field.placeholder}
                  value={field.value}
                  onChangeText={field.setter}
                  keyboardType="number-pad"
                />
              </View>
              <View style={{ paddingBottom: Spacing.lg }}>
                <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary, fontWeight: "500" }}>
                  {field.unit}
                </Text>
              </View>
            </View>
          ))}

          <Text style={{ fontSize: FontSize.sm, fontWeight: "600", color: colors.text, marginBottom: Spacing.sm }}>
            활동량
          </Text>
          <ActivitySelector
            value={activity}
            onChange={(a) => {
              setActivity(a);
              setShowPicker(false);
            }}
            expanded={showPicker}
            onToggle={() => setShowPicker(!showPicker)}
          />

          {canCalculate && <TdeeResult tdee={tdee} />}

          <Button
            title="시작하기  →"
            onPress={handleStart}
            loading={loading}
            disabled={!canCalculate}
            style={{ marginTop: Spacing.md }}
          />
          <Text
            style={{
              fontSize: FontSize.xs,
              color: colors.textLight,
              textAlign: "center",
              marginTop: Spacing.md,
              lineHeight: 16,
            }}
          >
            계속함으로써 CalSnap의 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
