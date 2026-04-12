import { authFetch, parseJson } from './client';
import type { UserProfile } from './types';

type ApiOne = {
  message?: string;
  data?: UserProfile;
  result?: boolean;
};

export async function fetchProfile(): Promise<UserProfile | null> {
  const res = await authFetch('/profile');
  const json = await parseJson<ApiOne & Record<string, unknown>>(res);
  if (!res.ok || json.result === false) {
    return null;
  }
  return json.data ?? null;
}
