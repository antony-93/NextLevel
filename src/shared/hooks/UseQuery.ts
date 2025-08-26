import { useQuery as useRQQuery } from "@tanstack/react-query";
import type { IRepository } from "../interfaces/RepositoryInterface";
import type { TQueryParams } from "../types/QueryParamsTypes";

type TQueryBase<T> = {
    repository: IRepository<T>
    queryKey: string
}

type TQuery<T> = TQueryBase<T> & TQueryParams<T>

export function useQuery<T>(config: TQuery<T>) {
    const query = useRQQuery({
        queryKey: [config.queryKey, JSON.stringify(config.filters), JSON.stringify(config.sort)],
        queryFn: () => config.repository.get(config)
    })

    return {
        ...query,
        data: query.data ?? []
    }
}

export function useQueryCount<T>(config: TQuery<T>) {
    const query = useRQQuery({
        queryKey: [config.queryKey, 'count', config.filters],
        queryFn: () => config.repository.getCount(config)
    });

    return query;
}

type TQueryById<T> = TQueryBase<T> & {
    id: string
    suspense?: boolean
}

export function useQueryById<T>(config: TQueryById<T>) {
    return useRQQuery({
        queryKey: [config.queryKey, config.id],
        queryFn: () => config.repository.getById(config.id),
        ...(config.suspense && { enabled: false })
    });
}