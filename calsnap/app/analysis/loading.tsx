import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LightTheme as Colors, FontSize, Spacing } from "@/constants/theme";

export default function AnalysisLoadingScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    const timeout = setTimeout(() => {
      router.replace({
        pathname: "/analysis/result",
        params: { imageUri: imageUri || "" },
      });
    }, 3500);

    return () => clearTimeout(timeout);
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.backgroundImage} contentFit="cover" />}
      <View style={styles.overlay} />

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <MaterialCommunityIcons name="creation" size={48} color={Colors.white} />
          </Animated.View>
        </Animated.View>

        <Text style={styles.title}>AI가 음식을 분석하고 있어요...</Text>
        <Text style={styles.subtitle}>이미지의 영양 정보를 파악하여{"\n"}정확한 식단을 기록하고 있습니다.</Text>

        <View style={styles.tagsRow}>
          <View style={styles.tag}>
            <MaterialCommunityIcons name="silverware-fork-knife" size={14} color={Colors.primary} />
            <Text style={styles.tagText}>음식 인식</Text>
          </View>
          <View style={styles.tag}>
            <MaterialCommunityIcons name="fire" size={14} color={Colors.warning} />
            <Text style={styles.tagText}>칼로리 계산</Text>
          </View>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressBarBg}>
          <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
        </View>
        <View style={styles.progressInfo}>
          <Text style={styles.engineText}>SCANNING ENGINE V2.4</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: "800",
    color: Colors.white,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  tagsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    gap: 6,
  },
  tagText: {
    fontSize: FontSize.sm,
    color: Colors.white,
    fontWeight: "500",
  },
  progressSection: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 60,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: Spacing.sm,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  engineText: {
    fontSize: FontSize.xs,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "600",
    letterSpacing: 1,
  },
});
