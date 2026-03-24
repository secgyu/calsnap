import { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { forgotPassword } from "@/services/password";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError("이메일을 입력해주세요");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("올바른 이메일 형식이 아닙니다");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await forgotPassword(email);
      setSent(true);
    } catch {
      setError("요청에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: Spacing.lg,
            paddingVertical: Spacing.md,
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={{ flex: 1, textAlign: "center", fontSize: FontSize.lg, fontWeight: "700", color: colors.text }}>
            Reset Password
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: Spacing.xl }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.primaryLight,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: Spacing.lg,
            }}
          >
            <MaterialCommunityIcons name="check-circle" size={48} color={colors.primary} />
          </View>

          <Text
            style={{
              fontSize: FontSize.xxl,
              fontWeight: "800",
              color: colors.text,
              textAlign: "center",
              marginBottom: Spacing.sm,
            }}
          >
            이메일을 확인해주세요!
          </Text>

          <Text
            style={{
              fontSize: FontSize.md,
              color: colors.primary,
              textAlign: "center",
              fontWeight: "600",
              marginBottom: Spacing.xs,
            }}
          >
            {email}으로
          </Text>
          <Text
            style={{
              fontSize: FontSize.md,
              color: colors.textSecondary,
              textAlign: "center",
              marginBottom: Spacing.xl,
            }}
          >
            비밀번호 재설정 링크를 보냈습니다.
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.primaryLight,
              borderRadius: BorderRadius.md,
              padding: Spacing.md,
              gap: Spacing.sm,
              marginBottom: Spacing.xxl,
            }}
          >
            <MaterialCommunityIcons name="information" size={20} color={colors.primary} />
            <Text style={{ flex: 1, fontSize: FontSize.xs, color: colors.textSecondary, lineHeight: 18 }}>
              메일이 도착하지 않았다면 스팸 메일함을 확인하거나 잠시 후 다시 시도해주세요.
            </Text>
          </View>

          <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
            <Text style={{ fontSize: FontSize.md, fontWeight: "600", color: colors.primary }}>로그인으로 돌아가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.md,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: "center", fontSize: FontSize.lg, fontWeight: "700", color: colors.text }}>
          Reset Password
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={{ fontSize: FontSize.xxxl, fontWeight: "800", color: colors.text, marginBottom: Spacing.sm }}>
            비밀번호 찾기
          </Text>
          <Text
            style={{ fontSize: FontSize.md, color: colors.textSecondary, marginBottom: Spacing.xl, lineHeight: 22 }}
          >
            가입한 이메일 주소를 입력하면 비밀번호 재설정 링크를 보내드립니다.
          </Text>

          <Input
            label="이메일"
            icon="email-outline"
            placeholder="이메일을 입력하세요"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setError("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.primaryLight,
              borderRadius: BorderRadius.md,
              padding: Spacing.md,
              gap: Spacing.sm,
              marginTop: Spacing.md,
              marginBottom: Spacing.xl,
            }}
          >
            <MaterialCommunityIcons name="shield-check" size={20} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: FontSize.sm, fontWeight: "700", color: colors.text }}>계정 보안</Text>
              <Text style={{ fontSize: FontSize.xs, color: colors.textSecondary, lineHeight: 16, marginTop: 2 }}>
                CalSnap은 사용자의 개인정보를 안전하게 보호합니다.
              </Text>
            </View>
          </View>

          <View style={{ flex: 1 }} />

          <Button
            title="재설정 링크 보내기 >"
            onPress={handleSubmit}
            loading={loading}
            disabled={!email.trim()}
            style={{ marginBottom: Spacing.md }}
          />

          <View
            style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: Spacing.xl }}
          >
            <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary }}>기억이 나셨나요? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text
                style={{
                  fontSize: FontSize.sm,
                  fontWeight: "700",
                  color: colors.primary,
                  textDecorationLine: "underline",
                }}
              >
                로그인하기
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
