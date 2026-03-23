import * as SecureStore from 'expo-secure-store';
import api from './api';
import { isBiometricEnabled } from './biometric';

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
  const bioEnabled = await isBiometricEnabled();

  try {
    await api.post('/auth/logout');
  } catch {
    // ignore server error
  } finally {
    if (bioEnabled) {
      await SecureStore.deleteItemAsync('accessToken');
    } else {
      await clearTokens();
    }
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await SecureStore.getItemAsync('accessToken');
  return !!token;
}

export async function hasRefreshToken(): Promise<boolean> {
  const token = await SecureStore.getItemAsync('refreshToken');
  return !!token;
}

export async function refreshSession(): Promise<boolean> {
  try {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    if (!refreshToken) return false;

    const { data } = await api.post('/auth/refresh', { refreshToken });
    await storeTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    await clearTokens();
    return false;
  }
}

async function storeTokens(accessToken: string, refreshToken: string): Promise<void> {
  await SecureStore.setItemAsync('accessToken', accessToken);
  await SecureStore.setItemAsync('refreshToken', refreshToken);
}

async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
}
