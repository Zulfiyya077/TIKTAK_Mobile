import { authFetch, parseJson } from './client';
import type { BasketData, BasketItem } from './types';

type RawBasket = {
  message?: string;
  data?: BasketData;
  items?: BasketItem[];
  total?: string;
  count?: number;
  result?: boolean;
};

function normalizeBasket(json: RawBasket): BasketData {
  if (json.data?.items) {
    return json.data;
  }
  if (json.items) {
    return {
      items: json.items,
      total: json.total ?? '0.00',
      count: json.count ?? 0,
    };
  }
  return { items: [], total: '0.00', count: 0 };
}

export async function fetchBasket(): Promise<BasketData> {
  const res = await authFetch('/basket');
  const json = await parseJson<RawBasket>(res);
  if (!res.ok) {
    return { items: [], total: '0.00', count: 0 };
  }
  return normalizeBasket(json);
}

export async function addProductToBasket(productId: number): Promise<BasketData> {
  const res = await authFetch(`/basket/${productId}/add`, { method: 'POST' });
  const json = await parseJson<RawBasket>(res);
  if (!res.ok || json.result === false) {
    const msg =
      typeof json.message === 'string' ? json.message : 'Səbətə əlavə olunmadı';
    throw new Error(msg);
  }
  return normalizeBasket(json);
}

/** POST /basket/:lineId/remove — sətir id (GET basket items[].id) */
export async function removeOneBasketLine(lineId: number): Promise<BasketData> {
  const res = await authFetch(`/basket/${lineId}/remove`, { method: 'POST' });
  const json = await parseJson<RawBasket>(res);
  if (!res.ok || json.result === false) {
    const msg = typeof json.message === 'string' ? json.message : 'Əməliyyat alınmadı';
    throw new Error(msg);
  }
  return normalizeBasket(json);
}

export async function removeAllOfProduct(productId: number): Promise<BasketData> {
  const res = await authFetch(`/basket/${productId}/remove-all`, {
    method: 'DELETE',
  });
  const json = await parseJson<RawBasket>(res);
  if (!res.ok || json.result === false) {
    const msg = typeof json.message === 'string' ? json.message : 'Əməliyyat alınmadı';
    throw new Error(msg);
  }
  return normalizeBasket(json);
}
