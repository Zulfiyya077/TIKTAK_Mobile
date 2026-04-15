/**
 * Token storage: in-memory only.
 * APK build stabilliyi üçün native storage asılılığı çıxarılıb.
 * Qeyd: tətbiq tam bağlananda session silinir.
 */

const ACCESS = '@tiktak/access_token';
const REFRESH = '@tiktak/refresh_token';

const memoryStorage: Record<string, string> = {};

export async function saveTokens(access: string, refresh: string): Promise<void> {
  memoryStorage[ACCESS] = access;
  memoryStorage[REFRESH] = refresh;
}

export async function saveAccessToken(access: string): Promise<void> {
  memoryStorage[ACCESS] = access;
}

export async function getAccessToken(): Promise<string | null> {
  return memoryStorage[ACCESS] ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  return memoryStorage[REFRESH] ?? null;
}

export async function clearTokens(): Promise<void> {
  delete memoryStorage[ACCESS];
  delete memoryStorage[REFRESH];
}
