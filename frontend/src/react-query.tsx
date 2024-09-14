import {FC, ReactNode, useRef} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useFetchApi} from "./state/fetch.ts";
import * as model from "./model.ts";
import {
  makeQueryKeyForProduct,
  makeQueryKeyForShop,
  makeQueryKeyForShoppingList,
  makeQueryKeyForShoppingListItem
} from "./state/stdRepos.ts";
import {createQueryKeyForShoppingListItemsQuery} from "./state/shoppingList.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    }
  }
});

if (import.meta.env.NODE_ENV === "development") {
  // @ts-ignore
  window.queryClient = queryClient;
}

export const ReactQueryProvider: FC<{
  children: ReactNode;
}> = props => {
  const fetchApi = useFetchApi();

  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;

    fetchApi('/everything').then(async response => {
      const body: {
        products: model.Product[];
        shops: model.Shop[];
        shoppingLists: model.ShoppingList[];
        shoppingListItems: model.ShoppingListItem[];
        shoppingListsItems: Record<string, string[]>;
      } = await response.json()

      for (const product of body.products) {
        queryClient.setQueryData(
          makeQueryKeyForProduct.getQuery(product.productId),
          product);
      }

      for (const shop of body.shops) {
        queryClient.setQueryData(
          makeQueryKeyForShop.getQuery(shop.shopId),
          shop);
      }

      for (const shoppingList of body.shoppingLists) {
        queryClient.setQueryData(
          makeQueryKeyForShoppingList.getQuery(shoppingList.shoppingListId),
          shoppingList);
      }

      for (const shoppingListItem of body.shoppingListItems) {
        queryClient.setQueryData(
          makeQueryKeyForShoppingListItem.getQuery(shoppingListItem.shoppingListItemId),
          shoppingListItem);
      }


      for (const shoppingListId in body.shoppingListsItems) {
        queryClient.setQueryData(
          createQueryKeyForShoppingListItemsQuery({
            shoppingListId,
            limit: Infinity,
            offset: 0,
          }),
          body.shoppingListsItems[shoppingListId]);
      }
    })
  }


  return <QueryClientProvider client={queryClient}>
    {props.children}
  </QueryClientProvider>
}
