import {
  QueryClient,
  useMutation,
  UseMutationResult, useQueries,
  useQuery,
  useQueryClient,
  UseQueryResult
} from '@tanstack/react-query';
import {useLoadingShroud} from "../../LoadingShroud.tsx";
import {SearchParams} from "../../model.ts";
import {useFastSnackbar} from "../../hooks/snackbar.tsx";
import {isUuid} from "../../uuid.ts";
import {useFetchApi} from "../fetch.ts";
import {createUseDeleteUx} from "./useDeleteUx.tsx";
import {createEntityAutocomplete} from "./EntityAutocomplete.tsx";
import {UseSearchQueries, UseSearchQuery} from "./searchQuery.ts";

export interface UseText {
  (entityId: string | null | undefined): string | null;

  fromQueryClient(queryClient: QueryClient, entityId: string | null | undefined): string | null;
}

export interface UseCreateEntityMutation<M> {
  (): UseMutationResult<string, Error, M, void>;
}

export interface UseUpdateEntityMutation<M> {
  (): UseMutationResult<string, Error, M, void>;
}

export interface UseDeleteEntityMutation {
  (): UseMutationResult<string, Error, string, void>;
}

export interface UseGetEntityQuery<M> {
  (entityId: string | null | undefined): UseQueryResult<M, unknown>;
}

export function createRepo<M>(name: string, args: {
  idField: keyof M;
  entityToText: (entity: M) => string;
  postMutationInvalidate?: (args: {
    mutationType: 'update' | 'create' | 'delete';
    entityId: string;
    queryClient: QueryClient;
    clearSearchOf: (...names: string[]) => void;
  }) => void;
}) {
  const {idField, entityToText, postMutationInvalidate} = args;

  const makeQueryKeyFor = {
    search(args?: SearchParams) {
      if (args) {
        const {limit, offset, ...rest} = args;
        if (Object.keys(rest).length > 0) {
          return ['_createRepo/search', name, {limit, offset}, rest];
        } else {
          return ['_createRepo/search', name, {limit, offset}];
        }
      }
      return ['_createRepo/search', name];
    },
    getQuery: (entityId: string | null | undefined) => ['_createRepo', name, entityId],
  }


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
      queryKey: makeQueryKeyFor.search(args),
      queryFn: async () => {
        const response = await fetchApi([`/${name}`, args]);
        if (!response.ok) throw response;
        return await response.json();
      },
    });
  }

  const useSearchQueries: UseSearchQueries = (args) => {
    const fetchApi = useFetchApi();

    return useQueries({
      queries: args.map(args => ({
        queryKey: makeQueryKeyFor.search(args),
        queryFn: async () => {
          const response = await fetchApi([`/${name}`, args]);
          if (!response.ok) throw response;
          return await response.json();
        },
      }))
    });
  }

  const useGetQuery: UseGetEntityQuery<M> = (entityId) => {
    const fetchApi = useFetchApi();

    return useQuery({
      queryKey: makeQueryKeyFor.getQuery(entityId),
      enabled: isUuid(entityId),
      queryFn: async () => {
        const response = await fetchApi(`/${name}/${entityId}`);
        if (!response.ok) throw response;
        return await response.json();
      }
    });
  }

  const getAllCachedEntities = (queryClient: QueryClient) => {
    return queryClient.getQueriesData<M>({
      queryKey: ['_createRepo', name]
    }).map(it => it[1]);
  };

  const useUpdateMutation: UseUpdateEntityMutation<M> = () => {
    const fetchApi = useFetchApi();
    const queryClient = useQueryClient();
    const fastSnackbar = useFastSnackbar();
    const loadingShroud = useLoadingShroud();

    return useMutation({
      mutationFn: async (entity: M): Promise<string> => {
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
          queryKey: makeQueryKeyFor.getQuery(entityId),
          exact: true,
        });

        handlePostMutationInvalidate(queryClient, 'update', entityId);
      },
      onSettled() {
        loadingShroud(false);
      }
    });
  }

  const useCreateMutation: UseCreateEntityMutation<M> = () => {
    const fetchApi = useFetchApi();
    const queryClient = useQueryClient();
    const fastSnackbar = useFastSnackbar();
    const loadingShroud = useLoadingShroud();

    return useMutation({
      mutationFn: async (entity) => {
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
          queryKey: makeQueryKeyFor.search(),
        }).finally(() => {
          queryClient.invalidateQueries({
            queryKey: makeQueryKeyFor.getQuery(entityId),
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

  const useDeleteMutation: UseDeleteEntityMutation = () => {
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
          queryKey: makeQueryKeyFor.search(),
        }).finally(() => {
          setTimeout(() => {

            queryClient.invalidateQueries({
              queryKey: makeQueryKeyFor.getQuery(entityId),
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

  const useText: UseText = (entityId) => {
    const query = useGetQuery(entityId);

    if (query.data) {
      return entityToText(query.data);
    }

    return null;
  }

  useText.fromQueryClient = (queryClient, entityId) => {
    const query = queryClient.getQueryData(['_createRepo', name, entityId])
    return query ? entityToText(query as M) : null;
  }

  return {
    getAllCachedEntities,
    makeQueryKeyFor,
    useText,
    useSearchQuery,
    useSearchQueries,
    useGetQuery,
    useUpdateMutation,
    useCreateMutation,
    useDeleteMutation,
    useDeleteUx: createUseDeleteUx({
      useText,
      useGetQuery,
      useDeleteMutation,
    }),
    EntityAutocomplete: createEntityAutocomplete({
      useText,
      useSearchQuery,
    })
  };
}

