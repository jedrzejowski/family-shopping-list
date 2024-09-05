import * as model from '../model.ts';
import {createRepo} from './_createRepo.tsx';

export const {
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
  useGetEntityQuery: useGetShoppingListItemQuery,
  useCreateEntityMutation: useCreateShoppingListItemMutation,
  useUpdateEntityMutation: useUpdateShoppingListItemMutation,
  useDeleteUx: useDeleteShoppingListItemUx,
} = createRepo<model.ShoppingListItem>('shopping-list-items', {
  idField: 'shoppingListItemId',
  entityToText: () => 'TODO',
  postMutationInvalidate({queryClient, entityId}) {
    queryClient.invalidateQueries({queryKey: ['repo', 'shopping-lists/items']});
  }
});
