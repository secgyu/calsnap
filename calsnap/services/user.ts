import { UserProfile } from '@/types/user';
import api from './api';

export async function getUserProfile(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>('/users/me');
  return data;
}

export async function updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
  const { data } = await api.patch<UserProfile>('/users/me', profile);
  return data;
}

export async function updateGoal(goal: {
  goalCalorie?: number;
  goalType?: string;
}): Promise<UserProfile> {
  const { data } = await api.patch<UserProfile>('/users/me/goal', goal);
  return data;
}

export async function deleteAccount(): Promise<void> {
  await api.delete('/users/me');
}
