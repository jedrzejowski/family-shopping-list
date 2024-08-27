import * as model from '../model.ts';
import {createRepo} from './_repo.ts';

export const {
  useSearchQuery: useSearchProductQuery,
  useEntity: useGetProductQuery,
  useCreateEntityMutation: useCreateProductMutation,
  useUpdateEntityMutation: useUpdateProductMutation,
} = createRepo<model.Product>('products', {
  idField: 'productId',
});
