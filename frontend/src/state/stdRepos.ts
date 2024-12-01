import * as model from '../model.ts';
import {createRepo} from './repo/repo.tsx';
import {createRepoOfItemsOfEntity} from './repo/sublist.ts';

export const shopsRepo = createRepo<model.Shop, 'shopId'>('shops', {
  idField: 'shopId',
  entityToText: shop => shop.brandName,
});

export const productsRepo = createRepo<model.Product, 'productId'>('products', {
  idField: 'productId',
  entityToText: product => product.tradeName,
});

export const shoppingListsRepo = createRepo<model.ShoppingList, 'shoppingListId'>('shopping-lists', {
  idField: 'shoppingListId',
  entityToText: shoppingList => shoppingList.name,
});

export const shoppingListItemsRepo = createRepo<model.ShoppingListItem, 'shoppingListItemId'>('shopping-list-items', {
  idField: 'shoppingListItemId',
  entityToText: () => 'TODO',
  postMutationInvalidate({queryClient}) {
    queryClient.invalidateQueries({
      queryKey: itemsOfShoppingListRepo.makeQueryKeyFor.allSearch()
    });
  }
});


export const itemsOfShoppingListRepo = createRepoOfItemsOfEntity({
  repoName: 'shopping-lists',
  listName: 'items',
  idField: 'shoppingListId',
});

export const shoppingListsOfProductsRepo = createRepoOfItemsOfEntity({
  repoName: 'products',
  listName: 'shopping-lists',
  idField: 'productId',
});
