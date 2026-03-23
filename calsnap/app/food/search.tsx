import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FoodItem, MealTime } from "@/types/food";
import { FontSize, Spacing, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { searchFoods, getRecentSearches } from "@/services/food";
import { createRecord } from "@/services/record";
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
  const [foods, setFoods] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRecentSearches()
      .then(setRecentSearches)
      .catch(() => {});
    searchFoods("")
      .then(setFoods)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      searchFoods(query)
        .then(setFoods)
        .catch(() => setFoods([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const [adding, setAdding] = useState(false);

  const handleAddFood = async () => {
    if (!selectedFood || adding) return;
    setAdding(true);
    try {
      await createRecord({
        name: selectedFood.name,
        calories: (selectedFood.calories || 0) * quantity,
        carbs: (selectedFood.carbs || 0) * quantity,
        protein: (selectedFood.protein || 0) * quantity,
        fat: (selectedFood.fat || 0) * quantity,
        mealType: mealTime,
        icon: selectedFood.icon,
        recordedAt: new Date().toISOString(),
      });
      setSelectedFood(null);
      router.back();
    } catch {
      Alert.alert("오류", "음식 추가에 실패했습니다.");
    } finally {
      setAdding(false);
    }
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
              {loading ? "검색 중..." : `${foods.length}개의 항목 발견`}
            </Text>
          </View>
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: Spacing.xl }} />
          ) : (
            foods.map((food) => <FoodCard key={food.id} food={food} onPress={() => setSelectedFood(food)} />)
          )}
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
