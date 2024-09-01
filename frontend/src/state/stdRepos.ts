import * as model from '../model.ts';
import {createRepo} from './_createRepo.tsx';

export const {
  useSearchQuery: useSearchShopQuery,
  useGetEntity: useGetShopQuery,
  useCreateEntityMutation: useCreateShopMutation,
  useUpdateEntityMutation: useUpdateShopMutation,
} = createRepo<model.Shop>('shops', {
  idField: 'shopId',
});

export const {
  useSearchQuery: useSearchProductQuery,
  useGetEntity: useGetProductQuery,
  useCreateEntityMutation: useCreateProductMutation,
  useUpdateEntityMutation: useUpdateProductMutation,
} = createRepo<model.Product>('products', {
  idField: 'productId',
});

export const {
  useSearchQuery: useSearchShoppingListQuery,
  useGetEntity: useGetShoppingListQuery,
  useCreateEntityMutation: useCreateShoppingListMutation,
  useUpdateEntityMutation: useUpdateShoppingListMutation,
} = createRepo<model.ShoppingList>('shopping-lists', {
  idField: 'shoppingListId',
});
