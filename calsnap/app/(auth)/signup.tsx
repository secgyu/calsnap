import { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PasswordStrength from "@/components/onboarding/PasswordStrength";

export default function SignupScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "이름을 입력해주세요";
    if (!email.trim()) e.email = "이메일을 입력해주세요";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "올바른 이메일 형식이 아닙니다";
    if (!password) e.password = "비밀번호를 입력해주세요";
    else if (password.length < 8) e.password = "비밀번호는 8자 이상이어야 합니다";
    if (password !== confirmPassword) e.confirmPassword = "비밀번호가 일치하지 않습니다";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace("/(auth)/onboarding");
    }, 1500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: Spacing.lg,
            paddingTop: Spacing.md,
            paddingBottom: Spacing.xl,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={{ width: 40, height: 40, justifyContent: "center", marginBottom: Spacing.sm }}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={{ marginBottom: Spacing.xl }}>
            <MaterialCommunityIcons name="lightning-bolt" size={28} color={colors.primary} />
            <Text
              style={{
                fontSize: FontSize.xxl,
                fontWeight: "800",
                color: colors.text,
                marginTop: Spacing.sm,
                marginBottom: Spacing.xs,
              }}
            >
              CalSnap과 함께 시작해요
            </Text>
            <Text style={{ fontSize: FontSize.md, color: colors.textSecondary }}>
              오늘의 식단을 사진 한 장으로 기록하세요.
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Input
              label="이름"
              placeholder="홍길동"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              error={errors.name}
            />
            <Input
              label="이메일"
              placeholder="example@calsnap.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            <Input
              label="비밀번호"
              placeholder="8자 이상 입력"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
            />
            <PasswordStrength password={password} />
            <Input
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              error={errors.confirmPassword}
            />
            <Button
              title="회원가입"
              onPress={handleSignup}
              loading={loading}
              disabled={!name || !email || !password || !confirmPassword}
              style={{ marginTop: Spacing.sm }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: Spacing.xxl,
              paddingBottom: Spacing.md,
            }}
          >
            <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary }}>이미 계정이 있으신가요? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text
                style={{
                  fontSize: FontSize.sm,
                  fontWeight: "700",
                  color: colors.primary,
                  textDecorationLine: "underline",
                }}
              >
                로그인
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
