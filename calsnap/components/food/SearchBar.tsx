import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

interface SearchBarProps {
  query: string;
  onChangeQuery: (q: string) => void;
  recentSearches: string[];
  showRecent: boolean;
}

export default function SearchBar({ query, onChangeQuery, recentSearches, showRecent }: SearchBarProps) {
  const { colors } = useTheme();

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.card,
          marginHorizontal: Spacing.lg,
          borderRadius: BorderRadius.xl,
          paddingHorizontal: Spacing.md,
          height: 48,
          borderWidth: 1,
          borderColor: colors.border,
          gap: Spacing.sm,
        }}
      >
        <MaterialCommunityIcons name="magnify" size={22} color={colors.textLight} />
        <TextInput
          style={{ flex: 1, fontSize: FontSize.md, color: colors.text }}
          placeholder="음식을 검색하세요"
          placeholderTextColor={colors.textLight}
          value={query}
          onChangeText={onChangeQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => onChangeQuery("")}>
            <MaterialCommunityIcons name="close-circle" size={20} color={colors.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {showRecent && (
        <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.md }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: Spacing.sm }}>
            <Text style={{ fontSize: FontSize.sm, fontWeight: "600", color: colors.text }}>최근 검색</Text>
            <TouchableOpacity>
              <Text style={{ fontSize: FontSize.sm, color: colors.primary }}>전체 삭제</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", gap: Spacing.sm }}>
            {recentSearches.map((item) => (
              <TouchableOpacity
                key={item}
                style={{
                  paddingHorizontal: Spacing.md,
                  paddingVertical: Spacing.sm,
                  borderRadius: BorderRadius.full,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                }}
                onPress={() => onChangeQuery(item)}
              >
                <Text style={{ fontSize: FontSize.sm, color: colors.text }}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </>
  );
}
