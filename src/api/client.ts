import { API_BASE_URL, DEFAULT_HEADERS } from '../config/api';
import { refreshRequest } from './auth';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from '../storage/tokens';

let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return null;
  }
  const fresh = await refreshRequest(refreshToken);
  await saveTokens(fresh.access_token, fresh.refresh_token);
  return fresh.access_token;
}

async function getOrRefreshAccessToken(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = refreshAccessToken()
      .catch(async () => {
        await clearTokens();
        return null;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

export async function authFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const firstToken = await getAccessToken();
  const headers: Record<string, string> = {
    ...DEFAULT_HEADERS,
    ...((init?.headers as Record<string, string>) || {}),
  };
  if (firstToken) {
    headers.Authorization = `Bearer ${firstToken}`;
  }
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const firstRes = await fetch(url, { ...init, headers });

  // Access token bitibsə refresh edib request-i bir dəfə təkrar et.
  if (firstRes.status !== 401) {
    return firstRes;
  }

  const refreshed = await getOrRefreshAccessToken();
  if (!refreshed) {
    return firstRes;
  }

  const retryHeaders: Record<string, string> = {
    ...headers,
    Authorization: `Bearer ${refreshed}`,
  };
  return fetch(url, { ...init, headers: retryHeaders });
}

export async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) {
    return {} as T;
  }
  return JSON.parse(text) as T;
}
