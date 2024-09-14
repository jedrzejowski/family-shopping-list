import {SearchParams} from '../../model.ts';
import {UseQueryResult} from '@tanstack/react-query';
import * as model from '../../model.ts';

export interface UseSearchQuery<Props extends object = {}> {
  (args: SearchParams & Props): UseQueryResult<model.SearchResult<string>, unknown>;
}

export interface UseSearchQueries<Props extends object = {}> {
  (args: (SearchParams & Props)[]): UseQueryResult<model.SearchResult<string>, unknown>[];
}
