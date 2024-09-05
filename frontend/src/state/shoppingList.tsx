import {useFamilyId} from "./family.tsx";
import {useQuery} from "@tanstack/react-query";
import * as model from "../model.ts";
import {UseSearchQuery} from "./_createRepo.tsx";

export const useShoppingListItemsQuery: UseSearchQuery<{
  shoppingListId: string;
}> = args => {
  const familyId = useFamilyId();
  const {shoppingListId, ...searchQueryArgs} = args;

  return useQuery<model.SearchResult<string>>({
    queryKey: ['repo', 'shopping-lists/items', shoppingListId, searchQueryArgs],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('limit', args.limit.toString());
      params.set('offset', args.offset.toString());
      if (args.searchText) params.set('searchText', args.searchText);

      const response = await fetch(`/api/shopping-lists/${shoppingListId}/items?` + params.toString(), {
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
