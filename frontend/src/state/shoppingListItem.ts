import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useFetchApi} from './fetch.ts';
import * as model from '../model.ts';
import {useFastSnackbar} from '../hooks/snackbar.tsx';
import {shoppingListItemsRepo} from './stdRepos.ts';
import {SearchResult} from '../model.ts';
import {createQueryKeyForShoppingListItemsQuery} from './shoppingList.tsx';

export function useShoppingListItemIsCheckedMutation() {
  const fetchApi = useFetchApi();
  const queryClient = useQueryClient();
  const fastSnackbar = useFastSnackbar();

  return useMutation({
    onMutate(variables: {
      shoppingListItemId: string;
      isChecked: boolean;
      updateSearch: boolean
    }) {
      let ctx = {
        dataBefore: null as model.ShoppingListItem | null,
      };

      queryClient.setQueryData(
        shoppingListItemsRepo.makeQueryKeyFor.getQuery(variables.shoppingListItemId),
        (data: model.ShoppingListItem | undefined) => {
          if (data) {
            ctx.dataBefore = data;
            data = {
              ...data,
              isChecked: variables.isChecked,
            };
          }
          return data;
        });


      return ctx;
    },
    async mutationFn(variables) {
      const pathSuffix = variables.isChecked ? 'check' : 'uncheck';
      const response = await fetchApi(`/shopping-list-items/${variables.shoppingListItemId}/${pathSuffix}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw response;
      }

      return variables;
    },
    onError(_error, variables, context) {
      if (context?.dataBefore) {

        queryClient.setQueryData(
          shoppingListItemsRepo.makeQueryKeyFor.getQuery(variables.shoppingListItemId),
          context.dataBefore);
      }

      fastSnackbar('error');
    },
    onSuccess(_data, variables, context) {

      if (variables.updateSearch && context.dataBefore) {
        queryClient.setQueryData(
          createQueryKeyForShoppingListItemsQuery({
            shoppingListId: context.dataBefore.shoppingListId,
            limit: Infinity,
            offset: 0
          }),
          (data: SearchResult<string>) => {
            if (data) {
              const items = [...data.items];
              const index = items.indexOf(variables.shoppingListItemId);

              if (index >= 0) {
                items.splice(index, 1);

                if (variables.isChecked) {
                  items.push(variables.shoppingListItemId);
                } else {
                  items.unshift(variables.shoppingListItemId);
                }

                data = {...data, items};
              }
            }
            return data;
          });
      }
    }
  });
}
