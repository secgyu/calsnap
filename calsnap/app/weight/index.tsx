import { useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Svg, { Path, Circle, Line, Text as SvgText, Defs, LinearGradient, Stop } from "react-native-svg";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { getWeightSummary, WeightSummary } from "@/services/weight";
import WeightEntryModal from "@/components/weight/WeightEntryModal";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CHART_WIDTH = SCREEN_WIDTH - Spacing.lg * 2 - Spacing.lg * 2;
const CHART_HEIGHT = 160;

export default function WeightScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<WeightSummary | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getWeightSummary();
      setSummary(data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    const h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, "0");
    const period = h < 12 ? "오전" : "오후";
    const hour12 = h % 12 || 12;
    return `오늘 ${period} ${hour12}:${m}`;
  };

  const changeText = (val: number) => {
    if (val === 0) return "0kg";
    const sign = val > 0 ? "+" : "";
    return `${sign}${val}kg`;
  };

  const changeColor = (val: number) => {
    if (val < 0) return colors.primary;
    if (val > 0) return colors.error;
    return colors.textSecondary;
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  const current = summary?.currentWeight || 0;
  const goal = summary?.goalWeight || 0;
  const diff = goal > 0 ? +(current - goal).toFixed(1) : 0;
  const chartData = summary?.chartData || [];
  const records = summary?.recentRecords || [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.md,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: FontSize.lg, fontWeight: "700", color: colors.text }}>체중 기록</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl }}
      >
        {/* 현재 체중 카드 */}
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: BorderRadius.lg,
            padding: Spacing.lg,
            alignItems: "center",
            marginBottom: Spacing.md,
            borderWidth: 1,
            borderColor: colors.divider,
          }}
        >
          <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary, marginBottom: Spacing.xs }}>
            현재 체중
          </Text>
          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            <Text style={{ fontSize: 48, fontWeight: "800", color: colors.text }}>{current.toFixed(1)}</Text>
            <Text style={{ fontSize: FontSize.xl, fontWeight: "600", color: colors.textSecondary, marginLeft: 4 }}>
              kg
            </Text>
          </View>
          <Text style={{ fontSize: FontSize.xs, color: colors.textLight, marginTop: Spacing.xs }}>
            마지막 기록: {formatDate(summary?.lastRecordedAt || null)}
          </Text>
          <TouchableOpacity
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: colors.primary,
              justifyContent: "center",
              alignItems: "center",
              marginTop: Spacing.md,
            }}
            onPress={() => setModalVisible(true)}
          >
            <MaterialCommunityIcons name="plus" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* 변화량 */}
        <View style={{ flexDirection: "row", gap: Spacing.sm, marginBottom: Spacing.lg }}>
          {[
            { label: "이번주", value: summary?.weekChange || 0 },
            { label: "이번달", value: summary?.monthChange || 0 },
            { label: "목표까지", value: diff },
          ].map((item) => (
            <View
              key={item.label}
              style={{
                flex: 1,
                backgroundColor: colors.card,
                borderRadius: BorderRadius.md,
                padding: Spacing.md,
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.divider,
              }}
            >
              <Text style={{ fontSize: FontSize.xs, color: colors.textSecondary, marginBottom: 4 }}>{item.label}</Text>
              <Text style={{ fontSize: FontSize.md, fontWeight: "700", color: changeColor(item.value) }}>
                {changeText(item.value)}
              </Text>
            </View>
          ))}
        </View>

        {/* 차트 */}
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: BorderRadius.lg,
            padding: Spacing.lg,
            marginBottom: Spacing.lg,
            borderWidth: 1,
            borderColor: colors.divider,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: Spacing.md,
            }}
          >
            <Text style={{ fontSize: FontSize.md, fontWeight: "700", color: colors.text }}>체중 변화 추이</Text>
            <Text style={{ fontSize: FontSize.xs, color: colors.textSecondary }}>최근 30일</Text>
          </View>
          {chartData.length >= 2 ? (
            <WeightChart data={chartData} goalWeight={goal} colors={colors} />
          ) : (
            <View style={{ height: CHART_HEIGHT, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontSize: FontSize.sm, color: colors.textLight }}>
                데이터가 2개 이상이면 그래프가 표시됩니다
              </Text>
            </View>
          )}
        </View>

        {/* 최근 기록 */}
        <View style={{ marginBottom: Spacing.lg }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: Spacing.md,
            }}
          >
            <Text style={{ fontSize: FontSize.md, fontWeight: "700", color: colors.text }}>최근 기록</Text>
          </View>

          {records.length === 0 && (
            <Text
              style={{
                fontSize: FontSize.sm,
                color: colors.textLight,
                textAlign: "center",
                paddingVertical: Spacing.lg,
              }}
            >
              아직 기록이 없습니다
            </Text>
          )}

          {records.map((r, idx) => {
            const prev = idx < records.length - 1 ? records[idx + 1] : null;
            const delta = prev ? +(r.weight - prev.weight).toFixed(1) : 0;

            return (
              <View
                key={r.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: colors.card,
                  borderRadius: BorderRadius.md,
                  padding: Spacing.md,
                  marginBottom: Spacing.sm,
                  borderWidth: 1,
                  borderColor: colors.divider,
                }}
              >
                <View
                  style={{
                    width: 4,
                    height: 40,
                    borderRadius: 2,
                    backgroundColor: colors.primary,
                    marginRight: Spacing.md,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: FontSize.md, fontWeight: "600", color: colors.text }}>{r.date}</Text>
                  <Text style={{ fontSize: FontSize.xs, color: colors.textSecondary }}>{r.time}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontSize: FontSize.lg, fontWeight: "700", color: colors.text }}>{r.weight}kg</Text>
                  {delta !== 0 && (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                      <MaterialCommunityIcons
                        name={delta > 0 ? "arrow-up" : "arrow-down"}
                        size={12}
                        color={delta > 0 ? colors.error : colors.primary}
                      />
                      <Text
                        style={{
                          fontSize: FontSize.xs,
                          color: delta > 0 ? colors.error : colors.primary,
                          fontWeight: "600",
                        }}
                      >
                        {Math.abs(delta)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* 오늘의 조언 */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.primaryLight,
            borderRadius: BorderRadius.lg,
            padding: Spacing.lg,
            gap: Spacing.md,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.primary,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons name="lightbulb-outline" size={20} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: FontSize.sm, fontWeight: "700", color: colors.text, marginBottom: 2 }}>
              오늘의 조언
            </Text>
            <Text style={{ fontSize: FontSize.xs, color: colors.textSecondary, lineHeight: 18 }}>
              일정한 시간에 체중을 측정하는 것이 가장 정확합니다. 아침 공복 상태가 가장 추천되는 시간대입니다.
            </Text>
          </View>
        </View>
      </ScrollView>

      <WeightEntryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        currentWeight={current}
        onSaved={fetchData}
      />
    </SafeAreaView>
  );
}

