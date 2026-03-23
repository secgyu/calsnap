export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: '가벼움 (운동 거의 안 함)',
  light: '보통 (주 1~3회 운동)',
  moderate: '활발함 (주 3~5회 운동)',
  active: '매우 활발함 (주 6~7회 운동)',
  veryActive: '극도로 활발함 (매일 고강도)',
};

export function calculateBMR(
  gender: Gender,
  age: number,
  heightCm: number,
  weightKg: number,
): number {
  if (gender === 'male') {
    return Math.round(88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age);
  }
  return Math.round(447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age);
}

export function calculateTDEE(
  gender: Gender,
  age: number,
  heightCm: number,
  weightKg: number,
  activity: ActivityLevel,
): number {
  const bmr = calculateBMR(gender, age, heightCm, weightKg);
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activity]);
}

export function getCalorieGoals(tdee: number) {
  return {
    loss: Math.round(tdee * 0.8),
    maintain: tdee,
    gain: Math.round(tdee * 1.2),
  };
}

export const ACTIVITY_LEVELS: { value: ActivityLevel; label: string; description: string }[] = [
  { value: 'sedentary', label: '비활동적', description: '운동 거의 안 함' },
  { value: 'light', label: '가벼운 활동', description: '주 1~3회 가벼운 운동' },
  { value: 'moderate', label: '보통 활동', description: '주 3~5회 중간 강도 운동' },
  { value: 'active', label: '활발한 활동', description: '주 6~7회 높은 강도 운동' },
  { value: 'veryActive', label: '매우 활발', description: '매일 고강도 운동 / 육체노동' },
];
