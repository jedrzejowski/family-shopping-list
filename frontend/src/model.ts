export interface SearchResult<T> {
  items: T[];
}

export interface Product {
  familyId: string;
  productId: string;
  tradeName: string;
  tags: { name: string }[];
}

export interface Shop {
  familyId: string;
  shopId: string;
  brandName: string;
  addressCity?: string;
  addressStreet?: string;
  addressStreetNo?: string;
}
