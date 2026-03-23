import { View, Text } from "react-native";
import { FontSize, Spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

function getPasswordStrength(password: string) {
  if (!password) return { level: 0, label: "", color: "#E5E7EB" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: "약함", color: "#EF4444" };
  if (score === 2) return { level: 2, label: "보통", color: "#F59E0B" };
  if (score === 3) return { level: 3, label: "강함", color: "#3B82F6" };
  return { level: 4, label: "안전함", color: "#4CAD53" };
}

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const { colors } = useTheme();
  if (!password) return null;

  const strength = getPasswordStrength(password);

  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: Spacing.md, marginTop: -Spacing.sm }}>
      <Text style={{ fontSize: FontSize.xs, color: colors.textSecondary, marginRight: Spacing.sm }}>보안 강도</Text>
      <View style={{ flexDirection: "row", flex: 1, gap: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor: i <= strength.level ? strength.color : colors.border,
            }}
          />
        ))}
      </View>
      <Text style={{ fontSize: FontSize.xs, fontWeight: "600", color: strength.color, marginLeft: Spacing.sm }}>
        {strength.label}
      </Text>
    </View>
  );
}
