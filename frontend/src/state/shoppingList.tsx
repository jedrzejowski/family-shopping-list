import {SearchParams} from "../model.ts";
import {useFetchApi} from "./fetch.ts";
import {UseSearchQueries, UseSearchQuery} from "./repo/searchQuery.ts";
import {useQueries, useQuery} from "@tanstack/react-query";

export function createQueryKeyForShoppingListItemsQuery(args: SearchParams & { shoppingListId: string }) {
  const {shoppingListId, offset, searchText = ""} = args;
  let limit: string | number = args.limit;
  if (limit == Infinity) limit = "Infinity";
  return ['repo', 'shopping-lists/items', shoppingListId, limit, offset, searchText];
}

export const useShoppingListItemsQuery: UseSearchQuery<{
  shoppingListId: string;
}> = args => {
  const fetchApi = useFetchApi();

  return useQuery({
    queryKey: createQueryKeyForShoppingListItemsQuery(args),
    queryFn: async () => {
      const response = await fetchApi([
        `/shopping-lists/${args.shoppingListId}/items`,
        {
          limit: args.limit,
          offset: args.offset,
          searchText: args.searchText,
        }
      ]);

      if (response.status !== 200) {
        throw response;
      }

      return await response.json();
    }
  });
}

export const useShoppingListItemsQueries: UseSearchQueries<{
  shoppingListId: string;
}> = args => {
  const fetchApi = useFetchApi();

  return useQueries({
    queries: args.map(args => ({
      queryKey: createQueryKeyForShoppingListItemsQuery(args),
      queryFn: async () => {
        const response = await fetchApi([
          `/shopping-lists/${args.shoppingListId}/items`,
          {
            limit: args.limit,
            offset: args.offset,
            searchText: args.searchText,
          }
        ]);

        if (response.status !== 200) {
          throw response;
        }

        return await response.json();
      }
    }))
  });
}
