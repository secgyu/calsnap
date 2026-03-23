import { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { login as loginApi } from "@/services/auth";

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "이메일을 입력해주세요";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "올바른 이메일 형식이 아닙니다";
    if (!password) e.password = "비밀번호를 입력해주세요";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await loginApi(email, password);
      router.replace("/(tabs)");
    } catch (err: any) {
      const msg = err.response?.data?.message || "로그인에 실패했습니다";
      setErrors({ password: msg });
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
            paddingTop: Spacing.xxl,
            paddingBottom: Spacing.xl,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ alignItems: "center", marginBottom: Spacing.xl }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: colors.primaryLight,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: Spacing.sm,
              }}
            >
              <MaterialCommunityIcons name="camera-outline" size={32} color={colors.primary} />
            </View>
            <Text style={{ fontSize: FontSize.xl, fontWeight: "800", color: colors.primary }}>CalSnap</Text>
          </View>

          <Text
            style={{
              fontSize: FontSize.xxl,
              fontWeight: "800",
              color: colors.text,
              textAlign: "center",
              marginBottom: Spacing.xs,
            }}
          >
            다시 오셨군요!
          </Text>
          <Text
            style={{
              fontSize: FontSize.md,
              color: colors.textSecondary,
              textAlign: "center",
              marginBottom: Spacing.xl,
            }}
          >
            건강한 식습관을 이어가볼까요?
          </Text>

          <View style={{ flex: 1 }}>
            <Input
              label=""
              icon="email-outline"
              placeholder="이메일 주소"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            <Input
              label=""
              icon="lock-outline"
              placeholder="비밀번호"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
            />
            <Button
              title="로그인"
              onPress={handleLogin}
              loading={loading}
              disabled={!email || !password}
              style={{ marginTop: Spacing.sm }}
            />
            <TouchableOpacity style={{ alignSelf: "center", marginTop: Spacing.md }}>
              <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary }}>비밀번호를 잊으셨나요?</Text>
            </TouchableOpacity>
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
            <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary }}>계정이 없으신가요? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
              <Text
                style={{
                  fontSize: FontSize.sm,
                  fontWeight: "700",
                  color: colors.primary,
                  textDecorationLine: "underline",
                }}
              >
                회원가입
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
