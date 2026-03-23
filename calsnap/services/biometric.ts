import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const BIOMETRIC_ENABLED_KEY = 'biometricEnabled';

export async function isBiometricAvailable(): Promise<boolean> {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  if (!compatible) return false;

  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return enrolled;
}

export async function getBiometricType(): Promise<string> {
  const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
  if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
    return 'Face ID';
  }
  if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
    return '지문 인식';
  }
  if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
    return '홍채 인식';
  }
  return '생체 인증';
}

export async function authenticate(): Promise<boolean> {
  try {
    const biometricType = await getBiometricType();
    console.log('[Bio] 인증 시작:', biometricType);

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: `${biometricType}으로 CalSnap에 로그인`,
      cancelLabel: '비밀번호로 로그인',
      disableDeviceFallback: false,
    });

    console.log('[Bio] 결과:', JSON.stringify(result));
    return result.success;
  } catch (err) {
    console.log('[Bio] 에러:', err);
    return false;
  }
}

export async function isBiometricEnabled(): Promise<boolean> {
  const value = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
  return value === 'true';
}

export async function setBiometricEnabled(enabled: boolean): Promise<void> {
  await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, String(enabled));
}
