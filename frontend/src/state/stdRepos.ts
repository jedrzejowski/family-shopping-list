import {createRepo} from './_createRepo.ts';
import * as model from '../model.ts';

export const {
  useSearchQuery: useSearchShopQuery,
  useEntity: useGetShopQuery,
  useCreateEntityMutation: useCreateShopMutation,
  useUpdateEntityMutation: useUpdateShopMutation,
} = createRepo<model.Shop>('shops', {
  idField: 'shopId',
});

export const {
  useSearchQuery: useSearchProductQuery,
  useEntity: useGetProductQuery,
  useCreateEntityMutation: useCreateProductMutation,
  useUpdateEntityMutation: useUpdateProductMutation,
} = createRepo<model.Product>('products', {
  idField: 'productId',
});
