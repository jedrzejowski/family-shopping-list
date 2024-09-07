export interface SearchQuery {
  searchText?: string;
  limit: number;
  offset: number;
}

export interface SearchResult<T> {
  items: T[];
  totalCount: number;
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

export interface ShoppingList {
  shoppingListId: string;
  name: string;
}

export interface ShoppingListItem {
  shoppingListItemId: string;
  shoppingListId: string;
  productId?: string | null;
  productName?: string | null;
  isChecked: boolean;
}
