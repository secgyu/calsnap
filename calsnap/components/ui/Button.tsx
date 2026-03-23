import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from "react-native";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "filled" | "outlined";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = "filled",
  loading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const { colors } = useTheme();
  const isFilled = variant === "filled";

  return (
    <TouchableOpacity
      style={[
        {
          height: 52,
          borderRadius: BorderRadius.lg,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: Spacing.lg,
        },
        isFilled
          ? { backgroundColor: colors.primary }
          : { backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.primary },
        disabled && { opacity: 0.5 },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isFilled ? "#FFFFFF" : colors.primary} />
      ) : (
        <Text
          style={[
            { fontSize: FontSize.md, fontWeight: "700" },
            { color: isFilled ? "#FFFFFF" : colors.primary },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
