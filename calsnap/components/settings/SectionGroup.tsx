import { View, Text, TouchableOpacity, Switch } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BorderRadius, FontSize, Spacing, ThemeColors } from "@/constants/theme";

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export interface SettingItem {
  icon: IconName;
  label: string;
  value?: string;
  onPress?: () => void;
  type?: "link" | "toggle" | "danger";
  toggleValue?: boolean;
  onToggle?: (v: boolean) => void;
}

interface SectionGroupProps {
  title: string;
  items: SettingItem[];
  colors: ThemeColors;
}

export default function SectionGroup({ title, items, colors }: SectionGroupProps) {
  return (
    <View style={{ marginBottom: Spacing.md }}>
      {title ? (
        <Text
          style={{
            fontSize: FontSize.sm,
            fontWeight: "700",
            color: colors.textSecondary,
            marginBottom: Spacing.sm,
            marginLeft: Spacing.xs,
          }}
        >
          {title}
        </Text>
      ) : null}
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: BorderRadius.lg,
          borderWidth: 1,
          borderColor: colors.divider,
          overflow: "hidden",
        }}
      >
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            style={[
              {
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 14,
                paddingHorizontal: Spacing.md,
                gap: Spacing.md,
              },
              index < items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider },
            ]}
            onPress={item.onPress}
            activeOpacity={item.type === "toggle" ? 1 : 0.7}
            disabled={item.type === "toggle"}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={22}
              color={item.type === "danger" ? colors.error : colors.textSecondary}
            />
            <Text
              style={{
                flex: 1,
                fontSize: FontSize.md,
                fontWeight: "600",
                color: item.type === "danger" ? colors.error : colors.text,
              }}
            >
              {item.label}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {item.type === "toggle" ? (
                <Switch
                  value={item.toggleValue}
                  onValueChange={item.onToggle}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={item.toggleValue ? colors.primary : colors.textLight}
                />
              ) : item.value ? (
                <Text style={{ fontSize: FontSize.sm, color: colors.textLight, marginRight: 4 }}>{item.value}</Text>
              ) : item.onPress && item.type !== "danger" ? (
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textLight} />
              ) : null}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
