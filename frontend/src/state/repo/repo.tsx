import {
  QueryClient,
  useMutation, UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult
} from '@tanstack/react-query';
import * as model from '../../model.ts';
import {useLoadingShroud} from "../../LoadingShroud.tsx";
import {SearchQuery} from "../../model.ts";
import {useFastSnackbar} from "../../hooks/snackbar.tsx";
import {isUuid} from "../../uuid.ts";
import {useFetchApi} from "../fetch.ts";
import {createUseDeleteUx} from "./useDeleteUx.tsx";
import {createEntityAutocomplete} from "./EntityAutocomplete.tsx";

export interface UseEntityText {
  (entityId: string | null | undefined): string | null;

  fromQueryClient(queryClient: QueryClient, entityId: string | null | undefined): string | null;
}

export interface UseSearchQuery<Props extends object = object> {
  (args: SearchQuery & Props): UseQueryResult<model.SearchResult<string>, unknown>;
}

export interface UseDeleteEntityMutation {
  (): UseMutationResult<string, Error, string, void>;
}

export interface UseGetEntityQuery<M> {
  (entityId: string | null | undefined): UseQueryResult<M, unknown>;
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

  const useGetEntityQuery: UseGetEntityQuery<T> = (entityId) => {
    const fetchApi = useFetchApi();

    return useQuery({
      queryKey: ['_createRepo', name, entityId],
      enabled: isUuid(entityId),
      queryFn: async () => {
        const response = await fetchApi(`/${name}/${entityId}`);
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

  const useDeleteEntityMutation: UseDeleteEntityMutation = () => {
    const fetchApi = useFetchApi();
    const fastSnackbar = useFastSnackbar();
    const queryClient = useQueryClient();
    const loadingShroud = useLoadingShroud();

    return useMutation({
      mutationFn: async (entityId) => {
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

  const useEntityText: UseEntityText = (entityId) => {
    const query = useGetEntityQuery(entityId);

    if (query.data) {
      return entityToText(query.data);
    }

    return null;
  }

  useEntityText.fromQueryClient = (queryClient, entityId) => {
    const query = queryClient.getQueryData(['_createRepo', name, entityId])
    return query ? entityToText(query as T) : null;
  }

  return {
    useEntityText,
    useSearchQuery,
    useGetEntityQuery,
    useUpdateEntityMutation,
    useCreateEntityMutation,
    useDeleteEntityMutation,
    useDeleteUx: createUseDeleteUx({
      useEntityText,
      useGetEntityQuery,
      useDeleteEntityMutation,
    }),
    EntityAutocomplete: createEntityAutocomplete({
      useEntityText,
      useSearchQuery,
    })
  };
}

