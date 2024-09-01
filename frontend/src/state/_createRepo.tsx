import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import * as model from '../model.ts';
import {useFamilyId} from './family.ts';
import {ProviderContext as SnackbarContext, useSnackbar} from 'notistack';
import {IconButton} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {useLoadingShroud} from "../LoadingShroud.tsx";

function successSnackbar({enqueueSnackbar, closeSnackbar}: SnackbarContext) {
  enqueueSnackbar({
    message: 'Zapisano',
    variant: 'success',
    action: key => <>
      <IconButton
        aria-label="close"
        color="inherit"
        sx={{p: 0.5}}
        onClick={() => closeSnackbar(key)}
      >
        <CloseIcon/>
      </IconButton>
    </>
  });

}

function errorSnackbar({enqueueSnackbar, closeSnackbar}: SnackbarContext) {
  enqueueSnackbar({
    message: 'Wystąpił błąd',
    variant: 'error',
    action: key => <>
      <IconButton
        aria-label="close"
        color="inherit"
        sx={{p: 0.5}}
        onClick={() => closeSnackbar(key)}
      >
        <CloseIcon/>
      </IconButton>
    </>
  });

}

export function createRepo<T>(name: string, args: {
  idField: keyof T;
}) {

  function useSearchQuery(args: {
    searchText?: string;
    limit: number;
    offset: number;
  }) {
    const familyId = useFamilyId();

    return useQuery<model.SearchResult<string>>({
      queryKey: ['repo/search', name, args],
      queryFn: async () => {
        const params = new URLSearchParams();
        params.set('limit', args.limit.toString());
        params.set('offset', args.offset.toString());
        if (args.searchText) params.set('searchText', args.searchText);


        const response = await fetch(`/api/${name}?` + params.toString(), {
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

  function useGetEntity(id: string) {
    const familyId = useFamilyId();

    return useQuery<T>({
      queryKey: ['repo', name, id],
      queryFn: async () => {
        const response = await fetch(`/api/${name}/${id}`, {
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

  function useUpdateEntityMutation() {
    const familyId = useFamilyId();
    const queryClient = useQueryClient();
    const snackbar = useSnackbar();
    const loadingShroud = useLoadingShroud();

    return useMutation({
      mutationFn: async (entity: T): Promise<string> => {
        const id = entity[args.idField];
        const response = await fetch(`/api/${name}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-family-id': familyId,
          },
          body: JSON.stringify(entity),
        });

        if (!response.ok) {
          throw response;
        }

        return entity[args.idField] as string;
      },
      onMutate() {
        loadingShroud(true);
      },
      onError() {
        errorSnackbar(snackbar)
      },
      onSuccess(data) {
        successSnackbar(snackbar);

        queryClient.invalidateQueries({
          queryKey: [name, data],
          exact: true,
        });
      },
      onSettled() {
        loadingShroud(false);
      }
    });
  }


  function useCreateEntityMutation() {
    const familyId = useFamilyId();
    const queryClient = useQueryClient();
    const snackbar = useSnackbar();
    const loadingShroud = useLoadingShroud();

    return useMutation({
      mutationFn: async (entity: T): Promise<string> => {
        const response = await fetch(`/api/${name}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-family-id': familyId,
          },
          body: JSON.stringify(entity),
        });

        if (!response.ok) {
          throw response;
        }

        const repo = await response.json();
        return repo[args.idField] as string;
      },
      onMutate() {
        loadingShroud(true);
      },
      onError() {
        errorSnackbar(snackbar)
      },
      onSuccess(data) {
        successSnackbar(snackbar);

        queryClient.invalidateQueries({
          queryKey: [name, data],
          exact: true,
        });
      },
      onSettled() {
        loadingShroud(false);
      }
    });
  }

  return {
    useSearchQuery,
    useGetEntity,
    useUpdateEntityMutation,
    useCreateEntityMutation,
  };
}
