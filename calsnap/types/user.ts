export type { Gender, ActivityLevel } from '@/utils/calories';

export interface UserProfile {
  name: string;
  email: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
  activityLevel: string;
  goalCalorie: number;
  goalType: string;
}
