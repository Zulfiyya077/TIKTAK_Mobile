/**
 * Token saxlama: yalnız RAM (process yaddaşı).
 *
 * @react-native-async-storage paketi çıxarılıb — RN 0.84 + New Arch mühitində
 * bəzən RNAsyncStorage TurboModulu null qalır və "cannot create db" xətası verirdi.
 * Tokenlar app bağlanana qədər saxlanılır; tam persist üçün sonra MMKV və ya
 * stabil AsyncStorage həlli əlavə etmək olar.
 */

const ACCESS = '@tiktak/access_token';
const REFRESH = '@tiktak/refresh_token';

const memoryStorage: Record<string, string> = {};

export async function saveTokens(access: string, refresh: string): Promise<void> {
  memoryStorage[ACCESS] = access;
  memoryStorage[REFRESH] = refresh;
}

export async function getAccessToken(): Promise<string | null> {
  return memoryStorage[ACCESS] ?? null;
}

export async function clearTokens(): Promise<void> {
  delete memoryStorage[ACCESS];
  delete memoryStorage[REFRESH];
}
