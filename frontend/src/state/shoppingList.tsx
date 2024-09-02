import {useFamilyId} from "./family.ts";
import {useQuery} from "@tanstack/react-query";
import * as model from "../model.ts";

export function useShoppingListItemsQuery(args: {
  shoppingListId: string;
  searchText?: string;
  limit: number;
  offset: number;
}) {
  const familyId = useFamilyId();

  return useQuery<model.SearchResult<string>>({
    queryKey: ['repo', 'shoppingList.items', args],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('limit', args.limit.toString());
      params.set('offset', args.offset.toString());
      if (args.searchText) params.set('searchText', args.searchText);

      const response = await fetch(`/api/shopping-lists/${args.shoppingListId}/items` + params.toString(), {
        headers: {
          'x-family-id': familyId,
        }
      });

      if (response.status !== 200) {
        throw response;
      }

      return await response.json();
    }
  });
}
