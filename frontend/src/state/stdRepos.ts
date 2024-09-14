import * as model from '../model.ts';
import {createRepo} from './repo/repo.tsx';

export const {
  makeQueryKeyFor: makeQueryKeyForShop,
  useSearchQuery: useSearchShopQuery,
  useGetEntityQuery: useGetShopQuery,
  useCreateEntityMutation: useCreateShopMutation,
  useUpdateEntityMutation: useUpdateShopMutation,
  useDeleteUx: useDeleteShopUx,
} = createRepo<model.Shop>('shops', {
  idField: 'shopId',
  entityToText: shop => shop.brandName,
});

export const {
  makeQueryKeyFor: makeQueryKeyForProduct,
  useSearchQuery: useSearchProductQuery,
  useGetEntityQuery: useGetProductQuery,
  useCreateEntityMutation: useCreateProductMutation,
  useUpdateEntityMutation: useUpdateProductMutation,
  useDeleteUx: useDeleteProductUx,
  EntityAutocomplete: ProductAutocomplete,
} = createRepo<model.Product>('products', {
  idField: 'productId',
  entityToText: product => product.tradeName,
});

export const {
  makeQueryKeyFor: makeQueryKeyForShoppingList,
  useSearchQuery: useSearchShoppingListQuery,
  useGetEntityQuery: useGetShoppingListQuery,
  useCreateEntityMutation: useCreateShoppingListMutation,
  useUpdateEntityMutation: useUpdateShoppingListMutation,
  useDeleteUx: useDeleteShoppingListUx,
} = createRepo<model.ShoppingList>('shopping-lists', {
  idField: 'shoppingListId',
  entityToText: shoppingList => shoppingList.name,
});

export const {
  makeQueryKeyFor: makeQueryKeyForShoppingListItem,
  useGetEntityQuery: useGetShoppingListItemQuery,
  getAllCachedEntities: getAllCachedShoppingListItems,
  useCreateEntityMutation: useCreateShoppingListItemMutation,
  useUpdateEntityMutation: useUpdateShoppingListItemMutation,
  useDeleteUx: useDeleteShoppingListItemUx,
} = createRepo<model.ShoppingListItem>('shopping-list-items', {
  idField: 'shoppingListItemId',
  entityToText: () => 'TODO',
  postMutationInvalidate({queryClient}) {
    queryClient.invalidateQueries({queryKey: ['repo', 'shopping-lists/items']});
  }
});
