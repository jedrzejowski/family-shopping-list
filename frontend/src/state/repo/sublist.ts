import {SearchParams} from '../../model.ts';
import {UseSearchQueries, UseSearchQuery} from './searchQuery.ts';
import {useFetchApi} from '../fetch.ts';
import {useQueries, useQuery} from '@tanstack/react-query';

export function createRepoOfItemsOfEntity<Key extends string>(args: {
  repoName: string;
  listName: string;
  idField: Key;
}) {
  const {repoName, idField, listName} = args;

  type AdditionalArgs = {
    [key in Key]: string;
  }

  const makeQueryKeyFor = {
    search(args: SearchParams & AdditionalArgs) {
      const {[idField]: idValue, offset, searchText = ''} = args;
      let limit: string | number = args.limit;
      if (limit == Infinity) limit = 'Infinity';
      return ['repo', `${repoName}/${listName}`, idValue, {limit, offset}, searchText];
    }
  };


  const useSearchQuery: UseSearchQuery<AdditionalArgs> = args => {
    const fetchApi = useFetchApi();

    return useQuery({
      queryKey: makeQueryKeyFor.search(args),
      queryFn: async () => {
        const response = await fetchApi([
          `/${repoName}/${args[idField]}/${listName}`,
          {
            limit: args.limit,
            offset: args.offset,
            searchText: args.searchText,
          }
        ]);

        if (response.status !== 200) {
          throw response;
        }

        return await response.json();
      }
    });
  };

  const useSearchQueries: UseSearchQueries<AdditionalArgs> = args => {
    const fetchApi = useFetchApi();

    return useQueries({
      queries: args.map(args => ({
        queryKey: makeQueryKeyFor.search(args),
        queryFn: async () => {
          const response = await fetchApi([
            `/${repoName}/${args[idField]}/${listName}`,
            {
              limit: args.limit,
              offset: args.offset,
              searchText: args.searchText,
            }
          ]);

          if (response.status !== 200) {
            throw response;
          }

          return await response.json();
        }
      }))
    });
  };


  return {makeQueryKeyFor, useSearchQuery, useSearchQueries};
}
