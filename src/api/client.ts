import { API_BASE_URL, DEFAULT_HEADERS } from '../config/api';
import { getAccessToken } from '../storage/tokens';

export async function authFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const token = await getAccessToken();
  const headers: Record<string, string> = {
    ...DEFAULT_HEADERS,
    ...((init?.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  return fetch(url, { ...init, headers });
}

export async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) {
    return {} as T;
  }
  return JSON.parse(text) as T;
}
