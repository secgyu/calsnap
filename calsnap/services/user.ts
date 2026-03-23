import { UserProfile } from '@/types/user';

const MOCK_USER: UserProfile = {
  name: '홍길동',
  email: 'test@test.com',
  gender: '남성',
  age: 28,
  height: 175,
  weight: 72,
  activityLevel: '보통 활동',
  goalCalorie: 2100,
  goalType: '체중 유지',
};

export async function getUserProfile(): Promise<UserProfile> {
  return MOCK_USER;
}

export function getUserProfileSync(): UserProfile {
  return MOCK_USER;
}

export function getMockCredentials() {
  return { email: 'test@test.com', password: '1234' };
}
