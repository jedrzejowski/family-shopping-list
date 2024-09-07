import {
  QueryClient,
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult
} from '@tanstack/react-query';
import * as model from '../model.ts';
import {Autocomplete, Box, Button, Dialog, DialogActions, DialogTitle, TextField} from "@mui/material";
import {useLoadingShroud} from "../LoadingShroud.tsx";
import {FC, HTMLAttributes, ReactElement, useCallback, useMemo, useRef, useState} from "react";
import {BaseTextFieldProps} from "@mui/material/TextField/TextField";
import {SearchQuery} from "../model.ts";
import {NIL} from "uuid";
import {useFastSnackbar} from "../hooks/snackbar.tsx";
import {uuidRegex} from "../regex.ts";
import {useFetchApi} from "./fetch.ts";

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
    const fetchApi = useFetchApi();

    return useQuery({
      queryKey: ['_createRepo/search', name, args],
      queryFn: async () => {
        const params = new URLSearchParams();
        params.set('limit', args.limit.toString());
        params.set('offset', args.offset.toString());
        if (args.searchText) params.set('searchText', args.searchText);

        const response = await fetchApi(`/${name}?` + params.toString());
        if (!response.ok) throw response;
        return await response.json();
      },
    });
  }

  function useGetEntityQuery(id: string | null | undefined) {
    const fetchApi = useFetchApi();

    return useQuery<T>({
      queryKey: ['_createRepo', name, id],
      enabled: typeof id === 'string',
      queryFn: async () => {
        const response = await fetchApi(`/${name}/${id}`);
        if (!response.ok) throw response;
        return await response.json();
      }
    });
  }

  function useUpdateEntityMutation() {
    const fetchApi = useFetchApi();
    const queryClient = useQueryClient();
    const fastSnackbar = useFastSnackbar();
    const loadingShroud = useLoadingShroud();

    return useMutation({
      mutationFn: async (entity: T): Promise<string> => {
        const id = entity[idField];
        const response = await fetchApi(`/${name}/${id}`, {
          method: 'PUT',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(entity),
        });

        if (!response.ok) throw response;

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
    const fetchApi = useFetchApi();
    const queryClient = useQueryClient();
    const fastSnackbar = useFastSnackbar();
    const loadingShroud = useLoadingShroud();

    return useMutation({
      mutationFn: async (entity: T): Promise<string> => {
        const response = await fetchApi(`/${name}`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(entity),
        });

        if (!response.ok) throw response;

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
    const fetchApi = useFetchApi();
    const fastSnackbar = useFastSnackbar();
    const queryClient = useQueryClient();
    const loadingShroud = useLoadingShroud();

    return useMutation({
      mutationFn: async (entityId: string): Promise<string> => {
        const response = await fetchApi(`/${name}/${entityId}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw response;

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
    option: string;
    optionProps: HTMLAttributes<HTMLLIElement>;
  }> = props => {
    const isUuid = uuidRegex.test(props.option);
    const getQuery = useGetEntityQuery(isUuid ? props.option : null)

    return <Box
      component="li"
      {...props.optionProps}
    >
      {isUuid && getQuery.data ? entityToText(getQuery.data) : ''}
      {!isUuid ? <i>{props.option}</i> : null}
    </Box>
  }

  const EntityAutocomplete: FC<BaseTextFieldProps & {
    value: string | null
    onChange: (entityId: string | null) => void;
    allowCustomInput?: boolean;
  }> = props => {
    const {allowCustomInput} = props;

    const value = props.value === NIL || !props.value ? null : props.value
    const queryClient = useQueryClient();
    useGetEntityQuery(value && uuidRegex.test(value) ? value : null);
    const [inputValue, setInputValue] = useState('');
    const searchQuery = useSearchQuery({
      searchText: inputValue,
      limit: 100,
      offset: 0,
    });

    const options = useMemo(() => {
      const options = searchQuery.data?.items ?? [];
      if (allowCustomInput && inputValue) {
        return [inputValue, ...options];
      } else {
        return options;
      }
    }, [searchQuery.data?.items, inputValue, allowCustomInput])

    return <Autocomplete
      value={value}
      onChange={(_event, value) => props.onChange(value)}
      inputValue={inputValue}
      getOptionKey={id => id}
      getOptionLabel={value => {
        if (uuidRegex.test(value)) {
          const query = queryClient.getQueryData(['_createRepo', name, value])
          return query ? entityToText(query as T) : '';
        }

        if (allowCustomInput) return value;

        return '';
      }}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      renderOption={(props, option) => {
        const {key, ...optionProps} = props;
        return <EntityAutocompleteRenderOption key={key} optionProps={optionProps} option={option}/>
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
      options={options}
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

