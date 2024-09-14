import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useFetchApi} from './fetch.ts';
import * as model from '../model.ts';
import {useFastSnackbar} from '../hooks/snackbar.tsx';
import {makeQueryKeyForShoppingListItem} from './stdRepos.ts';
import {SearchResult} from '../model.ts';
import {createQueryKeyForShoppingListItemsQuery} from './shoppingList.tsx';

export function useShoppingListItemIsCheckedMutation() {
  const fetchApi = useFetchApi();
  const queryClient = useQueryClient();
  const fastSnackbar = useFastSnackbar();

  return useMutation({
    mutationFn: async (variables: { shoppingListItemId: string; isChecked: boolean; updateSearch: boolean }) => {
      const pathSuffix = variables.isChecked ? 'check' : 'uncheck';
      const response = await fetchApi(`/shopping-list-items/${variables.shoppingListItemId}/${pathSuffix}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw response;
      }

      return variables;
    },
    onMutate(variables) {
      let dataBefore: model.ShoppingListItem | null = null;

      let shoppingListId: string | null = null;

      queryClient.setQueryData(
        makeQueryKeyForShoppingListItem.getQuery(variables.shoppingListItemId),
        (data: model.ShoppingListItem | undefined) => {
          if (data) {
            shoppingListId = data.shoppingListId;
            dataBefore = data;
            data = {
              ...data,
              isChecked: variables.isChecked,
            };
          }
          return data;
        });

      if (variables.updateSearch && shoppingListId) {
        queryClient.setQueryData(
          createQueryKeyForShoppingListItemsQuery({
            shoppingListId,
            limit: Infinity,
            offset: 0
          }),
          (data: SearchResult<string>) => {
            if (data && shoppingListId) {
              const items = [...data.items];
              const index = items.indexOf(variables.shoppingListItemId);

              if (index >= 0) {
                items.splice(index, 1);
                items.push(variables.shoppingListItemId);

                data = {...data, items};
              }
            }
            return data;
          });
      }

      return {dataBefore};
    },
    onError(_error, variables, context) {
      if (context?.dataBefore) {

        queryClient.setQueryData(
          makeQueryKeyForShoppingListItem.getQuery(variables.shoppingListItemId),
          context.dataBefore);
      }

      fastSnackbar('error');
    }
  });
}
