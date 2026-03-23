import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

const PRIVACY_SECTIONS = [
  {
    title: "1. 개인정보 수집 항목",
    content:
      "CalSnap은 서비스 제공을 위해 다음 개인정보를 수집합니다:\n\n" +
      "• 필수항목: 이메일 주소, 비밀번호(암호화 저장), 이름\n" +
      "• 선택항목: 성별, 나이, 키, 몸무게, 활동량\n" +
      "• 자동수집: 기기 정보, 앱 사용 기록, 촬영한 음식 사진",
  },
  {
    title: "2. 개인정보 수집 목적",
    content:
      "수집된 개인정보는 다음 목적으로만 사용됩니다:\n\n" +
      "• 회원 식별 및 서비스 제공\n" +
      "• AI 기반 음식 분석 및 칼로리 추정\n" +
      "• 개인 맞춤 칼로리 목표 및 영양 분석\n" +
      "• 서비스 개선 및 통계 분석 (비식별 처리)",
  },
  {
    title: "3. 개인정보 보유 및 이용 기간",
    content:
      "• 회원 탈퇴 시 즉시 삭제 (복구 불가)\n" +
      "• 법령에 의한 보존 필요가 있는 경우 해당 기간 동안 보관\n" +
      "  - 계약 또는 청약 철회 기록: 5년\n" +
      "  - 소비자 불만 또는 분쟁 처리 기록: 3년\n" +
      "  - 접속 기록: 3개월",
  },
  {
    title: "4. 개인정보의 제3자 제공",
    content:
      "CalSnap은 원칙적으로 회원의 개인정보를 제3자에게 제공하지 않습니다.\n\n" +
      "다만, 다음의 경우에는 예외로 합니다:\n" +
      "• 회원이 사전에 동의한 경우\n" +
      "• 법령에 의거하여 요청이 있는 경우",
  },
  {
    title: "5. 음식 사진 데이터 처리",
    content:
      "• 촬영된 음식 사진은 AI 분석을 위해 서버로 전송됩니다.\n" +
      "• 분석 완료 후 서버의 사진은 30일 이내 자동 삭제됩니다.\n" +
      "• 사진 데이터는 AI 모델 개선에 사용될 수 있으나, 개인 식별이 불가능한 형태로만 처리됩니다.\n" +
      "• 회원은 설정에서 사진 데이터의 학습 활용을 거부할 수 있습니다.",
  },
  {
    title: "6. 개인정보 보호 조치",
    content:
      "회사는 개인정보 보호를 위해 다음 조치를 취합니다:\n\n" +
      "• 비밀번호 암호화 저장 (bcrypt)\n" +
      "• SSL/TLS 통신 암호화\n" +
      "• 접근 권한 관리 및 접근 로그 기록\n" +
      "• 정기적 보안 점검 및 취약점 개선",
  },
  {
    title: "7. 이용자의 권리",
    content:
      "회원은 언제든지 다음 권리를 행사할 수 있습니다:\n\n" +
      "• 개인정보 열람, 수정, 삭제 요청\n" +
      "• 개인정보 처리 정지 요청\n" +
      "• 회원 탈퇴 (설정 > 회원 탈퇴)\n\n" +
      "요청은 앱 내 설정 또는 고객센터를 통해 처리됩니다.",
  },
  {
    title: "8. 개인정보 보호 책임자",
    content:
      "• 성명: CalSnap 개인정보보호팀\n" +
      "• 이메일: privacy@calsnap.app\n\n" +
      "개인정보 관련 문의사항은 위 이메일로 연락 주시기 바랍니다.",
  },
];

export default function PrivacyScreen() {
  const router = useRouter();
  const { colors } = useTheme();

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
        <Text style={{ fontSize: FontSize.lg, fontWeight: "700", color: colors.primary }}>개인정보처리방침</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: colors.primaryLight,
            borderRadius: BorderRadius.md,
            padding: Spacing.md,
            marginBottom: Spacing.lg,
            flexDirection: "row",
            alignItems: "center",
            gap: Spacing.sm,
          }}
        >
          <MaterialCommunityIcons name="shield-check-outline" size={18} color={colors.primary} />
          <Text style={{ flex: 1, fontSize: FontSize.sm, color: colors.primary, fontWeight: "600" }}>
            시행일: 2026년 3월 1일
          </Text>
        </View>

        {PRIVACY_SECTIONS.map((section, idx) => (
          <View key={idx} style={{ marginBottom: Spacing.lg }}>
            <Text style={{ fontSize: FontSize.md, fontWeight: "700", color: colors.text, marginBottom: Spacing.sm }}>
              {section.title}
            </Text>
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: BorderRadius.md,
                padding: Spacing.md,
                borderWidth: 1,
                borderColor: colors.divider,
              }}
            >
              <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary, lineHeight: 22 }}>
                {section.content}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
