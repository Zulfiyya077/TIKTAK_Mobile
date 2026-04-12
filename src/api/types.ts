export type Category = {
  id: number;
  name: string;
  img_url: string | null;
  description: string | null;
  created_at: string;
};

export type Campaign = {
  id: number;
  title: string;
  description: string | null;
  img_url: string | null;
  created_at: string;
};

export type ProductCategoryRef = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  title: string;
  img_url: string | null;
  description: string | null;
  price: string;
  type: string;
  created_at: string;
  category?: ProductCategoryRef;
};

export type BasketItem = {
  id: number;
  quantity: number;
  total_price: string;
  product: Product;
};

export type BasketData = {
  items: BasketItem[];
  total: string;
  count: number;
};

export type UserProfile = {
  id: number;
  full_name: string;
  phone: string;
  address: string | null;
  img_url: string | null;
  role: string;
  created_at: string;
};
