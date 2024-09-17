export interface SearchParams {
  searchText?: string;
  limit: number;
  offset: number;
}

export interface SearchResult<T> {
  searchParams: SearchParams;
  items: T[];
  totalCount: number;
  nextPageParams?: SearchParams;
  previousPageParams?: SearchParams;
}

export interface EntityMeta {
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface Product {
  productId: string;
  tradeName: string;
  tags: { name: string }[];
  readonly meta?: EntityMeta;
}

export interface Shop {
  shopId: string;
  brandName: string;
  addressCity?: string;
  addressStreet?: string;
  addressStreetNo?: string;
  readonly meta?: EntityMeta;
}

export interface ShoppingList {
  shoppingListId: string;
  name: string;
  readonly meta?: EntityMeta;
}

export interface ShoppingListItem {
  shoppingListItemId: string;
  shoppingListId: string;
  productId?: string | null;
  productName?: string | null;
  isChecked: boolean;
  readonly meta?: EntityMeta;
}
