import * as model from '../model.ts';
import {createRepo} from './repo/repo.tsx';

export const shopsRepo = createRepo<model.Shop>('shops', {
  idField: 'shopId',
  entityToText: shop => shop.brandName,
});

export const productsRepo = createRepo<model.Product>('products', {
  idField: 'productId',
  entityToText: product => product.tradeName,
});

export const shoppingListsRepo = createRepo<model.ShoppingList>('shopping-lists', {
  idField: 'shoppingListId',
  entityToText: shoppingList => shoppingList.name,
});

export const shoppingListItemsRepo = createRepo<model.ShoppingListItem>('shopping-list-items', {
  idField: 'shoppingListItemId',
  entityToText: () => 'TODO',
  postMutationInvalidate({queryClient}) {
    queryClient.invalidateQueries({queryKey: ['repo', 'shopping-lists/items']});
  }
});
