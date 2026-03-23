import { FoodItem, FoodDetail } from '@/types/food';

const MOCK_FOODS: FoodItem[] = [
  { id: '1', name: '현미밥', serving: '1공기 (210g)', calories: 310, carbs: 65, protein: 6, fat: 1, icon: '🍚' },
  { id: '2', name: '사과', serving: '1개 (200g)', calories: 104, carbs: 27, protein: 0, fat: 0, icon: '🍎' },
  { id: '3', name: '닭가슴살 샐러드', serving: '1인분', calories: 320, carbs: 12, protein: 35, fat: 8, icon: '🥗' },
  { id: '4', name: '삶은 달걀', serving: '1개 (60g)', calories: 78, carbs: 1, protein: 6, fat: 5, icon: '🥚' },
  { id: '5', name: '바나나', serving: '1개 (120g)', calories: 105, carbs: 27, protein: 1, fat: 0, icon: '🍌' },
];

const MOCK_FOOD_DETAIL: FoodDetail = {
  id: '1',
  name: '김치찌개',
  serving: '1인분',
  mealType: '점심',
  time: '오후 12:45',
  calories: 320,
  carbs: 45,
  protein: 18,
  fat: 12,
  sodium: 890,
  capturedByAI: true,
  icon: '🍲',
};

const MOCK_RECENT_SEARCHES = ['사과', '현미밥', '닭가슴살'];

export async function searchFoods(query: string): Promise<FoodItem[]> {
  if (!query.trim()) return MOCK_FOODS;
  return MOCK_FOODS.filter((f) => f.name.includes(query.trim()));
}

export async function getAllFoods(): Promise<FoodItem[]> {
  return MOCK_FOODS;
}

export async function getFoodById(_id: string): Promise<FoodDetail> {
  return MOCK_FOOD_DETAIL;
}

export async function getRecentSearches(): Promise<string[]> {
  return MOCK_RECENT_SEARCHES;
}
