import { MaterialCommunityIcons } from '@expo/vector-icons';

export type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export const MEAL_LABELS: Record<MealTime, string> = {
  breakfast: '아침',
  lunch: '점심',
  dinner: '저녁',
  snack: '간식',
};

export interface FoodItem {
  id: string;
  name: string;
  serving: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  icon: string;
}

export interface FoodDetail extends FoodItem {
  sodium: number;
  mealType: string;
  time: string;
  capturedByAI: boolean;
}

export interface NutrientData {
  label: string;
  value: number;
  goal: number;
  unit: string;
  color: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

export interface MealGroup {
  type: string;
  icon: string;
  totalCalories: number;
  items: { name: string; calories: number; serving: string }[];
}

export interface AnalysisResult {
  name: string;
  mealType: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  sodium: number;
  remainingCalories: number;
  goalPercent: number;
  tip: string;
}
