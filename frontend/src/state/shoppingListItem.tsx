import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useFetchApi} from './fetch.ts';
import * as model from '../model.ts';
import {FastSnackbarAction, useFastSnackbar} from '../hooks/snackbar.tsx';
import {itemsOfShoppingListRepo, shoppingListItemsRepo} from './stdRepos.ts';
import {SearchResult} from '../model.ts';
import UndoIcon from '@mui/icons-material/Undo';
import {SnackbarKey} from "notistack";

let lastSnackbarKey: SnackbarKey | undefined = undefined;

export function useShoppingListItemIsCheckedMutation() {
  const fetchApi = useFetchApi();
  const queryClient = useQueryClient();
  const fastSnackbar = useFastSnackbar();

  const mutation = useMutation({
    onMutate(variables: {
      shoppingListItemId: string;
      isChecked: boolean;
      updateSearch?: string;
      rollbackToIndex?: number;
    }) {
      const ctx = {
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
      console.log('HERE', _error)
      if (context?.dataBefore) {

        queryClient.setQueryData(
          shoppingListItemsRepo.makeQueryKeyFor.getQuery(variables.shoppingListItemId),
          context.dataBefore);
      }

      fastSnackbar('error');
    },
    onSuccess(_data, variables, context) {

      if (typeof variables.updateSearch === 'string' && context.dataBefore) {

        let undoAction: FastSnackbarAction = null;

        queryClient.setQueryData(
          itemsOfShoppingListRepo.makeQueryKeyFor.fullSearch({
            shoppingListId: context.dataBefore.shoppingListId,
            limit: Infinity,
            offset: 0,
            searchText: variables?.updateSearch,
          }),
          (data: SearchResult<string> | undefined) => {
            if (!data) return data;
            const index = data.items.indexOf(variables.shoppingListItemId);

            if (index < 0) return data;
            const items = [...data.items];
            items.splice(index, 1);

            if (typeof variables.rollbackToIndex === 'number') {
              items.splice(variables.rollbackToIndex, 0, variables.shoppingListItemId);
            } else {
              if (variables.isChecked) {
                items.push(variables.shoppingListItemId);
              } else {
                items.unshift(variables.shoppingListItemId);
              }

              undoAction = {
                icon: <UndoIcon/>,
                handler() {
                  mutation.mutate({
                    ...variables,
                    isChecked: !variables.isChecked,
                    rollbackToIndex: index,
                  })
                }
              };
            }

            data = {...data, items};
            return data;
          });


        if (variables.rollbackToIndex === undefined) {
          if (lastSnackbarKey !== undefined) fastSnackbar.closeSnackbar(lastSnackbarKey);
          lastSnackbarKey = fastSnackbar({
            variant: 'success',
            message: 'Zapisano',
            actions: [undoAction, 'close']
          });
        }
      }
    }
  });

  return mutation;
}
