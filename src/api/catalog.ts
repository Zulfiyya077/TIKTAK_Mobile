import { authFetch, parseJson } from './client';
import type { Campaign, Category, Product } from './types';

type ApiList<T> = {
  message?: string;
  data?: T;
  result?: boolean;
};

function getErrorMessage(json: Record<string, unknown>, fallback: string): string {
  const m = json.message;
  if (typeof m === 'string') {
    return m;
  }
  return fallback;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await authFetch('/categories');
  const json = await parseJson<ApiList<Category[]> & Record<string, unknown>>(res);
  if (!res.ok || json.result === false) {
    throw new Error(getErrorMessage(json, 'Kateqoriyalar yüklənmədi'));
  }
  return json.data ?? [];
}

export async function fetchCampaigns(): Promise<Campaign[]> {
  const res = await authFetch('/campaigns');
  const json = await parseJson<ApiList<Campaign[]> & Record<string, unknown>>(res);
  if (!res.ok || json.result === false) {
    throw new Error(getErrorMessage(json, 'Kampaniyalar yüklənmədi'));
  }
  return json.data ?? [];
}

type ProductsResponse = {
  message?: string;
  data?: Product[];
  pagination?: {
    next: number | null;
    prev: number | null;
    current: number;
    total: number;
    totalPages: number;
  };
  result?: boolean;
};

export async function fetchProducts(params: {
  categoryId?: number;
  q?: string;
  page?: number;
  limit?: number;
}): Promise<Product[]> {
  const q = new URLSearchParams();
  if (params.categoryId) {
    q.set('category_id', String(params.categoryId));
  }
  if (params.q) {
    q.set('q', params.q);
  }
  q.set('page', String(params.page ?? 1));
  q.set('limit', String(params.limit ?? 24));
  const res = await authFetch(`/products?${q.toString()}`);
  const json = await parseJson<ProductsResponse & Record<string, unknown>>(res);
  if (!res.ok) {
    throw new Error(getErrorMessage(json, 'Məhsullar yüklənmədi'));
  }
  if (json.result === false) {
    throw new Error(getErrorMessage(json, 'Məhsullar yüklənmədi'));
  }
  return json.data ?? [];
}

export async function searchProducts(query: string): Promise<Product[]> {
  return fetchProducts({ q: query });
}
