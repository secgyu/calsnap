import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

function RootStack() {
  const { isDark } = useTheme();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="analysis/loading" options={{ animation: "fade" }} />
        <Stack.Screen name="analysis/result" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="food/search" options={{ animation: "slide_from_bottom" }} />
        <Stack.Screen name="food/[id]" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="history/[date]" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="settings/profile" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="settings/goal" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="settings/body" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="settings/terms" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="settings/privacy" options={{ animation: "slide_from_right" }} />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootStack />
    </ThemeProvider>
  );
}
