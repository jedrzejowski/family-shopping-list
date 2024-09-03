import * as model from '../model.ts';
import {createRepo} from './_createRepo.tsx';

export const {
  useSearchQuery: useSearchShopQuery,
  useGetEntityQuery: useGetShopQuery,
  useCreateEntityMutation: useCreateShopMutation,
  useUpdateEntityMutation: useUpdateShopMutation,
} = createRepo<model.Shop>('shops', {
  idField: 'shopId',
  entityToText: shop => shop.brandName,
});

export const {
  useSearchQuery: useSearchProductQuery,
  useGetEntityQuery: useGetProductQuery,
  useCreateEntityMutation: useCreateProductMutation,
  useUpdateEntityMutation: useUpdateProductMutation,
  useDeleteEntityMutation: useDeleteProductMutation,
  useDeleteUx: useDeleteProductUx,
  EntityAutocomplete: ProductAutocomplete,
} = createRepo<model.Product>('products', {
  idField: 'productId',
  entityToText: product => product.tradeName,
});

export const {
  useSearchQuery: useSearchShoppingListQuery,
  useGetEntityQuery: useGetShoppingListQuery,
  useCreateEntityMutation: useCreateShoppingListMutation,
  useUpdateEntityMutation: useUpdateShoppingListMutation,
} = createRepo<model.ShoppingList>('shopping-lists', {
  idField: 'shoppingListId',
  entityToText: shoppingList => shoppingList.name,
});

export const {
  useGetEntityQuery: useGetShoppingListItemQuery,
  useCreateEntityMutation: useCreateShoppingListItemMutation,
  useUpdateEntityMutation: useUpdateShoppingListItemMutation,
} = createRepo<model.ShoppingListItem>('shopping-list-items', {
  idField: 'shoppingListItemId',
  entityToText: () => 'TODO',
});
