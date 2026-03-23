import { FoodItem, FoodDetail } from '@/types/food';
import api from './api';

export async function searchFoods(query: string): Promise<FoodItem[]> {
  const { data } = await api.get<FoodItem[]>('/foods', {
    params: { q: query || undefined },
  });
  return data;
}

export async function getAllFoods(): Promise<FoodItem[]> {
  const { data } = await api.get<FoodItem[]>('/foods');
  return data;
}

export async function getFoodById(id: string): Promise<FoodDetail> {
  const { data } = await api.get<FoodDetail>(`/foods/${id}`);
  return data;
}

export async function getRecentSearches(): Promise<string[]> {
  const { data } = await api.get<string[]>('/foods/recent-searches');
  return data;
}

export async function createFood(food: Omit<FoodItem, 'id'>): Promise<FoodItem> {
  const { data } = await api.post<FoodItem>('/foods', food);
  return data;
}

export async function deleteFood(id: string): Promise<void> {
  await api.delete(`/foods/${id}`);
}
