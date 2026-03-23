import { TextInput, View, Text, TextInputProps, TouchableOpacity } from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

interface InputProps extends TextInputProps {
  label: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  error?: string;
}

export default function Input({ label, icon, error, secureTextEntry, style, ...rest }: InputProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPassword = secureTextEntry !== undefined;

  return (
    <View style={{ marginBottom: Spacing.md }}>
      <Text style={{ fontSize: FontSize.sm, fontWeight: "600", color: colors.primary, marginBottom: Spacing.xs }}>
        {label}
      </Text>
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.card,
            borderRadius: BorderRadius.md,
            borderWidth: 1.5,
            borderColor: colors.border,
            paddingHorizontal: Spacing.md,
            height: 52,
          },
          focused && { borderColor: colors.primary },
          error ? { borderColor: colors.error } : undefined,
        ]}
      >
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={focused ? colors.primary : colors.textLight}
            style={{ marginRight: Spacing.sm }}
          />
        )}
        <TextInput
          style={[{ flex: 1, fontSize: FontSize.md, color: colors.text, height: "100%" }, style]}
          placeholderTextColor={colors.textLight}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={isPassword && !passwordVisible}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name={passwordVisible ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={colors.textLight}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={{ fontSize: FontSize.xs, color: colors.error, marginTop: Spacing.xs }}>{error}</Text>}
    </View>
  );
}
