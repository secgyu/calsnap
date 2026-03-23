import { DailyRecord, WeeklyStats } from '@/types/record';
import { NutrientData, MealGroup } from '@/types/food';
import { LightTheme as Colors } from '@/constants/theme';
import { formatDateKey } from '@/utils/date';


function buildMockRecords(): Record<string, DailyRecord> {
  const today = new Date();
  const records: Record<string, DailyRecord> = {};

  records[formatDateKey(today)] = {
    consumed: 853,
    goal: 2100,
    meals: [
      { id: '1', name: '사과', calories: 95, time: '08:30', mealType: '아침', icon: '🍎' },
      { id: '2', name: '닭가슴살 샐러드', calories: 320, time: '12:45', mealType: '점심', icon: '🥗' },
      { id: '3', name: '통밀 식빵', calories: 180, time: '15:15', mealType: '간식', icon: '🍞' },
      { id: '4', name: '현미밥 + 된장찌개', calories: 258, time: '18:30', mealType: '저녁', icon: '🍚' },
    ],
  };

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  records[formatDateKey(yesterday)] = {
    consumed: 1920,
    goal: 2100,
    meals: [
      { id: '5', name: '토스트 + 계란', calories: 350, time: '07:45', mealType: '아침', icon: '🍳' },
      { id: '6', name: '비빔밥', calories: 580, time: '12:00', mealType: '점심', icon: '🍚' },
      { id: '7', name: '프로틴 바', calories: 210, time: '15:30', mealType: '간식', icon: '🍫' },
      { id: '8', name: '연어 스테이크', calories: 780, time: '19:00', mealType: '저녁', icon: '🐟' },
    ],
  };

  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);
  records[formatDateKey(twoDaysAgo)] = {
    consumed: 2250,
    goal: 2100,
    meals: [
      { id: '9', name: '시리얼 + 우유', calories: 280, time: '08:00', mealType: '아침', icon: '🥣' },
      { id: '10', name: '김치찌개 + 밥', calories: 620, time: '12:30', mealType: '점심', icon: '🍲' },
      { id: '11', name: '치킨', calories: 850, time: '18:00', mealType: '저녁', icon: '🍗' },
      { id: '12', name: '아이스크림', calories: 500, time: '21:00', mealType: '야식', icon: '🍦' },
    ],
  };

  return records;
}

const MOCK_RECORDS = buildMockRecords();

export async function getDailyRecord(dateKey: string): Promise<DailyRecord | null> {
  return MOCK_RECORDS[dateKey] ?? null;
}

export function getDailyRecordSync(dateKey: string): DailyRecord | null {
  return MOCK_RECORDS[dateKey] ?? null;
}

export function hasRecord(dateKey: string): boolean {
  return !!MOCK_RECORDS[dateKey];
}

export async function getWeeklyStats(): Promise<WeeklyStats> {
  return { avgCalories: '1,674', achievementRate: '79', recordedDays: '5' };
}

export async function getDailyDetail(_dateKey: string): Promise<{
  consumed: number;
  goal: number;
  nutrients: NutrientData[];
  mealGroups: MealGroup[];
  tip: string;
}> {
  return {
    consumed: 853,
    goal: 2100,
    nutrients: [
      { label: '탄수화물', value: 142, goal: 260, unit: 'g', color: Colors.carbs, icon: 'barley' as const },
      { label: '단백질', value: 68, goal: 105, unit: 'g', color: Colors.protein, icon: 'arm-flex' as const },
      { label: '지방', value: 34, goal: 58, unit: 'g', color: Colors.fat, icon: 'water' as const },
      { label: '나트륨', value: 890, goal: 2000, unit: 'mg', color: Colors.sodium, icon: 'shaker' as const },
    ],
    mealGroups: [
      { type: '아침', icon: '🌅', totalCalories: 95, items: [{ name: '사과', calories: 95, serving: '1개 (200g)' }] },
      { type: '점심', icon: '☀️', totalCalories: 320, items: [{ name: '닭가슴살 샐러드', calories: 320, serving: '1인분' }] },
      { type: '간식', icon: '🍪', totalCalories: 180, items: [{ name: '통밀 식빵', calories: 180, serving: '2조각' }] },
      { type: '저녁', icon: '🌙', totalCalories: 258, items: [{ name: '현미밥', calories: 150, serving: '1공기' }, { name: '된장찌개', calories: 108, serving: '1그릇' }] },
    ],
    tip: '단백질 섭취가 목표 대비 부족해요. 저녁에 닭가슴살이나 두부를 추가해보세요!',
  };
}

export function getTodaySummary() {
  return {
    date: '2024년 5월 22일',
    consumed: 853,
    goal: 2100,
    carbs: 142,
    protein: 68,
    fat: 34,
    meals: [
      { id: '1', name: '사과', calories: 95, time: '오전 08:30', icon: 'fruit-cherries' as const, color: '#4CAD53' },
      { id: '2', name: '닭가슴살 샐러드', calories: 320, time: '오후 12:45', icon: 'food-drumstick' as const, color: '#F59E0B' },
      { id: '3', name: '통밀 식빵', calories: 180, time: '오후 03:15', icon: 'bread-slice' as const, color: '#3B82F6' },
    ],
  };
}
