import { DailyRecord, WeeklyStats } from '@/types/record';
import { NutrientData, MealGroup } from '@/types/food';
import api from './api';

export async function getDailyRecord(dateKey: string): Promise<DailyRecord | null> {
  try {
    const { data } = await api.get<DailyRecord>('/records', {
      params: { date: dateKey },
    });
    return data;
  } catch {
    return null;
  }
}

export async function getRecordDates(from: string, to: string): Promise<string[]> {
  try {
    const { data } = await api.get<string[]>('/records/dates', { params: { from, to } });
    return data;
  } catch {
    return [];
  }
}

export async function getWeeklyStats(): Promise<WeeklyStats> {
  const { data } = await api.get<WeeklyStats>('/records/weekly');
  return data;
}

export async function getDailyDetail(dateKey: string): Promise<{
  consumed: number;
  goal: number;
  nutrients: NutrientData[];
  mealGroups: MealGroup[];
  tip: string;
}> {
  const { data } = await api.get(`/records/daily/${dateKey}`);
  return data;
}

export async function getTodaySummary() {
  const { data } = await api.get('/records/today');
  return data;
}

export async function createRecord(record: {
  name: string;
  calories: number;
  carbs?: number;
  protein?: number;
  fat?: number;
  sodium?: number;
  mealType: string;
  icon?: string;
  imageUrl?: string;
  capturedByAi?: boolean;
  recordedAt: string;
}) {
  const { data } = await api.post('/records', record);
  return data;
}

export async function getRecordById(id: string) {
  const { data } = await api.get(`/records/${id}`);
  return data;
}

export async function deleteRecord(id: string): Promise<void> {
  await api.delete(`/records/${id}`);
}
