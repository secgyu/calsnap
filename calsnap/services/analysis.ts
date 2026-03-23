import { AnalysisResult } from '@/types/food';

const MOCK_RESULT: AnalysisResult = {
  name: '김치찌개',
  mealType: '점심 식사로 감지됨',
  calories: 320,
  carbs: 45,
  protein: 18,
  fat: 12,
  sodium: 890,
  remainingCalories: 853,
  goalPercent: 35,
  tip: '점심으로 적절한 칼로리예요!',
};

export async function getAnalysisResult(_imageUri: string): Promise<AnalysisResult> {
  return MOCK_RESULT;
}
