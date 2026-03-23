import { View, Text } from "react-native";
import { FontSize, Spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

interface CalorieRingProps {
  consumed: number;
  goal: number;
  size?: number;
  strokeWidth?: number;
}

export default function CalorieRing({ consumed, goal, size = 220, strokeWidth = 14 }: CalorieRingProps) {
  const { colors } = useTheme();
  const remaining = Math.max(goal - consumed, 0);
  const progress = Math.min(consumed / goal, 1);
  const innerSize = size - strokeWidth * 2;
  const rotation = progress * 360;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: colors.divider,
        }}
      />

      {progress > 0 && (
        <View style={{ position: "absolute", width: size, height: size, overflow: "hidden" }}>
          <View style={{ position: "absolute", top: 0, width: size / 2, height: size, left: 0, overflow: "hidden" }}>
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: strokeWidth,
                borderColor: colors.primary,
                borderLeftColor: "transparent",
                borderBottomColor: "transparent",
                transform: [{ rotate: `${Math.min(rotation, 180)}deg` }],
              }}
            />
          </View>
          {rotation > 180 && (
            <View style={{ position: "absolute", top: 0, width: size / 2, height: size, right: 0, overflow: "hidden" }}>
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  borderWidth: strokeWidth,
                  borderColor: colors.primary,
                  borderLeftColor: "transparent",
                  borderBottomColor: "transparent",
                  transform: [{ rotate: `${rotation}deg` }],
                }}
              />
            </View>
          )}
        </View>
      )}

      <View
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary, marginBottom: Spacing.xs }}>
          남은 칼로리
        </Text>
        <Text style={{ fontSize: 40, fontWeight: "800", color: colors.text }}>{remaining.toLocaleString()}</Text>
        <Text style={{ fontSize: FontSize.sm, color: colors.textLight, marginTop: 2 }}>
          / {goal.toLocaleString()} <Text style={{ fontSize: FontSize.xs, fontWeight: "600" }}>KCAL</Text>
        </Text>
      </View>
    </View>
  );
}
