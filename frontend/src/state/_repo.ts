import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import * as model from '../model.ts';

export function createRepo<T>(name: string, args: {
  idField: keyof T;
}) {

  function useSearchQuery(args: {
    searchText?: string;
    limit: number;
    offset: number;
  }) {

    return useQuery<model.SearchResult<string>>({
      queryKey: ['repo/search', name, args],
      queryFn: async () => {
        const params = new URLSearchParams();
        params.set('limit', args.limit.toString());
        params.set('offset', args.offset.toString());
        if (args.searchText) params.set('searchText', args.searchText);


        const response = await fetch(`/api/${name}?` + params.toString());

        if (response.status !== 200) {
          throw response;
        }

        return await response.json();
      }
    });
  }

  function useEntity(id: string) {
    return useQuery<T>({
      queryKey: ['repo', name, id],
      queryFn: async () => {
        const response = await fetch(`/api/${name}/${id}`);

        if (response.status !== 200) {
          throw response;
        }

        return await response.json();
      }
    });
  }

  function useUpdateEntityMutation() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (entity: T): Promise<string> => {
        const id = entity[args.idField];
        const response = await fetch(`/api/${name}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(entity),
        });

        if (!response.ok) {
          throw response;
        }

        return entity[args.idField] as string;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [name, data],
          exact: true,
        });
      },
    });
  }


  function useCreateEntityMutation() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (entity: T): Promise<string> => {
        const response = await fetch(`/api/${name}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(entity),
        });

        if (!response.ok) {
          throw response;
        }

        const repo = await response.json();
        return repo[args.idField] as string;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [name, data],
          exact: true,
        });
      },
    });
  }

  return {
    useSearchQuery,
    useEntity,
    useUpdateEntityMutation,
    useCreateEntityMutation,
  };
}
