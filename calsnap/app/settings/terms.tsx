import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

const TERMS_SECTIONS = [
  {
    title: "제1조 (목적)",
    content:
      '이 약관은 CalSnap(이하 "앱")이 제공하는 서비스의 이용 조건 및 절차, 회사와 회원 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.',
  },
  {
    title: "제2조 (정의)",
    content:
      '1. "서비스"란 앱이 제공하는 음식 사진 분석, 칼로리 추적, 영양 정보 제공 등 모든 관련 서비스를 의미합니다.\n2. "회원"이란 앱에 가입하여 서비스를 이용하는 자를 의미합니다.\n3. "콘텐츠"란 회원이 서비스 내에 게시한 사진, 텍스트, 데이터 등을 의미합니다.',
  },
  {
    title: "제3조 (약관의 효력 및 변경)",
    content:
      "1. 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.\n2. 회사는 필요한 경우 관련 법령을 위반하지 않는 범위 내에서 이 약관을 변경할 수 있으며, 변경된 약관은 공지 후 효력이 발생합니다.",
  },
  {
    title: "제4조 (서비스의 제공)",
    content:
      "1. 회사는 다음 서비스를 제공합니다:\n   - AI 기반 음식 사진 분석 및 칼로리 추정\n   - 일일/주간/월간 칼로리 섭취 추적\n   - 영양소 분석 및 식단 관리\n   - 개인 맞춤 칼로리 목표 설정\n2. 서비스는 연중무휴, 1일 24시간 제공을 원칙으로 합니다.",
  },
  {
    title: "제5조 (회원가입)",
    content:
      "1. 회원가입은 이용자가 약관의 내용에 동의하고, 회원가입 신청을 한 후 회사가 이를 승낙함으로써 성립됩니다.\n2. 회사는 다음에 해당하는 신청에 대해 승낙을 거부할 수 있습니다:\n   - 타인의 명의를 이용한 경우\n   - 허위 정보를 기재한 경우",
  },
  {
    title: "제6조 (회원의 의무)",
    content:
      "1. 회원은 서비스 이용 시 관계 법령, 이 약관, 이용안내 등을 준수하여야 합니다.\n2. 회원은 타인의 개인정보를 수집, 저장, 공개하는 행위를 해서는 안 됩니다.\n3. 회원은 서비스를 이용하여 얻은 정보를 회사의 사전 동의 없이 상업적으로 이용해서는 안 됩니다.",
  },
  {
    title: "제7조 (서비스 이용 제한)",
    content:
      "회사는 회원이 이 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 서비스 이용을 경고, 일시정지, 계약 해지 등으로 단계적으로 제한할 수 있습니다.",
  },
  {
    title: "제8조 (면책조항)",
    content:
      "1. AI 기반 칼로리 분석은 참고용이며, 정확한 의료/영양 상담을 대체하지 않습니다.\n2. 회사는 천재지변, 전쟁 등 불가항력으로 인해 서비스를 제공할 수 없는 경우 책임을 면합니다.\n3. 회원의 귀책사유로 인한 서비스 이용 장애에 대해 회사는 책임을 지지 않습니다.",
  },
  {
    title: "제9조 (준거법 및 관할)",
    content: "이 약관의 해석 및 분쟁 해결은 대한민국 법률에 따르며, 관할 법원은 회사 소재지 관할 법원으로 합니다.",
  },
];

export default function TermsScreen() {
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
        <Text style={{ fontSize: FontSize.lg, fontWeight: "700", color: colors.primary }}>이용약관</Text>
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
          <MaterialCommunityIcons name="information-outline" size={18} color={colors.primary} />
          <Text style={{ flex: 1, fontSize: FontSize.sm, color: colors.primary, fontWeight: "600" }}>
            최종 업데이트: 2026년 3월 1일
          </Text>
        </View>

        {TERMS_SECTIONS.map((section, idx) => (
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
