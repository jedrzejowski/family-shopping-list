export interface SearchResult<T> {
  items: T[];
}

export interface Product {
  productId: string;
  tradeName: string;
  tags: { name: string }[];
}

export interface Shop {
  shopId: string;
  brandName: string;
  addressCity?: string;
  addressStreet?: string;
  addressStreetNo?: string;
}
