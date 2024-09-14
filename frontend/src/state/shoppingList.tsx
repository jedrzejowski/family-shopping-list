import {useQuery} from "@tanstack/react-query";
import * as model from "../model.ts";
import {UseSearchQuery} from "./repo/repo.tsx";
import {SearchParams} from "../model.ts";
import {useFetchApi} from "./fetch.ts";

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

  return useQuery<model.SearchResult<string>>({
    queryKey: createQueryKeyForShoppingListItemsQuery(args),
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('limit', args.limit.toString());
      params.set('offset', args.offset.toString());
      if (args.searchText) params.set('searchText', args.searchText);

      const response = await fetchApi(`/shopping-lists/${args.shoppingListId}/items?` + params.toString());

      if (response.status !== 200) {
        throw response;
      }

      return await response.json();
    }
  });
}
