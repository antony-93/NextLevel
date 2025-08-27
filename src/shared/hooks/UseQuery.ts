import { useInfiniteQuery as useInfiniteRQQuery, useQuery as useRQQuery } from "@tanstack/react-query";
import type { IRepository } from "../interfaces/RepositoryInterface";
import type { TQueryParams } from "../types/QueryParamsTypes";
import type { TPaginatedResult } from "../types/PaginatedResultType";

type TQueryBase<T> = {
    repository: IRepository<T>
    queryKey: string
    queryParams?: TQueryParams<T>
}

export function useQuery<T>(config: TQueryBase<T>) {
    const query = useRQQuery<TPaginatedResult<T>>({
        queryKey: [
            config.queryKey, 
            config.queryParams?.filters,
            config.queryParams?.sort,
            config.queryParams?.pageSize
        ],
        queryFn: () => {
            const result = config.repository.get(config.queryParams || {});

            return result;
        }
    })

    return query;
}

export function useQueryInfinite<T>(config: TQueryBase<T>) {
    const infiniteQuery = useInfiniteRQQuery<TPaginatedResult<T>>({
        queryKey: [
            config.queryKey, 
            config.queryParams?.filters,
            config.queryParams?.sort,
            config.queryParams?.pageSize
        ],
        queryFn: async ({ pageParam }) => {
            const queryParams: TQueryParams<T> = {
                pageSize: config.queryParams?.pageSize,
                filters: config.queryParams?.filters,
                sort: config.queryParams?.sort,
                startAfterValues: pageParam as (string | number | boolean | Date | null | undefined)[] | undefined
            };

            return config.repository.get(queryParams);
        },
        getNextPageParam: (lastPage) => {
            if (!lastPage.hasMore) {
                return undefined;
            }

            return lastPage.nextPageCursorValues;
        },
        initialPageParam: undefined,
        staleTime: Infinity,
        gcTime: Infinity,
    });

    return infiniteQuery;
}

export function useQueryCount<T>(config: TQueryBase<T>) {
    const query = useRQQuery({
        queryKey: [
            config.queryKey, 
            'count',
            config.queryParams?.filters,
            config.queryParams?.sort
        ],
        queryFn: () => config.repository.getCount(config.queryParams || {})
    });

    return query;
}

type TQueryById<T> = TQueryBase<T> & {
    id: string
}

export function useQueryById<T>(config: TQueryById<T>) {
    return useRQQuery({
        queryKey: [config.queryKey, config.id],
        queryFn: () => config.repository.getById(config.id)
    });
}