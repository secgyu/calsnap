import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FoodItem, MealTime } from "@/types/food";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { searchFoods, getRecentSearches } from "@/services/food";
import SearchBar from "@/components/food/SearchBar";
import FoodCard from "@/components/food/FoodCard";
import ManualEntryForm from "@/components/food/ManualEntryForm";
import FoodDetailSheet from "@/components/food/FoodDetailSheet";

export default function FoodSearchScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<"search" | "manual">("search");
  const [query, setQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mealTime, setMealTime] = useState<MealTime>("lunch");

  const recentSearches = ["사과", "현미밥", "닭가슴살"];
  const filteredFoods = query.trim()
    ? [
        { id: "1", name: "현미밥", serving: "1공기 (210g)", calories: 310, carbs: 65, protein: 6, fat: 1, icon: "🍚" },
        { id: "2", name: "사과", serving: "1개 (200g)", calories: 104, carbs: 27, protein: 0, fat: 0, icon: "🍎" },
        {
          id: "3",
          name: "닭가슴살 샐러드",
          serving: "1인분",
          calories: 320,
          carbs: 12,
          protein: 35,
          fat: 8,
          icon: "🥗",
        },
        { id: "4", name: "삶은 달걀", serving: "1개 (60g)", calories: 78, carbs: 1, protein: 6, fat: 5, icon: "🥚" },
        { id: "5", name: "바나나", serving: "1개 (120g)", calories: 105, carbs: 27, protein: 1, fat: 0, icon: "🍌" },
      ].filter((f) => f.name.includes(query.trim()))
    : [
        { id: "1", name: "현미밥", serving: "1공기 (210g)", calories: 310, carbs: 65, protein: 6, fat: 1, icon: "🍚" },
        { id: "2", name: "사과", serving: "1개 (200g)", calories: 104, carbs: 27, protein: 0, fat: 0, icon: "🍎" },
        {
          id: "3",
          name: "닭가슴살 샐러드",
          serving: "1인분",
          calories: 320,
          carbs: 12,
          protein: 35,
          fat: 8,
          icon: "🥗",
        },
        { id: "4", name: "삶은 달걀", serving: "1개 (60g)", calories: 78, carbs: 1, protein: 6, fat: 5, icon: "🥚" },
        { id: "5", name: "바나나", serving: "1개 (120g)", calories: 105, carbs: 27, protein: 1, fat: 0, icon: "🍌" },
      ];

  const handleAddFood = () => {
    setSelectedFood(null);
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.md,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: FontSize.lg, fontWeight: "700", color: colors.primary }}>식단 기록</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="history" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <SearchBar
        query={query}
        onChangeQuery={setQuery}
        recentSearches={recentSearches}
        showRecent={activeTab === "search" && !query}
      />

      <View
        style={{
          flexDirection: "row",
          marginHorizontal: Spacing.lg,
          marginTop: Spacing.lg,
          marginBottom: Spacing.md,
          backgroundColor: colors.card,
          borderRadius: BorderRadius.md,
          padding: 4,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        {(["search", "manual"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={{
              flex: 1,
              paddingVertical: Spacing.sm,
              alignItems: "center",
              borderRadius: BorderRadius.sm,
              backgroundColor: activeTab === tab ? colors.primaryLight : "transparent",
            }}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={{
                fontSize: FontSize.md,
                fontWeight: "600",
                color: activeTab === tab ? colors.primary : colors.textSecondary,
              }}
            >
              {tab === "search" ? "검색" : "직접 입력"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === "search" ? (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: Spacing.lg,
              marginBottom: Spacing.md,
            }}
          >
            <Text style={{ fontSize: FontSize.lg, fontWeight: "800", color: colors.text }}>검색 결과</Text>
            <Text style={{ fontSize: FontSize.sm, color: colors.textSecondary }}>
              {filteredFoods.length}개의 항목 발견
            </Text>
          </View>
          {filteredFoods.map((food) => (
            <FoodCard key={food.id} food={food} onPress={() => setSelectedFood(food)} />
          ))}
        </ScrollView>
      ) : (
        <ManualEntryForm onSubmit={() => router.back()} />
      )}

      <FoodDetailSheet
        food={selectedFood}
        quantity={quantity}
        mealTime={mealTime}
        onQuantityChange={setQuantity}
        onMealTimeChange={setMealTime}
        onClose={() => setSelectedFood(null)}
        onAdd={handleAddFood}
      />
    </SafeAreaView>
  );
}
