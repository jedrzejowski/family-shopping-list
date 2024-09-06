import {
  QueryClient,
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult
} from '@tanstack/react-query';
import * as model from '../model.ts';
import {useFamilyId} from './family.tsx';
import {Autocomplete, Box, Button, Dialog, DialogActions, DialogTitle, TextField} from "@mui/material";
import {useLoadingShroud} from "../LoadingShroud.tsx";
import {FC, HTMLAttributes, ReactElement, useCallback, useRef, useState} from "react";
import {BaseTextFieldProps} from "@mui/material/TextField/TextField";
import {SearchQuery} from "../model.ts";
import {NIL} from "uuid";
import {useFastSnackbar} from "../hooks/snackbar.tsx";

export interface UseSearchQuery<Props extends object = object> {
  (args: SearchQuery & Props): UseQueryResult<model.SearchResult<string>, unknown>;
}

export interface UseDeleteUx {
  (id: string): {
    dialog: ReactElement | null,
    start: () => void,
    mutation: UseMutationResult<string, Error, string, void>
  }
}

export function createRepo<T>(name: string, args: {
  idField: keyof T;
  entityToText: (entity: T) => string;
  postMutationInvalidate?: (args: {
    mutationType: 'update' | 'create' | 'delete';
    entityId: string;
    queryClient: QueryClient;
    clearSearchOf: (...names: string[]) => void;
  }) => void;
}) {
  const {idField, entityToText, postMutationInvalidate} = args;

  function handlePostMutationInvalidate(
    queryClient: QueryClient,
    mutationType: 'update' | 'create' | 'delete',
    entityId: string
  ) {
    if (!postMutationInvalidate) return;

    postMutationInvalidate({
      entityId,
      mutationType,
      queryClient,
      clearSearchOf(names) {
        for (const name of names) {
          queryClient.invalidateQueries({
            queryKey: ['_createRepo/search', name],
          });
        }
      }
    })
  }

  const useSearchQuery: UseSearchQuery = (args) => {
    const familyId = useFamilyId();

    return useQuery({
      queryKey: ['_createRepo/search', name, args],
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
      },
    });
  }

  function useGetEntityQuery(id: string | null | undefined) {
    const familyId = useFamilyId();

    return useQuery<T>({
      queryKey: ['_createRepo', name, id],
      enabled: typeof id === 'string',
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
    const fastSnackbar = useFastSnackbar();
    const loadingShroud = useLoadingShroud();

    return useMutation({
      mutationFn: async (entity: T): Promise<string> => {
        const id = entity[idField];
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

        return entity[idField] as string;
      },
      onMutate() {
        loadingShroud(true);
      },
      onError() {
        fastSnackbar('error');
      },
      onSuccess(entityId) {
        fastSnackbar('saved');

        queryClient.invalidateQueries({
          queryKey: ['_createRepo', name, entityId],
          exact: true,
        });

        handlePostMutationInvalidate(queryClient, 'update', entityId);
      },
      onSettled() {
        loadingShroud(false);
      }
    });
  }

  function useCreateEntityMutation() {
    const familyId = useFamilyId();
    const queryClient = useQueryClient();
    const fastSnackbar = useFastSnackbar();
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
        return repo[idField] as string;
      },
      onMutate() {
        loadingShroud(true);
      },
      onError() {
        fastSnackbar('error')
      },
      onSuccess(entityId) {
        fastSnackbar('saved');

        queryClient.invalidateQueries({
          queryKey: ['_createRepo/search', name],
        }).finally(() => {
          queryClient.invalidateQueries({
            queryKey: ['_createRepo', name, entityId],
            exact: true,
          });
        });

        handlePostMutationInvalidate(queryClient, 'create', entityId);
      },
      onSettled() {
        loadingShroud(false);
      }
    });
  }

  function useDeleteEntityMutation() {
    const familyId = useFamilyId();
    const fastSnackbar = useFastSnackbar();
    const queryClient = useQueryClient();
    const loadingShroud = useLoadingShroud();

    return useMutation({
      mutationFn: async (entityId: string): Promise<string> => {
        const response = await fetch(`/api/${name}/${entityId}`, {
          method: 'DELETE',
          headers: {
            'x-family-id': familyId,
          },
        });

        if (!response.ok) {
          throw response;
        }

        return entityId;
      },
      onMutate() {
        loadingShroud(true);
      },
      onError() {
        fastSnackbar('error')
      },
      onSuccess(entityId) {
        fastSnackbar('deleted');

        queryClient.invalidateQueries({
          queryKey: ['_createRepo/search', name],
        }).finally(() => {
          setTimeout(() => {

            queryClient.invalidateQueries({
              queryKey: ['_createRepo', name, entityId],
              exact: true,
            });
          }, 100);
        })

        handlePostMutationInvalidate(queryClient, 'delete', entityId);
      },
      onSettled() {
        loadingShroud(false);
      }
    });
  }

  const EntityAutocompleteRenderOption: FC<{
    entityId: string;
    optionProps: HTMLAttributes<HTMLLIElement>;
  }> = props => {
    const getQuery = useGetEntityQuery(props.entityId)

    return <Box
      component="li"
      {...props.optionProps}
    >
      {getQuery.data ? entityToText(getQuery.data) : ''}
    </Box>
  }

  const EntityAutocomplete: FC<BaseTextFieldProps & {
    value: string | null
    onChange: (entityId: string | null) => void;
  }> = props => {
    const queryClient = useQueryClient();
    const value = props.value === NIL || !props.value ? null : props.value
    useGetEntityQuery(value);
    const [inputValue, setInputValue] = useState('');
    const searchQuery = useSearchQuery({
      searchText: inputValue,
      limit: 100,
      offset: 0,
    });

    return <Autocomplete
      value={value}
      onChange={(_event, value) => props.onChange(value)}
      inputValue={inputValue}
      getOptionKey={id => id}
      getOptionLabel={id => {
        const query = queryClient.getQueryData(['_createRepo', name, id])
        return query ? entityToText(query as T) : '';
      }}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      renderOption={(props, option) => {
        const {key, ...optionProps} = props;
        return <EntityAutocompleteRenderOption key={key} optionProps={optionProps} entityId={option}/>
      }}
      renderInput={(params) => {

        return <TextField
          sx={props.sx}
          {...params}
          label={props.label}
          margin={props.margin}
          fullWidth={props.fullWidth}
        />;
      }}
      options={searchQuery.data?.items ?? []}
    />
  }

  const useDeleteUx: UseDeleteUx = (id: string) => {
    const mutation = useDeleteEntityMutation();
    const getQuery = useGetEntityQuery(id);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const dialogLatch = useRef(false);

    function handleDialogOk() {
      setIsDialogOpen(false);
      mutation.mutate(id);
    }

    function handleDialogCancel() {
      setIsDialogOpen(false);
    }

    const dialog = dialogLatch.current ? (
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogCancel}
      >
        <DialogTitle>
          Czy na pewno usunąć '{getQuery.data ? entityToText(getQuery.data) : null}'?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDialogOk} variant="outlined" color="error">Tak</Button>
          <Button onClick={handleDialogCancel} autoFocus>Nie</Button>
        </DialogActions>
      </Dialog>
    ) : null;

    const start = useCallback(() => {
      dialogLatch.current = true;
      setIsDialogOpen(true);
    }, []);

    return {dialog, start, mutation}
  }


  return {
    useSearchQuery,
    useGetEntityQuery,
    useUpdateEntityMutation,
    useCreateEntityMutation,
    useDeleteEntityMutation,
    useDeleteUx,
    EntityAutocomplete
  };
}

