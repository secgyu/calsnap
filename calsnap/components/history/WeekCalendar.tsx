import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { WEEKDAYS, formatDateKey, formatMonthLabel, getWeekDates } from "@/utils/date";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

interface WeekCalendarProps {
  weekOffset: number;
  selectedDate: Date;
  today: Date;
  recordDates: Set<string>;
  onSelectDate: (date: Date) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

export default function WeekCalendar({
  weekOffset,
  selectedDate,
  today,
  recordDates,
  onSelectDate,
  onPrevWeek,
  onNextWeek,
}: WeekCalendarProps) {
  const { colors } = useTheme();
  const baseDate = new Date(today);
  baseDate.setDate(today.getDate() + weekOffset * 7);
  const weekDates = getWeekDates(baseDate);
  const selectedKey = formatDateKey(selectedDate);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: Spacing.lg,
          marginBottom: Spacing.md,
        }}
      >
        <TouchableOpacity onPress={onPrevWeek} style={{ padding: Spacing.xs }}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: FontSize.lg, fontWeight: "700", color: colors.text }}>
          {formatMonthLabel(baseDate)}
        </Text>
        <TouchableOpacity onPress={onNextWeek} style={{ padding: Spacing.xs }} disabled={weekOffset >= 0}>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={weekOffset >= 0 ? colors.border : colors.text}
          />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", paddingHorizontal: Spacing.md, marginBottom: Spacing.lg }}>
        {weekDates.map((date, index) => {
          const dateKey = formatDateKey(date);
          const isSelected = dateKey === selectedKey;
          const isTodayDate = dateKey === formatDateKey(today);
          const hasData = recordDates.has(dateKey);
          const isFuture = date > today;

          return (
            <TouchableOpacity
              key={dateKey}
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: Spacing.sm,
                borderRadius: BorderRadius.lg,
                backgroundColor: isSelected ? colors.primary : "transparent",
              }}
              onPress={() => onSelectDate(date)}
              activeOpacity={0.7}
            >
              <Text
                style={{ fontSize: FontSize.xs, color: isSelected ? "#FFFFFF" : colors.textSecondary, marginBottom: 6 }}
              >
                {WEEKDAYS[index]}
              </Text>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: isSelected ? "rgba(255,255,255,0.25)" : "transparent",
                  borderWidth: isTodayDate && !isSelected ? 2 : 0,
                  borderColor: colors.primary,
                }}
              >
                <Text
                  style={{
                    fontSize: FontSize.md,
                    fontWeight: "700",
                    color: isSelected ? "#FFFFFF" : isFuture ? colors.textLight : colors.text,
                  }}
                >
                  {date.getDate()}
                </Text>
              </View>
              {hasData && !isSelected && (
                <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: colors.primary, marginTop: 4 }} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}
