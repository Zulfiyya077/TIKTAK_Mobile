import { API_BASE_URL, DEFAULT_HEADERS } from '../config/api';
import { safeJson } from '../utils/error';

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

export type TokenPair = {
  access_token: string;
  refresh_token: string;
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
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ phone, password }),
    });
  } catch {
    throw new Error('Şəbəkə xətası. İnternet bağlantısını yoxlayın.');
  }
  const json = (await safeJson(res)) as Record<string, unknown> & {
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
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ full_name, phone, password }),
    });
  } catch {
    throw new Error('Şəbəkə xətası. İnternet bağlantısını yoxlayın.');
  }
  const json = (await safeJson(res)) as Record<string, unknown> & {
    result?: boolean;
  };
  if (!res.ok || json.result === false) {
    throw new Error(getErrorMessage(json, 'Qeydiyyat alınmadı'));
  }
}

export async function refreshRequest(refreshToken: string): Promise<TokenPair> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  } catch {
    throw new Error('Şəbəkə xətası. İnternet bağlantısını yoxlayın.');
  }
  const json = (await safeJson(res)) as Record<string, unknown> & {
    data?: { tokens?: Partial<TokenPair> } | Partial<TokenPair>;
    result?: boolean;
  };
  if (!res.ok || json.result === false) {
    throw new Error(getErrorMessage(json, 'Sessiya yenilənmədi'));
  }

  const dataObj = (json.data ?? {}) as
    | { tokens?: Partial<TokenPair> }
    | Partial<TokenPair>;
  const fromNested = (dataObj as { tokens?: Partial<TokenPair> }).tokens;
  const access =
    fromNested?.access_token ?? (dataObj as Partial<TokenPair>).access_token;
  const refresh =
    fromNested?.refresh_token ?? (dataObj as Partial<TokenPair>).refresh_token;

  if (!access) {
    throw new Error('Sessiya yenilənmə cavabı etibarsızdır');
  }
  return {
    access_token: access,
    refresh_token: refresh ?? refreshToken,
  };
}
