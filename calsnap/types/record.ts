export interface MealEntry {
  id: string;
  name: string;
  calories: number;
  time: string;
  mealType: string;
  icon: string;
}

export interface DailyRecord {
  consumed: number;
  goal: number;
  meals: MealEntry[];
}

export interface WeeklyStats {
  avgCalories: string;
  achievementRate: string;
  recordedDays: string;
}
