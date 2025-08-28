import { useInfiniteQuery as useInfiniteRQQuery, useQuery as useRQQuery } from "@tanstack/react-query";
import type { IRepository } from "../interfaces/RepositoryInterface";
import type { TQueryParams, TStartAfterValues } from "../types/QueryParamsTypes";
import type { TPaginatedResult } from "../types/PaginatedResultType";
import { useMemo } from "react";
import { toastError } from "../components/Toast";

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
        queryFn: async () => {
            const result = await config.repository.list(config.queryParams || {});

            if (!result.success) {
                if (result.error) toastError("Erro", result.error.message);
                throw result.error;
            }

            return result.data!;
        },
        retry: false
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
                startAfterValues: pageParam as TStartAfterValues | undefined
            };

            const result = await config.repository.list(queryParams);

            if (!result.success) {
                if (result.error) toastError("Erro", result.error.message);
                throw result.error;
            }

            return result.data!;
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
        retry: false
    });

    const data = useMemo(() => {
        if (!infiniteQuery.data || !('pages' in infiniteQuery.data)) return [];
        
        return infiniteQuery.data.pages.flatMap(page => page.data || []);
    }, [infiniteQuery.data]);

    return {
        ...infiniteQuery,
        data
    };
}

type TQueryById<T> = TQueryBase<T> & {
    id: string
}

export function useQueryById<T>(config: TQueryById<T>) {
    return useRQQuery({
        queryKey: [config.queryKey, config.id],
        queryFn: async () => {
            const result = await config.repository.findById(config.id);

            if (!result.success) {
                if (result.error) toastError("Erro", result.error.message);
                throw result.error;
            }

            return result.data;
        },
        retry: false
    });
}

export function useQueryCount<T>(config: TQueryBase<T>) {
    const query = useRQQuery({
        queryKey: [
            config.queryKey, 
            'count',
            config.queryParams?.filters
        ],
        queryFn: async () => {
            const result = await config.repository.countRecords(config.queryParams || {});

            if (!result.success) {
                if (result.error) toastError("Erro", result.error.message);
                throw result.error;
            }

            return result.data;
        },
        retry: false
    });

    return query;
}