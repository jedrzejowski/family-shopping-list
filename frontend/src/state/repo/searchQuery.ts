import {SearchParams} from '../../model.ts';
import {UseQueryResult} from '@tanstack/react-query';
import * as model from '../../model.ts';

export type UseSearchQuery<Props extends object = object> =
  (args: SearchParams & Props) => UseQueryResult<model.SearchResult<string>, unknown>;

export type UseSearchQueries<Props extends object = object> =
  (args: (SearchParams & Props)[]) => UseQueryResult<model.SearchResult<string>, unknown>[];

