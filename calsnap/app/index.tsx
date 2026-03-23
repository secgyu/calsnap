import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LightTheme, FontSize, Spacing } from "@/constants/theme";
import { isAuthenticated, hasRefreshToken, refreshSession } from "@/services/auth";
import { isBiometricAvailable, isBiometricEnabled, authenticate } from "@/services/biometric";

export default function SplashScreen() {
  const router = useRouter();
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(async () => {
      const bioAvailable = await isBiometricAvailable();
      const bioEnabled = await isBiometricEnabled();
      const hasToken = await isAuthenticated();
      const hasRefresh = await hasRefreshToken();

      console.log("[Auth]", { bioAvailable, bioEnabled, hasToken, hasRefresh });

      if (bioAvailable && bioEnabled && hasRefresh) {
        console.log("[Auth] Face ID 시도 중...");
        const success = await authenticate();
        console.log("[Auth] Face ID 결과:", success);
        if (success) {
          if (!hasToken) {
            const refreshed = await refreshSession();
            if (!refreshed) {
              router.replace("/(auth)/login");
              return;
            }
          }
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)/login");
        }
        return;
      }

      if (hasToken) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/login");
      }
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <LinearGradient
      colors={[LightTheme.white, LightTheme.primaryLight, LightTheme.primaryBg]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <View style={styles.decorTop}>
        <MaterialCommunityIcons name="leaf" size={60} color={LightTheme.primaryLight} />
      </View>

      <View style={styles.content}>
        <Animated.View style={[styles.logoCircle, { transform: [{ scale: logoScale }], opacity: logoOpacity }]}>
          <MaterialCommunityIcons name="silverware-fork-knife" size={48} color={LightTheme.primary} />
        </Animated.View>

        <Animated.Text style={[styles.appName, { opacity: textOpacity }]}>CalSnap</Animated.Text>

        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          YOUR MINDFUL WELLNESS COMPANION
        </Animated.Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerLine} />
        <Text style={styles.footerText}>CULTIVATING YOUR HEALTH</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  decorTop: {
    position: "absolute",
    top: 80,
    right: 40,
    opacity: 0.4,
    transform: [{ rotate: "-15deg" }],
  },
  content: {
    alignItems: "center",
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: LightTheme.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: LightTheme.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: Spacing.lg,
  },
  appName: {
    fontSize: FontSize.xxxl,
    fontWeight: "800",
    color: LightTheme.primaryDark,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  tagline: {
    fontSize: FontSize.xs,
    color: LightTheme.textSecondary,
    letterSpacing: 3,
    fontWeight: "500",
  },
  footer: {
    position: "absolute",
    bottom: 60,
    alignItems: "center",
  },
  footerLine: {
    width: 40,
    height: 2,
    backgroundColor: LightTheme.primary,
    marginBottom: Spacing.sm,
    borderRadius: 1,
  },
  footerText: {
    fontSize: FontSize.xs,
    color: LightTheme.textLight,
    letterSpacing: 2,
    fontWeight: "400",
  },
});
