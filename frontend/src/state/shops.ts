import {createRepo} from './_repo.ts';
import * as model from '../model.ts';

export const {
  useSearchQuery: useSearchShopQuery,
  useEntity: useGetShopQuery,
  useCreateEntityMutation: useCreateShopMutation,
  useUpdateEntityMutation: useUpdateShopMutation,
} = createRepo<model.Shop>('shops', {
  idField: 'shopId',
});
