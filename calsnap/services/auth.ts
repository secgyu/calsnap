import * as SecureStore from 'expo-secure-store';
import api from './api';

interface AuthResponse {
  user: any;
  accessToken: string;
  refreshToken: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  await storeTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function signup(email: string, password: string, name: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/signup', { email, password, name });
  await storeTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch {
    // 서버 에러 무시 - 로컬 토큰만 삭제
  } finally {
    await clearTokens();
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await SecureStore.getItemAsync('accessToken');
  return !!token;
}

async function storeTokens(accessToken: string, refreshToken: string): Promise<void> {
  await SecureStore.setItemAsync('accessToken', accessToken);
  await SecureStore.setItemAsync('refreshToken', refreshToken);
}

async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
}
