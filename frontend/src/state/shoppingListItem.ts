import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useFetchApi} from './fetch.ts';
import * as model from '../model.ts';
import {useFastSnackbar} from '../hooks/snackbar.tsx';

export function useShoppingListItemIsCheckedMutation() {
  const fetchApi = useFetchApi();
  const queryClient = useQueryClient();
  const fastSnackbar = useFastSnackbar();

  return useMutation({
    mutationFn: async (variables: { shoppingListItemId: string; isChecked: boolean }) => {
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

      queryClient.setQueryData(
        ['_createRepo', 'shopping-list-items', variables.shoppingListItemId],
        (data: model.ShoppingListItem | undefined) => {
          if (data) {
            dataBefore = data;
            data = {
              ...data,
              isChecked: variables.isChecked,
            };
          }
          return data;
        });

      return {dataBefore};
    },
    onError(_error, variables, context) {
      if (context?.dataBefore) {

        queryClient.setQueryData(
          ['_createRepo', 'shopping-list-items', variables.shoppingListItemId],
          context.dataBefore);
      }

      fastSnackbar('error');
    }
  });
}