function WeightChart({
  data,
  goalWeight,
  colors,
}: {
  data: { date: string; weight: number }[];
  goalWeight: number;
  colors: any;
}) {
  if (data.length < 2) return null;

  const weights = data.map((d) => d.weight);
  const minW = Math.min(...weights, goalWeight > 0 ? goalWeight : Infinity) - 1;
  const maxW = Math.max(...weights, goalWeight > 0 ? goalWeight : 0) + 1;
  const range = maxW - minW || 1;

  const padLeft = 0;
  const padRight = 10;
  const padTop = 20;
  const padBottom = 30;
  const w = CHART_WIDTH - padLeft - padRight;
  const h = CHART_HEIGHT - padTop - padBottom;

  const points = data.map((d, i) => ({
    x: padLeft + (i / (data.length - 1)) * w,
    y: padTop + (1 - (d.weight - minW) / range) * h,
    weight: d.weight,
    date: d.date,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = `${pathD} L ${points[points.length - 1].x} ${padTop + h} L ${points[0].x} ${padTop + h} Z`;

  const goalY = goalWeight > 0 ? padTop + (1 - (goalWeight - minW) / range) * h : -100;

  const labelCount = Math.min(data.length, 5);
  const step = Math.max(1, Math.floor((data.length - 1) / (labelCount - 1)));

  return (
    <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
      <Defs>
        <LinearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors.primary} stopOpacity="0.3" />
          <Stop offset="1" stopColor={colors.primary} stopOpacity="0.02" />
        </LinearGradient>
      </Defs>

      <Path d={areaD} fill="url(#chartGrad)" />
      <Path
        d={pathD}
        fill="none"
        stroke={colors.primary}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {goalWeight > 0 && goalY >= padTop && goalY <= padTop + h && (
        <>
          <Line
            x1={padLeft}
            y1={goalY}
            x2={padLeft + w}
            y2={goalY}
            stroke={colors.textLight}
            strokeWidth={1}
            strokeDasharray="4,4"
          />
          <SvgText x={padLeft + w - 4} y={goalY - 6} fontSize={10} fill={colors.textSecondary} textAnchor="end">
            목표 {goalWeight}kg
          </SvgText>
        </>
      )}

      {points.map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r={3.5} fill={colors.primary} stroke="#FFF" strokeWidth={2} />
      ))}

      {points
        .filter((_, i) => i % step === 0 || i === points.length - 1)
        .map((p) => {
          const label = p.date.slice(5).replace("-", "/");
          return (
            <SvgText
              key={p.date}
              x={p.x}
              y={padTop + h + 18}
              fontSize={10}
              fill={colors.textSecondary}
              textAnchor="middle"
            >
              {label}
            </SvgText>
          );
        })}
    </Svg>
  );
}
