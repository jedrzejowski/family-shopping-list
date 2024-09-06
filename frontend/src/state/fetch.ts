import {useFamilyId} from './family.tsx';

export function useFetchApi() {
  const familyId = useFamilyId();
  return async (url: string, init?: RequestInit) => {
    // await wait(2000);

    url = '/api' + url;

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
