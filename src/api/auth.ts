import { API_BASE_URL, DEFAULT_HEADERS } from '../config/api';

export type UserProfile = {
  id: number;
  full_name: string;
  phone: string;
  address: string | null;
  img_url: string | null;
  role: string;
  created_at: string;
};

export type LoginSuccess = {
  tokens: {
    access_token: string;
    refresh_token: string;
  };
  profile: UserProfile;
};

function getErrorMessage(json: Record<string, unknown>, fallback: string): string {
  const m = json.message;
  if (typeof m === 'string') {
    return m;
  }
  if (Array.isArray(m)) {
    return m.join(', ');
  }
  return fallback;
}

export async function loginRequest(
  phone: string,
  password: string,
): Promise<LoginSuccess> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({ phone, password }),
  });
  const json = (await res.json()) as Record<string, unknown> & {
    data?: LoginSuccess;
    result?: boolean;
  };
  if (!res.ok || json.result === false) {
    throw new Error(getErrorMessage(json, 'Giriş alınmadı'));
  }
  if (!json.data?.tokens?.access_token) {
    throw new Error('Naməlum cavab');
  }
  return json.data;
}

export async function signupRequest(
  full_name: string,
  phone: string,
  password: string,
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({ full_name, phone, password }),
  });
  const json = (await res.json()) as Record<string, unknown> & {
    result?: boolean;
  };
  if (!res.ok || json.result === false) {
    throw new Error(getErrorMessage(json, 'Qeydiyyat alınmadı'));
  }
}
