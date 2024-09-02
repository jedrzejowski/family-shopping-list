import * as model from '../model.ts';
import {createRepo} from './_createRepo.tsx';

export const {
  useSearchQuery: useSearchShopQuery,
  useGetEntity: useGetShopQuery,
  useCreateEntityMutation: useCreateShopMutation,
  useUpdateEntityMutation: useUpdateShopMutation,
} = createRepo<model.Shop>('shops', {
  idField: 'shopId',
  entityToText: shop => shop.brandName,
});

export const {
  useSearchQuery: useSearchProductQuery,
  useGetEntity: useGetProductQuery,
  useCreateEntityMutation: useCreateProductMutation,
  useUpdateEntityMutation: useUpdateProductMutation,
  EntityAutocomplete: ProductAutocomplete,
} = createRepo<model.Product>('products', {
  idField: 'productId',
  entityToText: product => product.tradeName,
});

export const {
  useSearchQuery: useSearchShoppingListQuery,
  useGetEntity: useGetShoppingListQuery,
  useCreateEntityMutation: useCreateShoppingListMutation,
  useUpdateEntityMutation: useUpdateShoppingListMutation,
} = createRepo<model.ShoppingList>('shopping-lists', {
  idField: 'shoppingListId',
  entityToText: shoppingList => shoppingList.name,
});

export const {
  useGetEntity: useGetShoppingListItemQuery,
  useCreateEntityMutation: useCreateShoppingListItemMutation,
  useUpdateEntityMutation: useUpdateShoppingListItemMutation,
} = createRepo<model.ShoppingListItem>('shopping-list-items', {
  idField: 'shoppingListItemId',
  entityToText: () => 'TODO',
});
