import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          height: Platform.OS === "ios" ? 88 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 28 : 8,
          backgroundColor: colors.tabBar,
          borderTopWidth: 1,
          borderTopColor: colors.tabBarBorder,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "기록",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="clock-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "카메라",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="camera-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "설정",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="cog-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
