import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { LightTheme, DarkTheme, ThemeColors } from "@/constants/theme";

interface ThemeContextValue {
  isDark: boolean;
  colors: ThemeColors;
  toggleDarkMode: () => void;
  setDarkMode: (v: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  colors: LightTheme,
  toggleDarkMode: () => {},
  setDarkMode: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = useCallback(() => setIsDark((prev) => !prev), []);
  const setDarkMode = useCallback((v: boolean) => setIsDark(v), []);

  const colors = isDark ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleDarkMode, setDarkMode }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
