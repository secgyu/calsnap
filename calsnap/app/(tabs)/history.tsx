import { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Animated, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { WEEKDAYS, formatDateKey } from "@/utils/date";
import { getDailyRecord, getWeeklyStats } from "@/services/record";
import { DailyRecord, WeeklyStats } from "@/types/record";
import WeekCalendar from "@/components/history/WeekCalendar";
import DailySummaryCard from "@/components/history/DailySummaryCard";
import DailyMealList from "@/components/history/DailyMealList";
import WeeklyStatsCard from "@/components/history/WeeklyStatsCard";
import EmptyState from "@/components/history/EmptyState";

export default function HistoryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [weekOffset, setWeekOffset] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [dailyRecord, setDailyRecord] = useState<DailyRecord | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [loading, setLoading] = useState(true);

  const selectedKey = formatDateKey(selectedDate);
  const isToday = selectedKey === formatDateKey(today);
  const isFuture = selectedDate > today;

  useEffect(() => {
    setLoading(true);
    getDailyRecord(selectedKey)
      .then(setDailyRecord)
      .catch(() => setDailyRecord(null))
      .finally(() => setLoading(false));
  }, [selectedKey]);

  useEffect(() => {
    getWeeklyStats()
      .then(setWeeklyStats)
      .catch(() => setWeeklyStats({ avgCalories: "0", achievementRate: "0", recordedDays: "0" }));
  }, []);

  const animateTransition = (cb: () => void) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }).start(() => {
      cb();
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: Spacing.lg,
            paddingTop: Spacing.md,
            paddingBottom: Spacing.sm,
          }}
        >
          <Text style={{ fontSize: FontSize.xxl, fontWeight: "800", color: colors.text }}>식단 기록</Text>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primaryLight,
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.xs,
              borderRadius: 9999,
            }}
            onPress={() => {
              setWeekOffset(0);
              setSelectedDate(today);
            }}
          >
            <Text style={{ fontSize: FontSize.sm, fontWeight: "700", color: colors.primary }}>오늘</Text>
          </TouchableOpacity>
        </View>

        <WeekCalendar
          weekOffset={weekOffset}
          selectedDate={selectedDate}
          today={today}
          onSelectDate={(d) => animateTransition(() => setSelectedDate(d))}
          onPrevWeek={() => setWeekOffset((p) => p - 1)}
          onNextWeek={() => {
            if (weekOffset < 0) setWeekOffset((p) => p + 1);
          }}
        />

        <Animated.View style={{ paddingHorizontal: Spacing.lg, opacity: fadeAnim }}>
          <Text style={{ fontSize: FontSize.lg, fontWeight: "700", color: colors.text, marginBottom: Spacing.md }}>
            {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
            {isToday ? " (오늘)" : ` (${WEEKDAYS[selectedDate.getDay()]})`}
          </Text>

          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: Spacing.xl }} />
          ) : isFuture ? (
            <EmptyState type="future" />
          ) : dailyRecord && dailyRecord.meals.length > 0 ? (
            <>
              <DailySummaryCard record={dailyRecord} />
              <DailyMealList
                meals={dailyRecord.meals}
                onMealPress={(id) => router.push({ pathname: "/food/[id]", params: { id } })}
              />
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: colors.primaryLight,
                  paddingVertical: Spacing.md,
                  borderRadius: 16,
                  marginTop: Spacing.sm,
                  marginBottom: Spacing.lg,
                  gap: Spacing.xs,
                }}
                onPress={() => router.push({ pathname: "/history/[date]", params: { date: selectedKey } })}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="chart-box-outline" size={20} color={colors.primary} />
                <Text style={{ fontSize: FontSize.sm, fontWeight: "700", color: colors.primary }}>
                  상세 영양 분석 보기
                </Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.primary} />
              </TouchableOpacity>
            </>
          ) : (
            <EmptyState type="no-record" onAddPress={() => router.push("/food/search")} />
          )}
        </Animated.View>

        {weeklyStats && <WeeklyStatsCard stats={weeklyStats} />}
      </ScrollView>
    </SafeAreaView>
  );
}
