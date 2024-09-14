import {useFamilyId} from './family.tsx';
import {useQuery} from '@tanstack/react-query';

export function useFetchApi() {
  const familyId = useFamilyId();
  return async (path: string | [string, object], init?: RequestInit) => {
    // await wait(2000000);

    const url = '/api' + path;

    const headers = init?.headers ?? {};

    if (Array.isArray(headers)) {
      headers.push(['x-family-id', familyId]);
    } else if (headers instanceof Headers) {
      headers.set('x-family-id', familyId);
    } else {
      headers['x-family-id'] = familyId;
    }

    return await fetch(url, {...init, headers});
  };
}

export function wait(num: number) {
  return new Promise(resolve => setTimeout(resolve, num));
}

export function createUseQueryWithFetchApi<Args extends object>(
  createPath: (args: Args) => (string | [string, URLSearchParams]),
) {
  return (args: Args) => {
    const fetchApi = useFetchApi();
    const createPathResult = createPath(args);
    let path: string;
    if (typeof createPathResult === 'string') {
      path = createPathResult;
    } else if (Array.isArray(createPathResult)) {
      let [path1, query] = createPathResult;
      query.sort();
      path = path1 + query.toString();
    } else {
      throw new Error('createPathResult is wrong type');
    }

    return useQuery({
      queryKey: ['fetchApi', path],
      queryFn: async () => {
        const response = await fetchApi(path);
        if (!response.ok) throw response;
        return await response.json();
      },
    });
  };
}
